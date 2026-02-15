import { useState } from 'react';
import './Layout.css';
import Sidebar from '../components/SideBar/SideBar';

const Layout = () => {
  const [contextMenu, setContextMenu] = useState(null);

  return (
    <div 
      className="layout"
      onContextMenu={(e) => e.preventDefault()}
      onClick={() => setContextMenu(null)} // Close context menu on any click
    >
      <Sidebar contextMenu={contextMenu} setContextMenu={setContextMenu} />
      <main className="layout-main">
        <div className="canvas-placeholder">
          <p>Canvas will go here</p>
        </div>
      </main>
    </div>
  );
};

export default Layout;