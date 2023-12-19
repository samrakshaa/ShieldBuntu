use std::fs::OpenOptions;
use std::io::{Read, Write};
use std::process::{Command, Stdio};
use chrono::Utc;
// use serde_json::Value;
use tokio::io::AsyncWriteExt;
use tokio::process::Command as AsyncCommand;
use serde_json::json;
use crate::get_password;

#[tauri::command]
pub async fn install() -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    // let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    // let script_path = current_dir.join("scripts/apply/install.sh");
    // let log_file_path = current_dir.join("logs/install.txt");
    let log_directory = match env::var("HOME") {
        Ok(home) => format!("{}/.samrakshak_logs", home),
        Err(_) => return Err("Could not retrieve user's home directory".to_string()),
    };

    fs::create_dir_all(&log_directory)
        .map_err(|e| format!("Error creating directory: {}", e))?;

        let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/apply/install.sh")
        .expect("failed to resolve resource");

    // Open or create the log file for appending
    let log_file_path = Path::new(&log_directory).join("install_log.txt");

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

    // Run the bash script for applying SSH rules
    let mut child = Command::new("sudo")
        .arg("-S")
        .arg("bash")
        .arg(script_path)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes()).map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    // Capture the output
    let output = child.wait_with_output().map_err(|e| format!("Error waiting for process: {}", e))?;
    
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

        let result = if output.status.success() {
            json!({
                "success": true,
                "logs": log_contents.trim().to_string()
            })
            .to_string()
        } else {
            json!({
                "success": false,
                "logs": log_contents.trim().to_string()
            })
            .to_string()
        };

    Ok(result)
}