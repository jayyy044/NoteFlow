import { useApp } from "./context/AppContext";
import FolderForm from "./components/FolderForm/FolderForm";
import "./App.css";
import Layout from "./Layout/Layout";

function App() {
  const { isSetupComplete, loading, setupNotesFolder } = useApp();

  if (loading) return null;

  return (
    <>
      {isSetupComplete ? (
        <Layout/>
      ) : (
        <FolderForm onFolderSelected={setupNotesFolder} />
      )}
    </>
  );
}

export default App;