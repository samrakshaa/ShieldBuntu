use std::process::Stdio;
use tokio::process::Command as AsyncCommand;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use crate::get_password;

#[tauri::command]
pub async fn update_and_upgrade_packages() -> Result<String, String> {
    // Get the sudo password
    let sudo_password = get_password();

    // Check if the sudo password is available
    if let Some(password) = sudo_password {
        // Path to the script
        let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
        let script_path = current_dir.join("scripts/update_packages.sh");

        // Run the bash script for updating and upgrading packages with sudo
        let mut child = AsyncCommand::new("sudo")
            .arg("-k")
            .arg("-S")  // Read password from standard input
            .arg("bash")
            .arg("-c")
            .arg(&script_path)
            .stdin(Stdio::piped())  // Set up stdin to pass the password
            .stdout(Stdio::inherit())
            .stderr(Stdio::inherit())
            .spawn()
            .map_err(|e| format!("Error spawning process: {}", e))?;

        // Pass the password to the child process stdin
        if let Some(mut stdin) = child.stdin.take() {
            stdin.write_all(password.as_bytes()).await.map_err(|e| format!("Error writing to stdin: {}", e))?;
        }

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
            Err(format!("Error executing command: {}", error_output))
        }
    } else {
        Err("Sudo password not available".to_string())
    }
}
