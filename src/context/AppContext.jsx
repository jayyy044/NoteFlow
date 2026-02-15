import { createContext, useContext, useState, useEffect } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { invoke } from '@tauri-apps/api/core';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [notesFolder, setNotesFolder] = useState(null);
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  async function initializeApp() {
    try {
      const store = await load('settings.json', { autoSave: true });
      const folder = await store.get('notesFolder');
      
      if (folder) {
        setNotesFolder(folder);
        setIsSetupComplete(true);
        await loadNotebooks(folder);
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadNotebooks(folder) {
    try {
      const indexData = await invoke('read_index', { notesFolder: folder });
      // Add sections property set to null (not fetched yet)
      const notebooksWithState = indexData.map(nb => ({
        ...nb,
        sections: null
      }));
      setNotebooks(notebooksWithState);
    } catch (error) {
      console.error('Error loading notebooks:', error);
      setNotebooks([]);
    }
  }

  async function setupNotesFolder(folderPath) {
    try {
      await invoke('create_initial_structure', { notesFolder: folderPath });
      
      const store = await load('settings.json', { autoSave: true });
      await store.set('notesFolder', folderPath);
      await store.save();
      
      setNotesFolder(folderPath);
      setIsSetupComplete(true);
      await loadNotebooks(folderPath);
    } catch (error) {
      console.error('Error during setup:', error);
      throw error;
    }
  }

  async function toggleNotebook(notebookId) {
    // Get the current notebook
    const notebook = notebooks.find(nb => nb.id === notebookId);

    if (notebook && notebook.sections === null) {
      try {
        const notebookData = await invoke('read_notebook', {
          notesFolder: notesFolder,
          notebookId: notebookId
        });
        
        // Sections already come with isExpanded from the JSON file
        const sections = (notebookData.sections || []).map(section => ({
          ...section,
          pages: null  // Add this!
        }));
        
        // Update notebook with fetched sections AND toggle isExpanded
        setNotebooks(prevNotebooks =>
          prevNotebooks.map(nb =>
            nb.id === notebookId
              ? { ...nb, sections: sections, isExpanded: !nb.isExpanded }
              : nb
          )
        );
      } 
      catch (error) {
        console.error('Error loading notebook sections:', error);
        // On error, set to empty array and still toggle
        setNotebooks(prevNotebooks =>
          prevNotebooks.map(nb =>
            nb.id === notebookId
              ? { ...nb, sections: [], isExpanded: !nb.isExpanded }
              : nb
          )
        );
      }
    } 
    else {
      // Sections already loaded, just toggle isExpanded
      setNotebooks(prevNotebooks =>
        prevNotebooks.map(nb =>
          nb.id === notebookId
            ? { ...nb, isExpanded: !nb.isExpanded }
            : nb
        )
      );
    }
  }

  async function toggleSection(notebookId, sectionId) {
    // Get the current notebook and section
    const notebook = notebooks.find(nb => nb.id === notebookId);
    const section = notebook?.sections?.find(s => s.id === sectionId);

    if (section && section.pages === null) {
      console.log('reight place')
      try {
        const sectionData = await invoke('read_section', {
          notesFolder: notesFolder,
          notebookId: notebookId,
          sectionId: sectionId
        });
        
        // Pages already come from the JSON file
        const pages = sectionData.pages || [];
        
        // Update section with fetched pages AND toggle isExpanded
        setNotebooks(prevNotebooks =>
          prevNotebooks.map(nb =>
            nb.id === notebookId
              ? {
                  ...nb,
                  sections: nb.sections.map(s =>
                    s.id === sectionId
                      ? { ...s, pages: pages, isExpanded: !s.isExpanded }
                      : s
                  )
                }
              : nb
          )
        );
      } 
      catch (error) {
        console.error('Error loading section pages:', error);
        // On error, set to empty array and still toggle
        setNotebooks(prevNotebooks =>
          prevNotebooks.map(nb =>
            nb.id === notebookId
              ? {
                  ...nb,
                  sections: nb.sections.map(s =>
                    s.id === sectionId
                      ? { ...s, pages: [], isExpanded: !s.isExpanded }
                      : s
                  )
                }
              : nb
          )
        );
      }
    } 
    else {
      console.log('wrote')
      setNotebooks(prevNotebooks =>
        prevNotebooks.map(nb =>
          nb.id === notebookId
            ? {
                ...nb,
                sections: nb.sections.map(s =>
                  s.id === sectionId
                    ? { ...s, isExpanded: !s.isExpanded }
                    : s
                )
              }
            : nb
        )
      );
    }
  }


 
  const value = {
    notesFolder,
    notebooks,
    loading,
    isSetupComplete,
    setupNotesFolder,
    toggleNotebook,
    toggleSection
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}