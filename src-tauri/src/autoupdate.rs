use std::process::Stdio;
use serde_json::json;
use tokio::process::Command as AsyncCommand;
use std::fs;


#[tauri::command]
pub async fn run_autoupdate_script(handle: tauri::AppHandle) -> Result<String, String> {
   

    let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/apply/autoupdate.sh")
        .expect("failed to resolve resource");

    // Check if the script file exists
    if !script_path.exists() {
        return Err(format!("Autoupdate script not found at path: {:?}", script_path));
    }

    // Read the script content
    let script_content = fs::read_to_string(&script_path)
        .map_err(|e| format!("Error reading script file: {}", e))?;

    // Run the bash script for autoupdate
    let child = AsyncCommand::new("bash")
        .arg("-c")
        .arg(&script_content)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    // Capture the output
    let output = child.wait_with_output().await.map_err(|e| format!("Error waiting for process: {}", e))?;

    // Construct the JSON-like return value
    let result = if output.status.success() {
        json!({ "success": true }).to_string()
    } else {
        json!({ "success": false }).to_string()
    };
    Ok(result)
}
