use std::fs;
use std::path::Path;
use serde_json::json;

#[tauri::command]
fn create_initial_structure(notes_folder: String) -> Result<(), String> {
    let root = Path::new(&notes_folder);
    
    let notebook_id = uuid::Uuid::new_v4().to_string();
    let section_id = uuid::Uuid::new_v4().to_string();
    let page_id = uuid::Uuid::new_v4().to_string();

    let notebook_path = root.join(&notebook_id);
    let section_path = notebook_path.join(&section_id);
    let page_path = section_path.join(&page_id);

    // Create all nested directories
    fs::create_dir_all(&page_path).map_err(|e| e.to_string())?;

    let now = chrono::Utc::now().to_rfc3339();
    let notebook_color = random_color();
    let section_color = random_color();

    // Create page.json
    let page_json = json!({
        "id": page_id,
        "title": "Untitled Page",
        "createdAt": now,
        "lastModified": now
    });
    fs::write(
        page_path.join("page.json"),
        serde_json::to_string_pretty(&page_json).map_err(|e| e.to_string())?
    ).map_err(|e| e.to_string())?;

    // Create section.json
    let section_json = json!({
        "id": section_id,
        "name": "Untitled Section",
        "color": section_color,
        "pages": [{
            "id": page_id,
            "title": "Untitled Page",
            "createdAt": now,
            "lastModified": now
        }]
    });
    fs::write(
        section_path.join("section.json"),
        serde_json::to_string_pretty(&section_json).map_err(|e| e.to_string())?
    ).map_err(|e| e.to_string())?;

    // Create notebook.json
    let notebook_json = json!({
        "id": notebook_id,
        "name": "Untitled Notebook",
        "color": notebook_color,
        "sections": [{
            "id": section_id,
            "name": "Untitled Section",
            "color": section_color
        }]
    });
    fs::write(
        notebook_path.join("notebook.json"),
        serde_json::to_string_pretty(&notebook_json).map_err(|e| e.to_string())?
    ).map_err(|e| e.to_string())?;

    // Create index.json
    let index_json = json!([{
        "id": notebook_id,
        "name": "Untitled Notebook",
        "color": notebook_color
    }]);
    fs::write(
        root.join("index.json"),
        serde_json::to_string_pretty(&index_json).map_err(|e| e.to_string())?
    ).map_err(|e| e.to_string())?;

    Ok(())
}

fn random_color() -> String {
    use rand::Rng;
    
    let mut rng = rand::thread_rng();
    let r: u8 = rng.gen_range(0..=255);
    let g: u8 = rng.gen_range(0..=255);
    let b: u8 = rng.gen_range(0..=255);
    
    format!("#{:02x}{:02x}{:02x}", r, g, b)
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![create_initial_structure])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
