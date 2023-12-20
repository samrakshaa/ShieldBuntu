use std::process::Stdio;
use serde_json::json;
use tokio::process::Command as AsyncCommand;
use tokio::io::AsyncWriteExt;
use crate::get_password;

#[tauri::command]
pub async fn check_username(handle : tauri::AppHandle) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    // let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    // let script_path = current_dir.join("scripts/check/check_username.sh");

    let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/check/check_username.sh")
        .expect("failed to resolve resource");

    // Run the bash script for checking firewall status
    let mut child = AsyncCommand::new("sudo")
        .arg("-S")
        .arg("bash")
        .arg(script_path)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
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
    let result = if output.status.success() {
        json!({ "success": true}).to_string()
    } else {
        json!({ "success": false}).to_string()
    };

    Ok(result)
}
