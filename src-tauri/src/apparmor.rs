use std::process::Stdio;
use tokio::process::Command as AsyncCommand;

use std::fs;

#[tauri::command]
pub async fn install_and_configure_apparmor(handle : tauri::AppHandle) -> Result<String, String> {
   

    let script_path = handle
    .path_resolver()
    .resolve_resource("scripts/apply/firewall.sh")
    .expect("failed to resolve resource");


    // Check if the script file exists
    if !script_path.exists() {
        return Err(format!("AppArmor script not found at path: {:?}", script_path));
    }

    // Run the bash script to install and configure AppArmor
    let child = AsyncCommand::new("bash")
        .arg("-c")
        .arg(fs::read_to_string(&script_path).map_err(|e| format!("Error reading script file: {}", e))?)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    // Await the child process completion
   

    // Await the child process completion
    let output: std::process::Output = child.wait_with_output().await
        .map_err(|e| format!("Error waiting for process: {}", e))?;


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
