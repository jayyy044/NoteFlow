use serde::{Deserialize, Serialize};
use super::page::Page;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Section {
    pub id: String,
    pub name: String,
    pub color: String,
    #[serde(rename = "isExpanded")]
    pub is_expanded: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SectionData {
    pub id: String,
    pub name: String,
    pub color: String,
    #[serde(rename = "isExpanded")]
    pub is_expanded: bool,
    pub pages: Vec<Page>,
}