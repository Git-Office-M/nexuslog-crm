// src/components/Layout.js
import { useAuth } from '../lib/AuthContext';

export default function Layout({ page, setPage, children, counts = {} }) {
  const { profile, signOut } = useAuth();

  const nav = [
    { key: 'dashboard',    icon: '⊞', label: 'Dashboard' },
    { key: 'proposals',    icon: '◧', label: 'Propostas',  badge: counts.negotiating || null },
    { key: 'new-proposal', icon: '＋', label: 'Nova Proposta' },
    { key: 'visits',       icon: '📅', label: 'Visitas',    badge: counts.upcomingVisits || null },
    { key: 'catalog',      icon: '📦', label: 'Catálogo HELI' },
    { key: 'settings',     icon: '⚙', label: 'Configurações' },
  ];

  const S = {
    app: { display:'flex', minHeight:'100vh', fontFamily:"'Inter', sans-serif" },
    sidebar: { width:240, background:'#111827', display:'flex', flexDirection:'column',
      position:'fixed', top:0, left:0, bottom:0, zIndex:50 },
    sidebarHeader: { padding:'24px 20px 20px', borderBottom:'1px solid rgba(255,255,255,.06)' },
    logoBadge: { width:36, height:36, borderRadius:8, background:'#C10A25',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:'#fff' },
    logoName: { fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:'#fff', lineHeight:1.1 },
    logoSub: { fontSize:10, color:'#C10A25', fontWeight:600, letterSpacing:'1.5px', textTransform:'uppercase', marginTop:2 },
    nav: { flex:1, padding:'12px 10px', overflowY:'auto' },
    navLabel: { fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'1.5px',
      color:'rgba(255,255,255,.2)', padding:'14px 10px 6px' },
    navItem: (active) => ({
      display:'flex', alignItems:'center', gap:10, padding:'9px 10px',
      borderRadius:8, cursor:'pointer', fontSize:13.5, fontWeight:500,
      color: active ? '#fff' : 'rgba(255,255,255,.45)',
      background: active ? 'rgba(193,10,37,.2)' : 'transparent',
      border:'none', width:'100%', textAlign:'left',
      fontFamily:"'Inter',sans-serif", marginBottom:1, whiteSpace:'nowrap',
      transition:'all .15s',
    }),
    navIcon: (active) => ({ fontSize:16, width:20, textAlign:'center', flexShrink:0,
      color: active ? '#C10A25' : 'inherit' }),
    navBadge: { marginLeft:'auto', background:'#C10A25', color:'#fff',
      fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:20 },
    footer: { padding:'16px 20px', borderTop:'1px solid rgba(255,255,255,.06)' },
    userRow: { display:'flex', alignItems:'center', gap:10 },
    avatar: { width:32, height:32, borderRadius:'50%', background:'rgba(193,10,37,.25)',
      border:'1px solid rgba(193,10,37,.4)', display:'flex', alignItems:'center',
      justifyContent:'center', fontSize:11, fontWeight:700, color:'#C10A25', flexShrink:0 },
    userName: { fontSize:12, fontWeight:600, color:'rgba(255,255,255,.75)' },
    userRole: { fontSize:10, color:'rgba(255,255,255,.3)', marginTop:1 },
    signOut: { marginTop:10, width:'100%', background:'transparent', border:'none',
      color:'rgba(255,255,255,.25)', fontSize:12, cursor:'pointer', textAlign:'left',
      fontFamily:"'Inter',sans-serif", padding:'4px 0', transition:'color .15s' },
    main: { marginLeft:240, flex:1, display:'flex', flexDirection:'column', minHeight:'100vh', background:'#f9fafb' },
    topbar: { height:56, background:'#fff', borderBottom:'1px solid #e5e7eb',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 28px', position:'sticky', top:0, zIndex:40 },
    topbarTitle: { fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:'#111827' },
    content: { flex:1, padding:28, maxWidth:1200, width:'100%' },
  };

  const pageLabels = {
    dashboard: 'Dashboard', proposals: 'Propostas', 'new-proposal': 'Nova Proposta',
    visits: 'Visitas', catalog: 'Catálogo HELI', detail: 'Detalhe da Proposta',
    settings: 'Configurações',
  };

  return (
    <div style={S.app}>
      {/* Sidebar */}
      <aside style={S.sidebar}>
        <div style={S.sidebarHeader}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={S.logoBadge}>NX</div>
            <div>
              <div style={S.logoName}>Nexus Log</div>
              <div style={S.logoSub}>HELI · ES</div>
            </div>
          </div>
        </div>

        <nav style={S.nav}>
          <div style={S.navLabel}>Menu</div>
          {nav.map(n => {
            const active = page === n.key || (page === 'detail' && n.key === 'proposals');
            return (
              <button key={n.key} style={S.navItem(active)}
                onClick={() => setPage(n.key)}>
                <span style={S.navIcon(active)}>{n.icon}</span>
                {n.label}
                {n.badge ? <span style={S.navBadge}>{n.badge}</span> : null}
              </button>
            );
          })}
        </nav>

        <div style={S.footer}>
          <div style={S.userRow}>
            <div style={S.avatar}>{profile?.avatar || '??'}</div>
            <div>
              <div style={S.userName}>{profile?.name || 'Usuário'}</div>
              <div style={S.userRole}>{profile?.role || 'Consultor'}</div>
            </div>
          </div>
          <button style={S.signOut} onClick={signOut}>↩ Sair</button>
        </div>
      </aside>

      {/* Main */}
      <div style={S.main}>
        <div style={S.topbar}>
          <span style={S.topbarTitle}>{pageLabels[page] || page}</span>
          <div style={{ display:'flex', gap:8 }}>
            <button style={{ padding:'7px 14px', borderRadius:8, border:'1px solid #d1d5db',
              background:'transparent', fontSize:13, fontWeight:600, cursor:'pointer',
              color:'#4b5563', fontFamily:"'Inter',sans-serif" }}
              onClick={() => setPage('visits')}>
              + Visita
            </button>
            <button style={{ padding:'7px 14px', borderRadius:8, border:'none',
              background:'#C10A25', color:'#fff', fontSize:13, fontWeight:600,
              cursor:'pointer', fontFamily:"'Inter',sans-serif" }}
              onClick={() => setPage('new-proposal')}>
              + Proposta
            </button>
          </div>
        </div>
        <div style={S.content}>{children}</div>
      </div>
    </div>
  );
}
