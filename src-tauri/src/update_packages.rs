use std::fs::OpenOptions;
use std::io::{Read, Write};
use std::process::Stdio;
use tokio::process::Command as AsyncCommand;
use tokio::io::AsyncWriteExt;
use chrono::Utc;
use crate::get_password;

#[tauri::command]
pub async fn update_and_upgrade_packages() -> Result<String, String> {
    let sudo_password = get_password();

    if let Some(password) = sudo_password {
        let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
        let script_path = current_dir.join("scripts/apply/update_packages.sh");
        let log_file_path = current_dir.join("logs/update_packages_log.txt");

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
            format!(r#"{{"success": true, "logs": "{}"}}"#, log_contents)
        } else {
            format!(r#"{{"success": false, "logs": "{}"}}"#, log_contents)
        };

        Ok(result)
    } else {
        Err("Sudo password not available".to_string())
    }
}