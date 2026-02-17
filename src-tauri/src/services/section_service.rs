use std::fs;
use std::path::Path;
use serde_json::json;
use crate::models::SectionData;

pub struct SectionService;

impl SectionService {
    pub fn read_section(
        notes_folder: &str,
        notebook_id: &str,
        section_id: &str
    ) -> Result<SectionData, String> {
        let section_path = Path::new(notes_folder)
            .join(notebook_id)
            .join(section_id)
            .join("section.json");
        
        if !section_path.exists() {
            return Err(format!("Section not found: {}", section_id));
        }
        
        let content = fs::read_to_string(&section_path).map_err(|e| e.to_string())?;
        let section: SectionData = serde_json::from_str(&content)
            .map_err(|e| e.to_string())?;
        
        Ok(section)
    }

    pub fn rename_section(
        notes_folder: &str,
        notebook_id: &str,
        section_id: &str,
        new_name: &str
    ) -> Result<(), String> {
        let root = Path::new(notes_folder);
        
        // Update notebook.json
        let notebook_json_path = root.join(notebook_id).join("notebook.json");
        let mut notebook_data: serde_json::Value = {
            let content = fs::read_to_string(&notebook_json_path).map_err(|e| e.to_string())?;
            serde_json::from_str(&content).map_err(|e| e.to_string())?
        };
        
        if let Some(sections) = notebook_data["sections"].as_array_mut() {
            for section in sections {
                if section["id"] == section_id {
                    section["name"] = json!(new_name);
                    break;
                }
            }
        }
        
        fs::write(
            notebook_json_path,
            serde_json::to_string_pretty(&notebook_data).map_err(|e| e.to_string())?
        ).map_err(|e| e.to_string())?;
        
        // Update section.json
        let section_json_path = root.join(notebook_id).join(section_id).join("section.json");
        let mut section_data: serde_json::Value = {
            let content = fs::read_to_string(&section_json_path).map_err(|e| e.to_string())?;
            serde_json::from_str(&content).map_err(|e| e.to_string())?
        };
        
        section_data["name"] = json!(new_name);
        
        fs::write(
            section_json_path,
            serde_json::to_string_pretty(&section_data).map_err(|e| e.to_string())?
        ).map_err(|e| e.to_string())?;
        
        Ok(())
    }
}