import { useState } from 'react';
import './Sidebar.css';
import { FiPlus } from "react-icons/fi";
import { useApp } from '../../context/AppContext.jsx';
import { FaCircle, FaChevronRight } from "react-icons/fa6";
import { IoBookOutline } from "react-icons/io5";
import { CiFolderOn } from "react-icons/ci";
import { FiFileText } from "react-icons/fi";
import { IoMdSettings } from "react-icons/io";
import Loader from '../Loader/Loader.jsx'

const SideBar = ({setContextMenu, contextMenu}) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const { notebooks, loading, toggleNotebook, toggleSection } = useApp();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleContextMenu = (e, type, data = null) => {
    e.preventDefault();
    e.stopPropagation();

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: type,
      data: data
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  if (loading) {
    return (
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button className="logo-btn" onClick={toggleSidebar}>
            <IoBookOutline />
          </button>
          <p className='logo-text'>Note Flow</p>
        </div>
        <div className="loading-notebooks"><Loader h={'30'} w={'30'}/></div>
      </div>
    );
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button className="logo-btn" onClick={toggleSidebar}>
          <IoBookOutline />
        </button>
        <span className="logo-text">Note Flow</span>
      </div>

      <div className="add-notebooks">
        <span>NOTEBOOKS</span>
        <button className="add-notebook-btn">
          <FiPlus />
        </button>
      </div>

      <div 
        className="notebooks-container"
        onContextMenu={(e) => handleContextMenu(e, 'sidebar-empty')}
      >
        {notebooks.map((notebook) => (
          <div key={notebook.id} className='notebook-cont'>
            <div 
              className="notebook-item" 
              onClick={(e) => {
                e.stopPropagation();
                toggleNotebook(notebook.id);
              }}
              onContextMenu={(e) => handleContextMenu(e, 'notebook', notebook)}
            >
              <span className={`notebook-chevron ${notebook.isExpanded ? 'expanded' : ''}`}>
                <FaChevronRight />
              </span>
              <FaCircle style={{ color: notebook.color}} />
              <p className="notebook-title">
                {notebook.name}
              </p>
            </div>

            {notebook.isExpanded && (
              <div className="section-cont">
                {notebook.sections.length === 0 ? (
                  <div style={{ padding: '10px 20px', color: '#888', fontSize: '12px' }}>
                    No sections yet
                  </div>
                ) : (
                  notebook.sections.map((section) => (
                    <div key={section.id}>
                      <div 
                        className="section-item" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSection(notebook.id, section.id);
                        }}
                        onContextMenu={(e) => handleContextMenu(e, 'section', { 
                          notebookId: notebook.id, 
                          section 
                        })}
                      >
                        <span className={`section-chevron ${section.isExpanded ? 'expanded' : ''}`}>
                          <FaChevronRight />
                        </span>
                        <CiFolderOn style={{color: section.color}}/>
                        <p className="section-title">
                          {section.name}
                        </p>
                      </div>

                      {section.isExpanded && (
                        <div className="page-cont">
                          {section.pages.length === 0 ? (
                            <div style={{ padding: '10px 20px', color: '#888', fontSize: '12px' }}>
                              No pages yet
                            </div>
                          ) : (
                            section.pages.map((page) => (
                              <div 
                                key={page.id} 
                                className="page-item"
                                // onClick={(e) => {
                                //   e.stopPropagation();
                                //   // setCurrentPageId(page.id)
                                // }}
                                onContextMenu={(e) => handleContextMenu(e, 'page', { 
                                  notebookId: notebook.id, 
                                  sectionId: section.id, 
                                  page 
                                })}
                              >
                                <FiFileText/>
                                <p className="page-title">{page.title}</p>
                              </div>
                            ))
                          )}
                          <div className="add-page-btn" 
                            onClick={(e) => e.stopPropagation()}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                          >
                            <FiPlus />
                            <span>Add Page</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div className="add-section-btn" 
                    onClick={(e) => e.stopPropagation()}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                  <FiPlus/>
                  <p>Add Section</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="context-menu"
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000
          }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          {contextMenu.type === 'sidebar-empty' && (
            <div className="context-menu-item" onClick={() => {
              console.log('Add Notebook');
              closeContextMenu();
            }}>
              Add Notebook
            </div>
          )}

          {contextMenu.type === 'notebook' && (
            <>
              <div className="context-menu-item" onClick={() => {
                console.log('Add Section to:', contextMenu.data.name);
                closeContextMenu();
              }}>
                Add Section
              </div>
              <div className="context-menu-item" onClick={() => {
                console.log('Rename Notebook:', contextMenu.data.name);
                closeContextMenu();
              }}>
                Rename Notebook
              </div>
              <div className="context-menu-item danger" onClick={() => {
                console.log('Delete Notebook:', contextMenu.data.name);
                closeContextMenu();
              }}>
                Delete Notebook
              </div>
            </>
          )}

          {contextMenu.type === 'section' && (
            <>
              <div className="context-menu-item" onClick={() => {
                console.log('Add Page to:', contextMenu.data.section.name);
                closeContextMenu();
              }}>
                Add Page
              </div>
              <div className="context-menu-item" onClick={() => {
                console.log('Rename Section:', contextMenu.data.section.name);
                closeContextMenu();
              }}>
                Rename Section
              </div>
              <div className="context-menu-item danger" onClick={() => {
                console.log('Delete Section:', contextMenu.data.section.name);
                closeContextMenu();
              }}>
                Delete Section
              </div>
            </>
          )}

          {contextMenu.type === 'page' && (
            <>
              <div className="context-menu-item" onClick={() => {
                console.log('Rename Page:', contextMenu.data.page.title);
                closeContextMenu();
              }}>
                Rename Page
              </div>
              <div className="context-menu-item danger" onClick={() => {
                console.log('Delete Page:', contextMenu.data.page.title);
                closeContextMenu();
              }}>
                Delete Page
              </div>
            </>
          )}
        </div>
      )}

      <div className="settings-container">
        <button className='settings-icon'>
          <IoMdSettings size={23}/>
        </button>
        {isOpen && <span className="settings-text">Settings</span>}
      </div>
    </div>
  );
}

export default SideBar;