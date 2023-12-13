use std::process::Stdio;
use serde_json::Value;
use tokio::process::Command as AsyncCommand;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use crate::get_password;

#[tauri::command]
pub async fn apply_ssh_rules() -> Result<String, String> {

    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    let script_path = current_dir.join("scripts/apply/ssh.sh");

    // Run the bash script for applying firewall rules
    let mut child = AsyncCommand::new("sudo")
        .arg("-k")
        .arg("-S") // Read the password from stdin
        .arg("bash")
        .arg(script_path)
        .stdin(Stdio::piped())
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes()).await.map_err(|e| format!("Error writing to stdin: {}", e))?;
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
}



#[tauri::command]
pub async fn reverse_ssh_rules() -> Result<String, String> {

    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    let script_path = current_dir.join("scripts/reverse/r-ssh.sh");

    // Run the bash script for reversing firewall changes
    let mut child = AsyncCommand::new("sudo")
        .arg("-S") // Read the password from stdin
        .arg("bash")
        .arg(script_path)
        .stdin(Stdio::piped())
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes()).await.map_err(|e| format!("Error writing to stdin: {}", e))?;
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
}


#[tauri::command]
pub async fn check_ssh() -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    let script_path = current_dir.join("scripts/check/check_ssh.sh");

    // Run the bash script for checking firewall rules
    let mut child = AsyncCommand::new("sudo")
        .arg("-k")
        .arg("-S") // Read the password from stdin
        .arg("bash")
        .arg(&script_path)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped()) // Capture stdout
        .stderr(Stdio::piped()) // Capture stderr
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes()).await
            .map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    // Await the child process completion
    let output = child.wait_with_output().await
        .map_err(|e| format!("Error waiting for process: {}", e))?;

    // Check if the command executed successfully
    if output.status.success() {
        let output_str = String::from_utf8(output.stdout)
            .map_err(|e| format!("Failed to read output: {}", e))?;

        // Parse the output as JSON and return
        serde_json::from_str::<Value>(&output_str)
            .map(|json| json.to_string())
            .map_err(|e| format!("Failed to parse output as JSON: {}", e))
    } else {
        let error_output = String::from_utf8(output.stderr)
            .map_err(|e| format!("Failed to read error output: {}", e))?;
        Err(format!("Error executing command: {}", error_output))
    }
}
