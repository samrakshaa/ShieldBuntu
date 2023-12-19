use std::process::Stdio;
use serde_json::json;
use tokio::process::Command as AsyncCommand;



#[tauri::command]
pub async fn install_and_configure_fail2ban(handle: tauri::AppHandle) -> Result<String, String> {


    let script_path = handle
    .path_resolver()
    .resolve_resource("scripts/apply/fail2ban.sh")
    .expect("failed to resolve resource");

    // Check if the script file exists
    if !script_path.exists() {
        return Err(format!("Fail2Ban script not found at path: {:?}", script_path));
    }


    // Run the bash script to install and configure Fail2Ban
    let mut child = AsyncCommand::new("sudo")
    .arg("-S")
    .arg("bash")
    .arg(script_path)
    .stdin(Stdio::piped())
    .stdout(Stdio::piped())
    .stderr(Stdio::piped())
    .spawn()
    .map_err(|e| format!("Error spawning process: {}", e))?;

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

