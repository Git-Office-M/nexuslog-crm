// src/components/Layout.js
import { useState } from 'react';
import { useAuth } from '../lib/AuthContext';

export default function Layout({ page, setPage, children, counts = {} }) {
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = [
    { key: 'dashboard',    icon: '⊞', label: 'Dashboard' },
    { key: 'proposals',    icon: '◧', label: 'Propostas',     badge: counts.negotiating || null },
    { key: 'new-proposal', icon: '＋', label: 'Nova Proposta' },
    { key: 'visits',       icon: '📅', label: 'Visitas',       badge: counts.upcomingVisits || null },
    { key: 'catalog',      icon: '📦', label: 'Catálogo HELI' },
    { key: 'settings',     icon: '⚙',  label: 'Configurações' },
  ];

  const pageLabels = {
    dashboard: 'Dashboard', proposals: 'Propostas', 'new-proposal': 'Nova Proposta',
    visits: 'Visitas', catalog: 'Catálogo HELI', detail: 'Detalhe', settings: 'Configurações',
  };

  const handleNav = (key) => {
    setPage(key);
    setSidebarOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; }

        .layout-app { display: flex; min-height: 100vh; }

        /* OVERLAY para fechar sidebar no mobile */
        .sidebar-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,.5);
          z-index: 49;
        }
        .sidebar-overlay.open { display: block; }

        /* SIDEBAR */
        .sidebar {
          width: 240px;
          background: #111827;
          display: flex; flex-direction: column;
          position: fixed; top: 0; left: 0; bottom: 0;
          z-index: 50;
          transform: translateX(-100%);
          transition: transform .25s ease;
        }
        .sidebar.open { transform: translateX(0); }

        .sidebar-header {
          padding: 20px 20px 16px;
          border-bottom: 1px solid rgba(255,255,255,.06);
          display: flex; align-items: center; justify-content: space-between;
        }
        .logo-row { display: flex; align-items: center; gap: 10px; }
        .logo-badge {
          width: 36px; height: 36px; border-radius: 8px;
          background: #C10A25;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800; color: #fff;
          flex-shrink: 0;
        }
        .logo-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #fff; line-height: 1.1; }
        .logo-sub  { font-size: 10px; color: #C10A25; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 1px; }
        .sidebar-close {
          background: none; border: none; color: rgba(255,255,255,.4);
          font-size: 22px; cursor: pointer; padding: 4px;
        }

        .nav { flex: 1; padding: 12px 10px; overflow-y: auto; }
        .nav-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,.2); padding: 14px 10px 6px; }
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 10px; border-radius: 8px; cursor: pointer;
          font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,.5);
          background: transparent; border: none; width: 100%; text-align: left;
          font-family: 'Inter', sans-serif; margin-bottom: 2px;
          transition: all .15s;
        }
        .nav-item:hover { color: rgba(255,255,255,.85); background: rgba(255,255,255,.06); }
        .nav-item.active { color: #fff; background: rgba(193,10,37,.2); }
        .nav-item.active .nav-icon { color: #C10A25; }
        .nav-icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }
        .nav-badge {
          margin-left: auto; background: #C10A25; color: #fff;
          font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 20px;
        }

        .sidebar-footer { padding: 14px 20px; border-top: 1px solid rgba(255,255,255,.06); }
        .user-row { display: flex; align-items: center; gap: 10px; }
        .user-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(193,10,37,.25); border: 1px solid rgba(193,10,37,.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #C10A25; flex-shrink: 0;
        }
        .user-name { font-size: 12px; font-weight: 600; color: rgba(255,255,255,.75); }
        .user-role { font-size: 10px; color: rgba(255,255,255,.3); margin-top: 1px; }
        .sign-out {
          margin-top: 8px; width: 100%; background: transparent; border: none;
          color: rgba(255,255,255,.25); font-size: 12px; cursor: pointer;
          text-align: left; font-family: 'Inter', sans-serif; padding: 4px 0;
        }
        .sign-out:hover { color: rgba(255,255,255,.5); }

        /* MAIN */
        .main { flex: 1; display: flex; flex-direction: column; min-height: 100vh; background: #f9fafb; width: 100%; }

        /* TOPBAR */
        .topbar {
          height: 54px; background: #fff; border-bottom: 1px solid #e5e7eb;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 16px; position: sticky; top: 0; z-index: 40;
        }
        .topbar-left { display: flex; align-items: center; gap: 12px; }
        .menu-btn {
          background: none; border: none; cursor: pointer;
          font-size: 22px; color: #374151; padding: 4px; display: flex; align-items: center;
        }
        .topbar-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #111827; }
        .topbar-right { display: flex; gap: 8px; }
        .topbar-btn {
          padding: 7px 12px; border-radius: 8px; font-size: 12px; font-weight: 600;
          cursor: pointer; font-family: 'Inter', sans-serif; white-space: nowrap;
        }
        .topbar-btn-outline { border: 1px solid #d1d5db; background: transparent; color: #4b5563; }
        .topbar-btn-primary { border: none; background: #C10A25; color: #fff; }

        /* CONTENT */
        .content { flex: 1; padding: 20px 16px 40px; max-width: 100%; overflow-x: hidden; }

        /* DESKTOP: sidebar always visible */
        @media (min-width: 768px) {
          .sidebar { transform: translateX(0) !important; }
          .sidebar-close { display: none; }
          .sidebar-overlay { display: none !important; }
          .main { margin-left: 240px; }
          .menu-btn { display: none; }
          .content { padding: 24px 28px 40px; }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        @keyframes toastIn  { from { opacity:0; transform:translateY(8px); } }
        @keyframes slideUp  { from { opacity:0; transform:translateY(16px); } }
        @keyframes fadeIn   { from { opacity:0; } }
      `}</style>

      <div className="layout-app">
        {/* Overlay */}
        <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div className="logo-row">
              <div className="logo-badge">NX</div>
              <div>
                <div className="logo-name">Nexus Log</div>
                <div className="logo-sub">HELI · ES</div>
              </div>
            </div>
            <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>×</button>
          </div>

          <nav className="nav">
            <div className="nav-label">Menu</div>
            {nav.map(n => {
              const active = page === n.key || (page === 'detail' && n.key === 'proposals');
              return (
                <button key={n.key} className={`nav-item ${active ? 'active' : ''}`} onClick={() => handleNav(n.key)}>
                  <span className={`nav-icon ${active ? 'active' : ''}`}>{n.icon}</span>
                  {n.label}
                  {n.badge ? <span className="nav-badge">{n.badge}</span> : null}
                </button>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <div className="user-row">
              <div className="user-avatar">{profile?.avatar || '??'}</div>
              <div>
                <div className="user-name">{profile?.name || 'Usuário'}</div>
                <div className="user-role">{profile?.role || 'Consultor'}</div>
              </div>
            </div>
            <button className="sign-out" onClick={signOut}>↩ Sair</button>
          </div>
        </aside>

        {/* Main */}
        <div className="main">
          <div className="topbar">
            <div className="topbar-left">
              <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
              <span className="topbar-title">{pageLabels[page] || page}</span>
            </div>
            <div className="topbar-right">
              <button className="topbar-btn topbar-btn-outline" onClick={() => handleNav('visits')}>+ Visita</button>
              <button className="topbar-btn topbar-btn-primary" onClick={() => handleNav('new-proposal')}>+ Proposta</button>
            </div>
          </div>

          <div className="content">{children}</div>
        </div>
      </div>
    </>
  );
}
