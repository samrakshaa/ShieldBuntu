use std::{process::{Stdio, Command}, env, fs::{self, OpenOptions}, path::Path};
use crate::get_password;
use chrono::Utc;
use tauri::AppHandle;
use std::io::Write;
use serde_json::json;


#[tauri::command]
pub async fn grub_pass_check(handle: AppHandle) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/apply/grub_password_check.sh")
        .expect("failed to resolve resource");

    let mut child = Command::new("sudo")
        .arg("-S")
        .arg("bash")
        .arg(script_path.to_str().unwrap())
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes())
            .map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    let output = child.wait_with_output()
        .map_err(|e| format!("Error waiting for process: {}", e))?;

    let output_str = String::from_utf8_lossy(&output.stdout).trim().to_string();

    let is_password_set = output_str == "true";

    let result = json!({
        "success": is_password_set
    });
    Ok(result.to_string())
}


#[tauri::command]
pub async fn grub_pass_add(handle: AppHandle, pass: String) -> Result<String, String> {
    let sudo_password = get_password().ok_or_else(|| "Password not available".to_string())?;

    let log_directory = match env::var("HOME") {
        Ok(home) => format!("{}/.shieldbuntu_logs", home),
        Err(_) => return Err("Could not retrieve user's home directory".to_string()),
    };

    fs::create_dir_all(&log_directory)
        .map_err(|e| format!("Error creating directory: {}", e))?;

    let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/apply/grub_password_add.sh")
        .expect("failed to resolve resource");

    let log_file_path = Path::new(&log_directory).join("grub_pass_add_log.txt");

    let mut file = OpenOptions::new()
        .create(true)
        .write(true)
        .truncate(true)
        .open(&log_file_path)
        .map_err(|e| format!("Error opening log file: {}", e))?;

    let datetime = Utc::now().format("[%Y-%m-%d %H:%M:%S]").to_string();
    file.write_all(format!("\n\n{}\n\n", datetime).as_bytes())
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    let mut child = Command::new("sudo")
        .arg("-S")
        .arg("bash")
        .arg(script_path.to_str().unwrap())
        .arg(&pass)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(format!("{}\n", sudo_password).as_bytes())
            .map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    let output = child.wait_with_output()
        .map_err(|e| format!("Error waiting for process: {}", e))?;

    file.write_all(&output.stdout)
        .map_err(|e| format!("Error writing to log file: {}", e))?;

    let log_contents = String::from_utf8_lossy(&output.stdout).trim().to_string();

    let result = json!({
        "success": output.status.success(),
        "logs": log_contents
    });
    Ok(result.to_string())
}