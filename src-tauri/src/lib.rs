use std::fs;
use std::path::Path;
use serde_json::json;
use serde::{Deserialize, Serialize};

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
        "isExpanded": false,
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
        "isExpanded": false,
        "sections": [{
            "id": section_id,
            "name": "Untitled Section",
            "color": section_color,
            "isExpanded": false
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
        "color": notebook_color,
        "isExpanded": false
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
    // Use range 150-255 for lighter colors
    let r: u8 = rng.gen_range(100..=255);
    let g: u8 = rng.gen_range(100..=255);
    let b: u8 = rng.gen_range(100..=255);
    
    format!("#{:02x}{:02x}{:02x}", r, g, b)
}

#[derive(Debug, Serialize, Deserialize)]
struct NotebookIndexItem {
    id: String,
    name: String,
    color: String,
}

#[tauri::command]
fn read_index(notes_folder: String) -> Result<Vec<NotebookIndexItem>, String> {
    let index_path = Path::new(&notes_folder).join("index.json");
    
    if !index_path.exists() {
        return Ok(Vec::new());
    }
    
    let content = fs::read_to_string(&index_path).map_err(|e| e.to_string())?;
    let notebooks: Vec<NotebookIndexItem> = serde_json::from_str(&content).map_err(|e| e.to_string())?;
    
    Ok(notebooks)
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Section {
    id: String,
    name: String,
    color: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct NotebookData {
    id: String,
    name: String,
    color: String,
    sections: Vec<Section>,
}

#[tauri::command]
fn read_notebook(notes_folder: String, notebook_id: String) -> Result<NotebookData, String> {
    let notebook_path = Path::new(&notes_folder)
        .join(&notebook_id)
        .join("notebook.json");
    
    if !notebook_path.exists() {
        return Err(format!("Notebook not found: {}", notebook_id));
    }
    
    let content = fs::read_to_string(&notebook_path).map_err(|e| e.to_string())?;
    let notebook: NotebookData = serde_json::from_str(&content).map_err(|e| e.to_string())?;
    
    Ok(notebook)
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Page {
    id: String,
    title: String,
    #[serde(rename = "createdAt")]
    created_at: String,
    #[serde(rename = "lastModified")]
    last_modified: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct SectionData {
    id: String,
    name: String,
    color: String,
    #[serde(rename = "isExpanded")]
    is_expanded: bool,
    pages: Vec<Page>,
}

#[tauri::command]
fn read_section(notes_folder: String, notebook_id: String, section_id: String) -> Result<SectionData, String> {
    let section_path = Path::new(&notes_folder)
        .join(&notebook_id)
        .join(&section_id)
        .join("section.json");
    
    if !section_path.exists() {
        return Err(format!("Section not found: {}", section_id));
    }
    
    let content = fs::read_to_string(&section_path).map_err(|e| e.to_string())?;
    let section: SectionData = serde_json::from_str(&content).map_err(|e| e.to_string())?;
    
    Ok(section)
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            create_initial_structure, 
            read_index,
            read_notebook,
            read_section
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
