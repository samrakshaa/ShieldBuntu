use std::{process::{Command, Stdio}, io::Write};
use serde_json::json;
use tauri::AppHandle;

use crate::get_password;

#[tauri::command]
pub async fn check_sudo_user(handle: AppHandle, port: Option<String>, action: Option<String>) -> Result<String, String> {
    let password = get_password().ok_or_else(|| "Password not available".to_string())?;
    let script_path = handle
        .path_resolver()
        .resolve_resource("scripts/apply/check_sudo.sh")
        .expect("failed to resolve resource");

    let mut cmd = Command::new("sudo");
    cmd.arg("-S")
        .arg("bash")
        .arg(script_path.to_str().unwrap())
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    if let Some(p) = port {
        cmd.arg(&p);
    }

    if let Some(a) = action {
        cmd.arg(&a);
    }

    let mut child = cmd.spawn()
        .map_err(|e| format!("Error spawning process: {}", e))?;

    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(format!("{}\n", password).as_bytes())
            .map_err(|e| format!("Error writing to stdin: {}", e))?;
    }

    let output = child.wait_with_output()
        .map_err(|e| format!("Error waiting for process: {}", e))?;

    let output_str = String::from_utf8_lossy(&output.stdout).trim().to_string();

    let result = json!({
        "success": output.status.success(),
        "output": output_str
    }).to_string();

    Ok(result)
}
