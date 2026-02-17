use std::fs;
use std::path::Path;
use serde_json::json;
use crate::utils::current_timestamp;

pub struct PageService;

impl PageService {
    pub fn rename_page(
        notes_folder: &str,
        notebook_id: &str,
        section_id: &str,
        page_id: &str,
        new_title: &str
    ) -> Result<(), String> {
        let root = Path::new(notes_folder);
        
        // Update section.json
        let section_json_path = root.join(notebook_id).join(section_id).join("section.json");
        let mut section_data: serde_json::Value = {
            let content = fs::read_to_string(&section_json_path).map_err(|e| e.to_string())?;
            serde_json::from_str(&content).map_err(|e| e.to_string())?
        };
        
        if let Some(pages) = section_data["pages"].as_array_mut() {
            for page in pages {
                if page["id"] == page_id {
                    page["title"] = json!(new_title);
                    page["lastModified"] = json!(current_timestamp());
                    break;
                }
            }
        }
        
        fs::write(
            section_json_path,
            serde_json::to_string_pretty(&section_data).map_err(|e| e.to_string())?
        ).map_err(|e| e.to_string())?;
        
        // Update page.json
        let page_json_path = root.join(notebook_id).join(section_id).join(page_id).join("page.json");
        let mut page_data: serde_json::Value = {
            let content = fs::read_to_string(&page_json_path).map_err(|e| e.to_string())?;
            serde_json::from_str(&content).map_err(|e| e.to_string())?
        };
        
        page_data["title"] = json!(new_title);
        page_data["lastModified"] = json!(current_timestamp());
        
        fs::write(
            page_json_path,
            serde_json::to_string_pretty(&page_data).map_err(|e| e.to_string())?
        ).map_err(|e| e.to_string())?;
        
        Ok(())
    }
}