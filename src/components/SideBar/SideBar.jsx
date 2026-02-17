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

// const SideBar = ({setContextMenu, contextMenu}) => {
//   const [isOpen, setIsOpen] = useState(true);
//   const [rename, setRename] = useState({
//     notebook: null,
//     section: null,
//     page: null
//   });
  
//   const { 
//     notebooks, 
//     loading, 
//     toggleNotebook, 
//     toggleSection, 
//     renameNotebook,
//     renameSection,
//     renamePage,
//     addNotebook
//    } = useApp();

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleContextMenu = (e, type, data = null) => {
//     e.preventDefault();
//     e.stopPropagation();

//     setContextMenu({
//       x: e.clientX,
//       y: e.clientY,
//       type: type,
//       data: data
//     });
//   };


//   const handleRename = (notebookId, sectionId, pageId, newName) => {
//     if (notebookId && !sectionId && !pageId) {
//       renameNotebook(notebookId, newName);
//     } else if (notebookId && sectionId && !pageId) {
//       renameSection(notebookId, sectionId, newName);
//     } else if (notebookId && sectionId && pageId) {
//       renamePage(notebookId, sectionId, pageId, newName);
//     }
//     setRename({ notebook: null, section: null, page: null });
//   };

//   if (loading) {
//     return (
//       <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
//         <div className="sidebar-header">
//           <button className="logo-btn" onClick={toggleSidebar}>
//             <IoBookOutline />
//           </button>
//           <p className='logo-text'>Note Flow</p>
//         </div>
//         <div className="loading-notebooks"><Loader h={'30'} w={'30'}/></div>
//       </div>
//     );
//   }

//   return (
//     <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
//       <div className="sidebar-header">
//         <button className="logo-btn" onClick={toggleSidebar}>
//           <IoBookOutline />
//         </button>
//         <span className="logo-text">Note Flow</span>
//       </div>

//       <div className="add-notebooks">
//         <span>NOTEBOOKS</span>
//         <button className="add-notebook-btn" onClick={() => addNotebook()}>
//           <FiPlus />
//         </button>
//       </div>

//       <div 
//         className="notebooks-container"
//         onContextMenu={(e) => handleContextMenu(e, 'sidebar-empty')}
//       >
//         {notebooks.map((notebook) => (
//           <div key={notebook.id} className='notebook-cont'>
//             <div 
//               className="notebook-item" 
//               onClick={(e) => {
//                 e.stopPropagation();
//                 toggleNotebook(notebook.id);
//               }}
//               onContextMenu={(e) => handleContextMenu(e, 'notebook', notebook)}
//             >
//               <span className={`notebook-chevron ${notebook.isExpanded ? 'expanded' : ''}`}>
//                 <FaChevronRight />
//               </span>
//               <FaCircle style={{ color: notebook.color}} />
//               {rename.notebook === notebook.id ? (
//                 <input
//                   autoFocus
//                   className="rename-input"
//                   defaultValue={notebook.name}
//                   onBlur={(e) => {
//                     if (e.target.value.trim()) {
//                       handleRename(notebook.id, null, null, e.target.value);
//                     } else {
//                       setRename({ notebook: null, section: null, page: null });
//                     }
//                   }}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter' && e.target.value.trim()) {
//                       handleRename(notebook.id, null, null, e.target.value);
//                     }
//                     if (e.key === 'Escape') {
//                       setRename({ notebook: null, section: null, page: null });
//                     }
//                   }}
//                   onClick={(e) => e.stopPropagation()}
//                 />
//               ) : (
//                 <p className="notebook-title">{notebook.name}</p>
//               )}
//             </div>

//             {notebook.isExpanded && (
//               <div className="section-cont">
//                   {notebook.sections.map((section) => (
//                     <div key={section.id}>
//                       <div 
//                         className="section-item" 
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleSection(notebook.id, section.id);
//                         }}
//                         onContextMenu={(e) => handleContextMenu(e, 'section', { 
//                           notebookId: notebook.id, 
//                           section 
//                         })}
//                       >
//                         <span className={`section-chevron ${section.isExpanded ? 'expanded' : ''}`}>
//                           <FaChevronRight />
//                         </span>
//                         <CiFolderOn style={{color: section.color}}/>
//                         {/* <p className="section-title">
//                           {section.name}
//                         </p> */}

//                         {rename.section === section.id ? (
//                           <input
//                             autoFocus
//                             className="rename-input"
//                             defaultValue={section.name}
//                             onBlur={(e) => {
//                               if (e.target.value.trim()) {
//                                 handleRename(notebook.id, section.id, null, e.target.value);
//                               } else {
//                                 setRename({ notebook: null, section: null, page: null });
//                               }
//                             }}
//                             onKeyDown={(e) => {
//                               if (e.key === 'Enter' && e.target.value.trim()) {
//                                 handleRename(notebook.id, section.id, null, e.target.value);
//                               }
//                               if (e.key === 'Escape') {
//                                 setRename({ notebook: null, section: null, page: null });
//                               }
//                             }}
//                             onClick={(e) => e.stopPropagation()}
//                           />
//                         ) : (
//                           <p>{section.name}</p>
//                         )}
//                       </div>

//                       {section.isExpanded && (
//                         <div className="page-cont">
//                           {section.pages.map((page) => (
//                               <div 
//                                 key={page.id} 
//                                 className="page-item"
//                                 // onClick={(e) => {
//                                 //   e.stopPropagation();
//                                 //   // setCurrentPageId(page.id)
//                                 // }}
//                                 onContextMenu={(e) => handleContextMenu(e, 'page', { 
//                                   notebookId: notebook.id, 
//                                   sectionId: section.id, 
//                                   page 
//                                 })}
//                               >
//                                 <FiFileText/>
//                                 {/* <p className="page-title">{page.title}</p> */}
//                                 {rename.page === page.id ? (
//                                   <input
//                                     autoFocus
//                                     className="rename-input"
//                                     defaultValue={page.title}
//                                     onBlur={(e) => {
//                                       if (e.target.value.trim()) {
//                                         handleRename(notebook.id, section.id, page.id, e.target.value);
//                                       } else {
//                                         setRename({ notebook: null, section: null, page: null });
//                                       }
//                                     }}
//                                     onKeyDown={(e) => {
//                                       if (e.key === 'Enter' && e.target.value.trim()) {
//                                         handleRename(notebook.id, section.id, page.id, e.target.value);
//                                       }
//                                       if (e.key === 'Escape') {
//                                         setRename({ notebook: null, section: null, page: null });
//                                       }
//                                     }}
//                                     onClick={(e) => e.stopPropagation()}
//                                   />
//                                 ) : (
//                                   <p className="page-title">{page.title}</p>
//                                 )}
//                               </div>
//                             ))
//                           }
//                           <div className="add-page-btn" 
//                             onClick={(e) => e.stopPropagation()}
//                             onContextMenu={(e) => {
//                                 e.preventDefault();
//                                 e.stopPropagation();
//                             }}
//                           >
//                             <FiPlus />
//                             <span>Add Page</span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 <div className="add-section-btn" 
//                     onClick={(e) => e.stopPropagation()}
//                     onContextMenu={(e) => {
//                         e.preventDefault();
//                         e.stopPropagation();
//                     }}
//                 >
//                   <FiPlus/>
//                   <p>Add Section</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Context Menu */}
//       {contextMenu && (
//         <div
//           className="context-menu"
//           style={{
//             position: 'fixed',
//             top: contextMenu.y,
//             left: contextMenu.x,
//             zIndex: 1000
//           }}
//           onClick={(e) => e.stopPropagation()}
//           onContextMenu={(e) => e.preventDefault()}
//         >
//           {contextMenu.type === 'sidebar-empty' && (
//             <div className="context-menu-item" onClick={() => {
//               addNotebook()
//               setContextMenu(null);
//             }}>
//               Add Notebook
//             </div>
//           )}

//           {contextMenu.type === 'notebook' && (
//             <>
//               <div className="context-menu-item" onClick={() => {
//                 console.log('Add Section to:', contextMenu.data.name);
//                 setContextMenu(null);
//               }}>
//                 Add Section
//               </div>
//               <div className="context-menu-item" onClick={() => {
//                 setRename({ notebook: contextMenu.data.id, section: null, page: null });
//                 setContextMenu(null);
//               }}>
//                 Rename Notebook
//               </div>
//               <div className="context-menu-item danger" onClick={() => {
//                 console.log('Delete Notebook:', contextMenu.data.name);
//                 setContextMenu(null);
//               }}>
//                 Delete Notebook
//               </div>
//             </>
//           )}

//           {contextMenu.type === 'section' && (
//             <>
//               <div className="context-menu-item" onClick={() => {
//                 console.log('Add Page to:', contextMenu.data.section.name);
//                 setContextMenu(null);
//               }}>
//                 Add Page
//               </div>
//               <div className="context-menu-item" onClick={() => {
//                 setRename({ notebook: null, section: contextMenu.data.section.id, page: null });
//                 setContextMenu(null);
//               }}>
//                 Rename Section
//               </div>
//               <div className="context-menu-item danger" onClick={() => {
//                 console.log('Delete Section:', contextMenu.data.section.name);
//                 setContextMenu(null);
//               }}>
//                 Delete Section
//               </div>
//             </>
//           )}

//           {contextMenu.type === 'page' && (
//             <>
//               <div className="context-menu-item" onClick={() => {
//                 setRename({ notebook: null, section: null, page: contextMenu.data.page.id });
//                 setContextMenu(null);
//               }}>
//                 Rename Page
//               </div>
//               <div className="context-menu-item danger" onClick={() => {
//                 console.log('Delete Page:', contextMenu.data.page.title);
//                 setContextMenu(null);
//               }}>
//                 Delete Page
//               </div>
//             </>
//           )}
//         </div>
//       )}

//       <div className="settings-container">
//         <button className='settings-icon'>
//           <IoMdSettings size={23}/>
//         </button>
//         {isOpen && <span className="settings-text">Settings</span>}
//       </div>
//     </div>
//   );
// }

// export default SideBar;


const SideBar = ({setContextMenu, contextMenu}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [rename, setRename] = useState({
    notebook: null,
    section: null,
    page: null
  });
  
  const { 
    notebooks, 
    loading, 
    toggleNotebook, 
    toggleSection, 
    renameNotebook,
    renameSection,
    renamePage,
    addNotebook
   } = useApp();

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

  const handleRename = (notebookId, sectionId, pageId, newName) => {
    if (notebookId && !sectionId && !pageId) {
      renameNotebook(notebookId, newName);
    } else if (notebookId && sectionId && !pageId) {
      renameSection(notebookId, sectionId, newName);
    } else if (notebookId && sectionId && pageId) {
      renamePage(notebookId, sectionId, pageId, newName);
    }
    setRename({ notebook: null, section: null, page: null });
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
        <button className="add-notebook-btn" onClick={(e) => {
          e.stopPropagation(); // Prevent closing context menu
          addNotebook();
        }}>
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
                setContextMenu(null); // Close context menu when clicking notebook
                toggleNotebook(notebook.id);
              }}
              onContextMenu={(e) => handleContextMenu(e, 'notebook', notebook)}
            >
              <span className={`notebook-chevron ${notebook.isExpanded ? 'expanded' : ''}`}>
                <FaChevronRight />
              </span>
              <FaCircle style={{ color: notebook.color}} />
              {rename.notebook === notebook.id ? (
                <input
                  autoFocus
                  className="rename-input"
                  defaultValue={notebook.name}
                  onBlur={(e) => {
                    if (e.target.value.trim()) {
                      handleRename(notebook.id, null, null, e.target.value);
                    } else {
                      setRename({ notebook: null, section: null, page: null });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      handleRename(notebook.id, null, null, e.target.value);
                    }
                    if (e.key === 'Escape') {
                      setRename({ notebook: null, section: null, page: null });
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <p className="notebook-title">{notebook.name}</p>
              )}
            </div>

            {notebook.isExpanded && (
              <div className="section-cont">
                  {notebook.sections.map((section) => (
                    <div key={section.id}>
                      <div 
                        className="section-item" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setContextMenu(null); // Close context menu when clicking section
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

                        {rename.section === section.id ? (
                          <input
                            autoFocus
                            className="rename-input"
                            defaultValue={section.name}
                            onBlur={(e) => {
                              if (e.target.value.trim()) {
                                handleRename(notebook.id, section.id, null, e.target.value);
                              } else {
                                setRename({ notebook: null, section: null, page: null });
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.target.value.trim()) {
                                handleRename(notebook.id, section.id, null, e.target.value);
                              }
                              if (e.key === 'Escape') {
                                setRename({ notebook: null, section: null, page: null });
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <p>{section.name}</p>
                        )}
                      </div>

                      {section.isExpanded && (
                        <div className="page-cont">
                          {section.pages.map((page) => (
                              <div 
                                key={page.id} 
                                className="page-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setContextMenu(null); // Close context menu when clicking page
                                }}
                                onContextMenu={(e) => handleContextMenu(e, 'page', { 
                                  notebookId: notebook.id, 
                                  sectionId: section.id, 
                                  page 
                                })}
                              >
                                <FiFileText/>
                                {rename.page === page.id ? (
                                  <input
                                    autoFocus
                                    className="rename-input"
                                    defaultValue={page.title}
                                    onBlur={(e) => {
                                      if (e.target.value.trim()) {
                                        handleRename(notebook.id, section.id, page.id, e.target.value);
                                      } else {
                                        setRename({ notebook: null, section: null, page: null });
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && e.target.value.trim()) {
                                        handleRename(notebook.id, section.id, page.id, e.target.value);
                                      }
                                      if (e.key === 'Escape') {
                                        setRename({ notebook: null, section: null, page: null });
                                      }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                ) : (
                                  <p className="page-title">{page.title}</p>
                                )}
                              </div>
                            ))
                          }
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
                  ))}
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
              addNotebook()
              setContextMenu(null);
            }}>
              Add Notebook
            </div>
          )}

          {contextMenu.type === 'notebook' && (
            <>
              <div className="context-menu-item" onClick={() => {
                console.log('Add Section to:', contextMenu.data.name);
                setContextMenu(null);
              }}>
                Add Section
              </div>
              <div className="context-menu-item" onClick={() => {
                setRename({ notebook: contextMenu.data.id, section: null, page: null });
                setContextMenu(null);
              }}>
                Rename Notebook
              </div>
              <div className="context-menu-item danger" onClick={() => {
                console.log('Delete Notebook:', contextMenu.data.name);
                setContextMenu(null);
              }}>
                Delete Notebook
              </div>
            </>
          )}

          {contextMenu.type === 'section' && (
            <>
              <div className="context-menu-item" onClick={() => {
                console.log('Add Page to:', contextMenu.data.section.name);
                setContextMenu(null);
              }}>
                Add Page
              </div>
              <div className="context-menu-item" onClick={() => {
                setRename({ notebook: null, section: contextMenu.data.section.id, page: null });
                setContextMenu(null);
              }}>
                Rename Section
              </div>
              <div className="context-menu-item danger" onClick={() => {
                console.log('Delete Section:', contextMenu.data.section.name);
                setContextMenu(null);
              }}>
                Delete Section
              </div>
            </>
          )}

          {contextMenu.type === 'page' && (
            <>
              <div className="context-menu-item" onClick={() => {
                setRename({ notebook: null, section: null, page: contextMenu.data.page.id });
                setContextMenu(null);
              }}>
                Rename Page
              </div>
              <div className="context-menu-item danger" onClick={() => {
                console.log('Delete Page:', contextMenu.data.page.title);
                setContextMenu(null);
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