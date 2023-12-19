use std::process::Stdio;
use serde_json::json;
use tokio::io::AsyncWriteExt;
use crate::get_password;

use tokio::process::Command as AsyncCommand;



#[tauri::command]
pub async fn check_fail2ban(handle: tauri::AppHandle) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
   

    let script_path = handle
    .path_resolver()
    .resolve_resource("scripts/check/check_fail2ban.sh")
    .expect("failed to resolve resource");

    // Run the bash script for checking fail2ban status
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

   

    let result = if output.status.success() {
        json!({ "success": true }).to_string()
    } else {
        json!({ "success": false }).to_string()
    };

    Ok(result)
}


#[allow(dead_code)]
#[tauri::command]
pub async fn check_calmav(handle: tauri::AppHandle) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
   

    let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/check/check_calmav.sh")
        .expect("failed to resolve resource");

    // Run the bash script for checking calmav status
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

  
    let result = if output.status.success() {
        json!({ "success": true }).to_string()
    } else {
        json!({ "success": false }).to_string()
    };

    Ok(result)
}

#[tauri::command]
pub async fn check_rkhunter(handle: tauri::AppHandle) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;

    let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/check/check_rkhunter.sh")
        .expect("failed to resolve resource");

    // Run the bash script for checking rkhunter status
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


    let result = if output.status.success() {
        json!({ "success": true }).to_string()
    } else {
        json!({ "success": false }).to_string()
    };

    Ok(result)
}

#[tauri::command]
pub async fn check_unused_package() -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
    let script_path = current_dir.join("scripts/check/check_unused_package.sh");

    // Run the bash script for checking fail2ban status
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
    if output.status.success() {
        let output_str = String::from_utf8(output.stdout)
            .map_err(|e| format!("Failed to read output: {}", e))?;

        Ok(output_str)  // Return the output directly
    } else {
        let error_output = String::from_utf8(output.stderr)
            .map_err(|e| format!("Failed to read error output: {}", e))?;
        Err(format!("Error executing command: {}", error_output))
    }
}


#[allow(dead_code)]
#[tauri::command]
pub async fn check_apparmor(handle: tauri::AppHandle) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;

    let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/check/check_apparmor.sh")
        .expect("failed to resolve resource");

    // Run the bash script for checking rkhunter status
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

    
    let result = if output.status.success() {
        json!({ "success": true }).to_string()
    } else {
        json!({ "success": false }).to_string()
    };

    Ok(result)
}




