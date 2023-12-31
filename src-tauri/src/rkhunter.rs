use std::{process::Stdio, path::Path, fs::OpenOptions, io::Write};
use chrono::Utc;
use serde_json::json;
use tokio::{process::Command as AsyncCommand, io::AsyncWriteExt};

use std::{fs, env};

use crate::get_password;

#[tauri::command]
pub async fn install_and_configure_rkhunter(handle : tauri::AppHandle) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;

    let log_directory = match env::var("HOME") {
        Ok(home) => format!("{}/.shieldbuntu_logs", home),
        Err(_) => return Err("Could not retrieve user's home directory".to_string()),
    };

    fs::create_dir_all(&log_directory)
        .map_err(|e| format!("Error creating directory: {}", e))?;

        let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/apply/fail2ban.sh")
        .expect("failed to resolve resource");

    // Open or create the log file for appending
    let log_file_path = Path::new(&log_directory).join("fail2ban_logs.txt");
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

    // Check if the script file exists
    if !script_path.exists() {
        return Err(format!("RKHunter script not found at path: {:?}", script_path));
    }

    // Run the bash script to install and configure RKHunter
    let mut child = AsyncCommand::new("bash")
        .arg("-c")
        .arg(fs::read_to_string(&script_path).map_err(|e| format!("Error reading script file: {}", e))?)
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    // Await the child process completion
    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes()).await
            .map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    // Await the child process completion
    let output: std::process::Output = child.wait_with_output().await
        .map_err(|e| format!("Error waiting for process: {}", e))?;

    // Check if the command executed successfully
    let result = if output.status.success() {
        json!({ "success": true }).to_string()
    } else {
        json!({ "success": false }).to_string()
    };

    Ok(result)
}
