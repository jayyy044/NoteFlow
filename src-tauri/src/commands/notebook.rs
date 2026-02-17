use crate::services::NotebookService;
use crate::models::{NotebookIndexItem, NotebookData};

#[tauri::command]
pub fn create_initial_structure(notes_folder: String) -> Result<(), String> {
    NotebookService::create_initial_structure(&notes_folder)
}

#[tauri::command]
pub fn read_index(notes_folder: String) -> Result<Vec<NotebookIndexItem>, String> {
    NotebookService::read_index(&notes_folder)
}

#[tauri::command]
pub fn read_notebook(notes_folder: String, notebook_id: String) -> Result<NotebookData, String> {
    NotebookService::read_notebook(&notes_folder, &notebook_id)
}

#[tauri::command]
pub fn add_notebook(notes_folder: String) -> Result<String, String> {
    let notebook = NotebookService::add_notebook(&notes_folder)?;
    serde_json::to_string(&notebook).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn rename_notebook(
    notes_folder: String,
    notebook_id: String,
    new_name: String
) -> Result<(), String> {
    NotebookService::rename_notebook(&notes_folder, &notebook_id, &new_name)
}