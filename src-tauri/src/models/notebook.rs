use serde::{Deserialize, Serialize};
use super::section::Section;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NotebookIndexItem {
    pub id: String,
    pub name: String,
    pub color: String,
    #[serde(rename = "isExpanded")]
    pub is_expanded: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NotebookData {
    pub id: String,
    pub name: String,
    pub color: String,
    #[serde(rename = "isExpanded")]
    pub is_expanded: bool,
    pub sections: Vec<Section>,
}