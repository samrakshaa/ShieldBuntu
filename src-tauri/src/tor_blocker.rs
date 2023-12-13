use std::process::Stdio;
use tokio::process::Command as AsyncCommand;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use crate::get_password;

#[tauri::command]
pub async fn block_tor_access() -> Result<String, String> {
    // Get the sudo password
    let sudo_password = get_password();

    // Check if the sudo password is available
    if let Some(password) = sudo_password {
        // Path to the script
        let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
        let script_path = current_dir.join("scripts/apply/tor_blocker.sh");

        // Run the bash script to block Tor access with sudo
        let mut child = AsyncCommand::new("sudo")
            .arg("-k")
            .arg("-S")  // Read password from standard input
            .arg("bash")
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
            Err(format!("Error blocking Tor access: {}", error_output))
        }
    } else {
        Err("Sudo password not available".to_string())
    }
}


#[tauri::command]
pub async fn check_tor_blocked() -> Result<String, String> {
    let sudo_password = get_password();

    if let Some(password) = sudo_password {
        let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
        let script_path = current_dir.join("scripts/check/check_tor_blocked.sh");

        let mut child = AsyncCommand::new("sudo")
            .arg("-k")
            .arg("-S")
            .arg("bash")
            .arg(&script_path)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|e| format!("Error spawning process: {}", e))?;

        if let Some(mut stdin) = child.stdin.take() {
            stdin.write_all(password.as_bytes()).await.map_err(|e| format!("Error writing to stdin: {}", e))?;
        }

        let output = child.wait_with_output().await.map_err(|e| format!("Error waiting for process: {}", e))?;

        if output.status.success() {
            let output_str = String::from_utf8(output.stdout)
                .map_err(|e| format!("Failed to read output: {}", e))?;
            Ok(output_str.trim().to_string())
        } else {
            let error_output = String::from_utf8(output.stderr)
                .map_err(|e| format!("Failed to read error output: {}", e))?;
            Err(format!("Error checking Tor block status: {}", error_output))
        }
    } else {
        Err("Sudo password not available".to_string())
    }
}
