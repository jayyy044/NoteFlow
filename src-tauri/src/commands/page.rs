use crate::services::PageService;

#[tauri::command]
pub fn rename_page(
    notes_folder: String,
    notebook_id: String,
    section_id: String,
    page_id: String,
    new_title: String
) -> Result<(), String> {
    PageService::rename_page(&notes_folder, &notebook_id, &section_id, &page_id, &new_title)
}