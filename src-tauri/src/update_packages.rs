use std::path::Path;
use std::{env, fs};
use std::fs::OpenOptions;
use std::io::{Read, Write};
use std::process::Stdio;
use serde_json::json;
use tokio::process::Command as AsyncCommand;
use tokio::io::AsyncWriteExt;
use chrono::Utc;
use crate::get_password;

#[tauri::command]
pub async fn update_and_upgrade_packages(handle : tauri::AppHandle) -> Result<String, String> {
    let sudo_password = get_password();

    if let Some(password) = sudo_password {
      
        let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/apply/update_packages.sh")
        .expect("failed to resolve resource");

    let log_directory = match env::var("HOME") {
        Ok(home) => format!("{}/.samrakshak_logs", home),
        Err(_) => return Err("Could not retrieve user's home directory".to_string()),
    };

    fs::create_dir_all(&log_directory)
        .map_err(|e| format!("Error creating directory: {}", e))?;

    let log_file_path = Path::new(&log_directory).join("update_packages_log.txt");

        // Open or create the log file for appending
        let mut file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(&log_file_path)
            .map_err(|e| format!("Error opening log file: {}", e))?;

        // Write the current date and time to the log file
        let datetime = Utc::now().format("[%Y-%m-%d %H:%M:%S]").to_string();
        file.write_all(format!("\n\n{}\n\n", datetime).as_bytes())
            .map_err(|e| format!("Error writing to log file: {}", e))?;

        // Run the bash script for updating and upgrading packages
        let mut child = AsyncCommand::new("sudo")
            .arg("-S")
            .arg("bash")
            .arg("-c")
            .arg(&script_path)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|e| format!("Error spawning process: {}", e))?;

        if let Some(mut stdin) = child.stdin.take() {
            stdin.write_all(password.as_bytes()).await.map_err(|e| format!("Error writing to stdin: {}", e))?;
        }

        // Capture the output
        let output = child.wait_with_output().await.map_err(|e| format!("Error waiting for process: {}", e))?;
        
        // Write the output to the log file
        file.write_all(&output.stdout)
            .and_then(|_| file.write_all(&output.stderr))
            .map_err(|e| format!("Error writing to log file: {}", e))?;

        // Read the entire log file to include in the response
        let mut file = OpenOptions::new()
            .read(true)
            .open(&log_file_path)
            .map_err(|e| format!("Error opening log file: {}", e))?;

        let mut log_contents = String::new();
        file.read_to_string(&mut log_contents)
            .map_err(|e| format!("Error reading log file: {}", e))?;

        // Construct the JSON-like return value
        let result = if output.status.success() {
            json!({ "success": true }).to_string()
        } else {
            json!({ "success": false }).to_string()
        };
        Ok(result)

        
    } else {
        Err("Sudo password not available".to_string())
    }
}