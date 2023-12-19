use std::io::Write;
use std::process::{Command, Stdio};
use std::fs::{OpenOptions, self};
use std::path::Path;
use std::env;
use chrono::Utc;
use serde_json::json;
use tauri::AppHandle;
// use tokio::io::AsyncWriteExt;

use crate::get_password;

#[tauri::command]
pub async fn remove_unused_packages(handle: AppHandle) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;

    let log_directory = match env::var("HOME") {
        Ok(home) => format!("{}/.samrakshak_logs", home),
        Err(_) => return Err("Could not retrieve user's home directory".to_string()),
    };

    fs::create_dir_all(&log_directory)
        .map_err(|e| format!("Error creating directory: {}", e))?;

    let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/apply/unused_package_remover.sh")
        .expect("failed to resolve resource");

    let log_file_path = Path::new(&log_directory).join("unused_package_removal_log.txt");

    let mut file = OpenOptions::new()
        .create(true)
        .write(true)
        .truncate(true)
        .open(&log_file_path)
        .map_err(|e| format!("Error opening log file: {}", e))?;

    let datetime = Utc::now().format("[%Y-%m-%d %H:%M:%S]").to_string();
    file.write_all(format!("\n\n{}\n\n", datetime).as_bytes())
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    let mut child = Command::new("bash")
        .arg(script_path.to_str().unwrap())
        .arg(&password)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    let output = child.wait_with_output()
        .map_err(|e| format!("Error waiting for process: {}", e))?;

    file.write_all(&output.stdout)
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    let result = json!({ "logs": String::from_utf8_lossy(&output.stdout).trim() }).to_string();
    Ok(result)
}