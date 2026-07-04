// src/pages/PageDashboard.js
import { Badge, Spinner } from '../components/UI';
import { usePipeline } from '../hooks/useData';

const fmtBRL = v => Number(v).toLocaleString('pt-BR', { style:'currency', currency:'BRL', minimumFractionDigits:0 });
const fmtDate = d => new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day:'2-digit', month:'short' });

export default function PageDashboard({ proposals, visits, loading, onNew, onSelect }) {
  const { total, approved, negotiating, byStatus } = usePipeline(proposals);
  const upcoming = visits.filter(v => v.status === 'Agendada');

  const S = {
    header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 },
    title: { fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:'#111827', letterSpacing:'-.3px' },
    sub: { fontSize:13, color:'#9ca3af', marginTop:4 },
    btn: { padding:'9px 16px', borderRadius:8, border:'none', background:'#C10A25', color:'#fff',
      fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'Inter',sans-serif" },
    kpiGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 },
    kpi: (accent) => ({ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12,
      padding:'20px 22px', position:'relative', overflow:'hidden',
      boxShadow:'0 1px 3px rgba(0,0,0,.05)' }),
    kpiAccent: (c) => ({ position:'absolute', top:0, left:0, right:0, height:3,
      borderRadius:'12px 12px 0 0', background:c }),
    kpiLabel: { fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'#9ca3af' },
    kpiValue: { fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:'#111827',
      margin:'6px 0 2px', letterSpacing:'-.5px' },
    kpiSub: { fontSize:12, color:'#9ca3af' },
    card: { background:'#fff', border:'1px solid #e5e7eb', borderRadius:12,
      overflow:'hidden', marginBottom:20, boxShadow:'0 1px 3px rgba(0,0,0,.05)' },
    cardHead: { display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'14px 20px', borderBottom:'1px solid #f9fafb' },
    cardTitle: { fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:700,
      textTransform:'uppercase', letterSpacing:1, color:'#9ca3af' },
    pipelineWrap: { padding:20 },
    pipelineBar: { height:10, borderRadius:5, overflow:'hidden', display:'flex',
      background:'#f3f4f6', margin:'10px 0 8px' },
    pipelineSeg: (w, c) => ({ height:'100%', width:`${w}%`, background:c }),
    legend: { display:'flex', gap:16, flexWrap:'wrap', fontSize:12, color:'#9ca3af' },
    dot: (c) => ({ display:'inline-block', width:8, height:8, borderRadius:'50%',
      background:c, marginRight:4 }),
    table: { width:'100%', borderCollapse:'collapse' },
    th: { fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'.8px',
      color:'#9ca3af', padding:'10px 18px', textAlign:'left', borderBottom:'1px solid #f9fafb' },
    td: { padding:'13px 18px', fontSize:13, color:'#4b5563', borderBottom:'1px solid #f9fafb' },
    tdMain: { fontWeight:600, color:'#111827' },
    tdModel: { fontFamily:"'Syne',sans-serif", fontSize:12, color:'#C10A25', fontWeight:700 },
    tdValue: { fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:'#111827' },
    row: { cursor:'pointer' },
  };

  const pipeline = [['Aprovada','#16a34a'],['Negociando','#C10A25'],['Aguardando','#2563eb'],['Recusada','#dc2626']];

  if (loading) return <Spinner />;

  return (
    <div>
      <div style={S.header}>
        <div>
          <div style={S.title}>Dashboard</div>
          <div style={S.sub}>Nexus Log · Rep. Oficial HELI · Espírito Santo</div>
        </div>
        <button style={S.btn} onClick={onNew}>+ Nova Proposta</button>
      </div>

      {/* KPIs */}
      <div style={S.kpiGrid}>
        {[
          { label:'Pipeline Total', value:fmtBRL(total), sub:`${proposals.length} propostas`, color:'#C10A25' },
          { label:'Aprovadas', value:approved.length, sub:fmtBRL(approved.reduce((s,p)=>s+Number(p.value_total||0),0)), color:'#16a34a' },
          { label:'Em Negociação', value:negotiating.length, sub:fmtBRL(negotiating.reduce((s,p)=>s+Number(p.value_total||0),0)), color:'#2563eb' },
          { label:'Visitas Agendadas', value:upcoming.length, sub:'Próximos 7 dias', color:'#ca8a04' },
        ].map(k => (
          <div key={k.label} style={S.kpi()}>
            <div style={S.kpiAccent(k.color)} />
            <div style={S.kpiLabel}>{k.label}</div>
            <div style={S.kpiValue}>{k.value}</div>
            <div style={S.kpiSub}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Pipeline bar */}
      <div style={S.card}>
        <div style={S.cardHead}>
          <span style={S.cardTitle}>Funil de Vendas</span>
          <span style={{fontSize:12,color:'#9ca3af'}}>Total: {fmtBRL(total)}</span>
        </div>
        <div style={S.pipelineWrap}>
          <div style={S.pipelineBar}>
            {pipeline.map(([s,c]) => (
              <div key={s} style={S.pipelineSeg(total ? (byStatus[s]||0)/total*100 : 0, c)} />
            ))}
          </div>
          <div style={S.legend}>
            {pipeline.map(([s,c]) => (
              <span key={s}><span style={S.dot(c)}/>{s}: {fmtBRL(byStatus[s]||0)}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent proposals */}
      <div style={S.card}>
        <div style={S.cardHead}>
          <span style={S.cardTitle}>Propostas Recentes</span>
        </div>
        {proposals.length === 0 ? (
          <div style={{padding:32,textAlign:'center',color:'#9ca3af',fontSize:13}}>
            Nenhuma proposta ainda. <button style={{background:'none',border:'none',color:'#C10A25',cursor:'pointer',fontWeight:600,fontSize:13}} onClick={onNew}>Criar a primeira →</button>
          </div>
        ) : (
          <table style={S.table}>
            <thead><tr>
              <th style={S.th}>Cliente</th>
              <th style={S.th}>Modelo HELI</th>
              <th style={S.th}>Valor Total</th>
              <th style={S.th}>Status</th>
            </tr></thead>
            <tbody>
              {proposals.slice(0, 5).map(p => (
                <tr key={p.id} style={S.row}
                  onMouseEnter={e => Array.from(e.currentTarget.cells).forEach(c => c.style.background='#f9fafb')}
                  onMouseLeave={e => Array.from(e.currentTarget.cells).forEach(c => c.style.background='')}
                  onClick={() => onSelect(p)}>
                  <td style={S.td}><span style={S.tdMain}>{p.client_name}</span></td>
                  <td style={S.td}><span style={S.tdModel}>{p.model}</span></td>
                  <td style={S.td}><span style={S.tdValue}>{fmtBRL(p.value_total)}</span></td>
                  <td style={S.td}><Badge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
