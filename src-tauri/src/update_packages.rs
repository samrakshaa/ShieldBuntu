
use std::process::{Command, Stdio};
use serde::{Serialize, Deserialize};
use std::env;
use tokio::process::Command as AsyncCommand;
use tokio::io::{AsyncReadExt};

#[tauri::command]
pub async fn update_and_upgrade_packages() -> Result<String, String> {
    let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    let script_path = current_dir.join("scripts/update_packages.sh");

    // Run the bash script for updating and upgrading packages
    let mut child = AsyncCommand::new("bash")
        .arg("-c")
        .arg(&script_path)
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    let status = child.wait().await.map_err(|e| format!("Error waiting for process: {}", e))?;

    // Check if the command executed successfully
    if status.success() {
        Ok(true.to_string())
    } else {
        let mut error_output = String::new();
        if let Some(mut stderr) = child.stderr.take() {
            stderr.read_to_string(&mut error_output).await.map_err(|e| format!("Error reading stderr: {}", e))?;
        }
        Err(format!("Error executing command: {}", error_output))
    }
}