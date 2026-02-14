import { useState, useEffect } from "react";
import { load } from "@tauri-apps/plugin-store";
import { invoke } from "@tauri-apps/api/core";
import FolderForm from "./components/FolderForm/FolderForm";
import "./App.css";

function App() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSetup();
  }, []);

  async function checkSetup() {
    try {
      const store = await load("settings.json", { autoSave: true });
      const folder = await store.get("notesFolder");
      if (folder) {
        setIsSetupComplete(true);
      }
    } catch (error) {
      console.error("Error checking setup:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFolderSelected(folderPath) {
    try {
      // Call the Rust function to create the initial structure
      await invoke("create_initial_structure", { notesFolder: folderPath });
      
      // Save the folder path to settings
      const store = await load("settings.json", { autoSave: true });
      await store.set("notesFolder", folderPath);
      await store.save();
      
      setIsSetupComplete(true);
    } catch (error) {
      console.error("Error during setup:", error);
    }
  }

  if (loading) return null;

  return (
    <>
      {isSetupComplete
        ? <p>Hello</p>
        : <FolderForm onFolderSelected={handleFolderSelected} />
      }
    </>
  );
}

export default App;