use std::process::Stdio;
use serde_json::json;
use tokio::process::Command as AsyncCommand;

use std::fs;

// #[tauri::command]
// pub async fn run_autoupdate_script() -> Result<String, String> {
//     let current_dir = std::env::current_dir().map_err(|e| format!("Error getting current directory: {}", e))?;
//     let script_path = current_dir.join("scripts/apply/autoupdate.sh");

//     // Check if the script file exists
//     if !script_path.exists() {
//         return Err(format!("Autoupdate script not found at path: {:?}", script_path));
//     }

//     // Run the bash script for autoupdate
//     let mut child = AsyncCommand::new("bash")
//         .arg("-c")
//         .arg(fs::read_to_string(&script_path).map_err(|e| format!("Error reading script file: {}", e))?)
//         .stdout(Stdio::inherit())
//         .stderr(Stdio::inherit())
//         .spawn()
//         .map_err(|e| format!("Error spawning process: {}", e))?;

//     // Await the child process completion
//     let status = child.wait().await.map_err(|e| format!("Error waiting for process: {}", e))?;

//     // Check if the command executed successfully
//     if status.success() {
//         Ok(true.to_string())
//     } else {
//         let mut error_output = String::new();
//         if let Some(mut stderr) = child.stderr.take() {
//             stderr.read_to_string(&mut error_output).await.map_err(|e| format!("Error reading stderr: {}", e))?;
//         }
//         Err(format!("Error executing Autoupdate script: {}", error_output))
//     }
// }

#[tauri::command]
pub async fn run_autoupdate_script(handle: tauri::AppHandle) -> Result<String, String> {
    // Get the current directory
    // let current_dir = std::env::current_dir()
    //     .map_err(|e| format!("Error getting current directory: {}", e))?;

    // Build the path to the autoupdate script
    // let script_path = current_dir.join("scripts/apply/autoupdate.sh");

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
    let mut child = AsyncCommand::new("bash")
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
