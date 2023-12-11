use std::process::Stdio;
// use serde::{Serialize, Deserialize};
// use std::env;
// use tokio::process::Command as AsyncCommand;
use tokio::io::AsyncReadExt;

#[tauri::command]
pub async fn remove_unused_packages() -> Result<String, String> {
    let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    let script_path = current_dir.join("scripts/unused_package_remover.sh");

    // Run the bash script to remove unused packages
    let mut child = tokio::process::Command::new("bash")
        .arg(&script_path)
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    // Await the child process completion
    let status = child.wait().await.map_err(|e| format!("Error waiting for process: {}", e))?;

    // Check if the command executed successfully
    if status.success() {
        Ok(true.to_string())
    } else {
        let mut error_output = String::new();
        if let Some(mut stderr) = child.stderr.take() {
            stderr.read_to_string(&mut error_output).await.map_err(|e| format!("Error reading stderr: {}", e))?;
        }
        Err(format!("Error removing unused packages: {}", error_output))
    }
}