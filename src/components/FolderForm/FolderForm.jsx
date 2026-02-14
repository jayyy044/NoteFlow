import './FolderForm.css'
import { FolderOpenOutlined } from '@ant-design/icons';
import { FolderAddOutlined } from '@ant-design/icons';
import { open } from "@tauri-apps/plugin-dialog";


const FolderForm = ({ onFolderSelected  }) => {

    async function handleSelect() {
        const selected = await open({
        directory: true,
        multiple: false,
        title: "Choose where to save your notes",
        });
        if (selected) {
        onFolderSelected(selected);
        }
    }

    return (
    <div className="folder-form">
        <div className="folder-form-title">
            <FolderOpenOutlined />
            <p>Folder Select</p>
        </div>
        <div className="folder-body-cont">
        <div className="folder-form-body">
            <p>Welcome to <span>Note Flow!</span></p>
            <p>To get started please select the folder destination where we should save all your notes</p>
            <button onClick={handleSelect}>
            <FolderAddOutlined />
            </button>
        </div>
        </div>
        
        
    </div>
    )
}

export default FolderForm