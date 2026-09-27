import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

const navItems = [
  { label: 'Visão Geral', icon: '⊞' },
  { label: 'Carteira', icon: '◫' },
  { label: 'Investimentos', icon: '↗' },
  { label: 'Cartões', icon: '▭' },
  { label: 'Metas', icon: '◎' },
  { label: 'Milhas', icon: '◇' },
  { label: 'Relatórios', icon: '≡' },
]

const bottomNav = [
  { label: 'Configurações', icon: '⚙' },
  { label: 'Ajuda', icon: '?' },
]

// ─── Visão Geral data ──────────────────────────────────────────────────────────

const transactions = [
  { id: 1, icon: 'K', iconBg: '#7c1d1d', desc: 'Salário mensal', cat: 'Renda', data: '08 Jul', valor: '+R$ 8.500,00', positive: true },
  { id: 2, icon: '↗', iconBg: '#d6c9bc', desc: 'Supermercado Extra', cat: 'Alimentação', data: '07 Jul', valor: '-R$ 642,30', positive: false },
  { id: 3, icon: 'K', iconBg: '#7c1d1d', desc: 'Dividendos ITUB4', cat: 'Investimentos', data: '06 Jul', valor: '+R$ 312,75', positive: true },
  { id: 4, icon: '↗', iconBg: '#d6c9bc', desc: 'Aluguel apartamento', cat: 'Moradia', data: '05 Jul', valor: '-R$ 2.200,00', positive: false },
  { id: 5, icon: '↗', iconBg: '#d6c9bc', desc: 'Conta de energia', cat: 'Contas', data: '04 Jul', valor: '-R$ 189,90', positive: false },
  { id: 6, icon: '↗', iconBg: '#d6c9bc', desc: 'Supermercado Extra', cat: 'Alimentação', data: '07 Jul', valor: '-R$ 642,30', positive: false },
  { id: 7, icon: 'K', iconBg: '#7c1d1d', desc: 'Dividendos ITUB4', cat: 'Investimentos', data: '06 Jul', valor: '+R$ 312,75', positive: true },
  { id: 8, icon: '↗', iconBg: '#d6c9bc', desc: 'Aluguel apartamento', cat: 'Moradia', data: '05 Jul', valor: '-R$ 2.200,00', positive: false },
  { id: 9, icon: '↗', iconBg: '#d6c9bc', desc: 'Conta de energia', cat: 'Contas', data: '04 Jul', valor: '-R$ 189,90', positive: false },
]

const gastosData = [
  { name: 'Moradia', value: 60, color: '#7c1d1d' },
  { name: 'Alimentação', value: 18, color: '#8B6914' },
  { name: 'Saúde', value: 13, color: '#C9A227' },
  { name: 'Contas', value: 5, color: '#4a7c6f' },
  { name: 'Lazer', value: 4, color: '#a8a29e' },
]

const investPortData = [
  { name: 'Ações', value: 44, color: '#7c1d1d' },
  { name: 'Renda Fixa', value: 29, color: '#2d5a87' },
  { name: 'Fundos Imob.', value: 16, color: '#C9A227' },
  { name: 'Cripto', value: 7, color: '#1a1a1a' },
  { name: 'Caixa', value: 4, color: '#a8a29e' },
]

// ─── Investimentos data ───────────────────────────────────────────────────────

const objetivos = [
  { initial: 'I', label: 'Investimentos', valor: 'R$ 26.370,03', color: '#7c1d1d' },
  { initial: 'D', label: 'Diversos', valor: 'R$ 3.776,96', color: '#b8a898' },
  { initial: 'C', label: 'Camila', valor: 'R$ 10.000,00', color: '#C9A227' },
  { initial: 'c', label: 'casa', valor: 'R$ 129.366,63', color: '#4a3728' },
  { initial: 'R', label: 'Reserva', valor: 'R$ 54.972,33', color: '#2d5a87' },
  { initial: 'V', label: 'Viagem', valor: 'R$ 26.032,86', color: '#1a1a1a' },
  { initial: 'P', label: 'Previdência', valor: 'R$ 2.050,66', color: '#a8a29e' },
]

const ativos = [
  { initial: 'K', tipo: 'CDB DI', valor: 'R$ 11.619,41', objetivo: 'Investimentos', corretora: 'itau', classe: 'Renda fixa' },
  { initial: 'F', tipo: 'Fundo DI', valor: 'R$ 23.871,45', objetivo: 'casa', corretora: 'itau', classe: 'Renda fixa' },
  { initial: 'K', tipo: 'Viland Infra', valor: 'R$ 36.728,99', objetivo: 'casa', corretora: 'itau', classe: 'Renda fixa' },
  { initial: 'K', tipo: 'Fundo Activi rend', valor: 'R$ 48.267,55', objetivo: 'casa', corretora: 'itau', classe: 'Internacional' },
  { initial: 'T', tipo: 'Tesouro IPCA', valor: 'R$ 516,30', objetivo: 'Investimentos', corretora: 'itau', classe: 'Renda fixa' },
  { initial: 'K', tipo: 'CDB Bs2', valor: 'R$ 1.235,68', objetivo: 'Investimentos', corretora: 'nu', classe: 'Renda fixa' },
  { initial: 'K', tipo: 'sparta', valor: 'R$ 3.610,98', objetivo: 'Investimentos', corretora: 'XP', classe: 'Renda fixa' },
]

// ─── Shared chart components ──────────────────────────────────────────────────

function SmallDonutChart({ data, label, total }: { data: { name: string; value: number; color: string }[]; label: string; total: string }) {
  return (
    <div style={{ position: 'relative', width: 160, height: 160, flexShrink: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={52} outerRadius={72} dataKey="value" strokeWidth={2} stroke="#f5f0eb">
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <span style={{ fontSize: 9, color: '#78716c', textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#1c1917', textAlign: 'center', lineHeight: 1.3 }}>{total}</span>
      </div>
    </div>
  )
}

const RADIAN = Math.PI / 180

function parseValor(s: string): number {
  return parseFloat(s.replace('R$', '').replace(/\./g, '').replace(',', '.').trim())
}

function renderOuterLabel({ cx, cy, midAngle, outerRadius, name, percent }: any) {
  const GAP = 30
  const r = outerRadius + GAP
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  const anchor = x > cx ? 'start' : 'end'
  const pct = (percent * 100).toFixed(1)
  return (
    <text fontSize={10.5} textAnchor={anchor} fill="#1c1917">
      <tspan x={x} y={y - 7} fontWeight={700}>{pct}%</tspan>
      <tspan x={x} y={y + 7} fill="#57534e">{name}</tspan>
    </text>
  )
}

function LargeDonutChart({ items }: { items: typeof objetivos }) {
  const data = items.map(obj => ({ name: obj.label, value: parseValor(obj.valor), color: obj.color }))
  const total = data.reduce((s, d) => s + d.value, 0)
  const totalFmt = 'R$ ' + total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 44, right: 72, bottom: 44, left: 72 }}>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius="30%" outerRadius="46%"
            dataKey="value"
            strokeWidth={2} stroke="#fff"
            label={renderOuterLabel}
            labelLine={{ stroke: '#c4b8ae', strokeWidth: 1 }}
          >
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <span style={{ fontSize: 11, color: '#78716c' }}>Total</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#1c1917' }}>{totalFmt}</span>
      </div>
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: '#f5f0eb', color: '#78716c', fontWeight: 500, whiteSpace: 'nowrap' }}>
    {children}
  </span>
)

const CircleIcon = ({ initial, bg = '#7c1d1d' }: { initial: string; bg?: string }) => (
  <div style={{ width: 28, height: 28, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#f5f0eb', flexShrink: 0 }}>
    {initial}
  </div>
)

// ─── Views ────────────────────────────────────────────────────────────────────

function VisaoGeralView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Transactions */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #e7e2dc' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1c1917' }}>Transações recentes</div>
            <div style={{ fontSize: 12, color: '#78716c', marginTop: 2 }}>Movimentações dos últimos dias</div>
          </div>
          <button style={{ padding: '6px 14px', background: '#f5f0eb', border: '1px solid #e7e2dc', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#1c1917', cursor: 'pointer' }}>
            Ver todas
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 100px 120px', padding: '0 8px 8px', borderBottom: '1px solid #f0ebe5' }}>
          {['DESCRIÇÃO', 'CATEGORIA', 'DATA', 'VALOR'].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 600, color: '#a8a29e', letterSpacing: '0.08em' }}>{h}</div>
          ))}
        </div>
        {transactions.map((tx, i) => (
          <div key={tx.id} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 100px 120px', padding: '11px 8px', borderBottom: i < transactions.length - 1 ? '1px solid #f5f0eb' : 'none', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CircleIcon initial={tx.icon} bg={tx.iconBg} />
              <span style={{ fontSize: 13, fontWeight: 500, color: '#1c1917' }}>{tx.desc}</span>
            </div>
            <div><Badge>{tx.cat}</Badge></div>
            <div style={{ fontSize: 13, color: '#78716c' }}>{tx.data}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: tx.positive ? '#1c1917' : '#57534e', textAlign: 'right' }}>{tx.valor}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #e7e2dc' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1c1917' }}>Gastos por categoria</div>
          <div style={{ fontSize: 12, color: '#78716c', marginTop: 2, marginBottom: 16 }}>Distribuição das despesas do mês</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <SmallDonutChart data={gastosData} label="Total gasto" total="R$ 3.668,00" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
              {gastosData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#57534e' }}>{d.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1c1917' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #e7e2dc' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1c1917' }}>Carteira de investimentos</div>
          <div style={{ fontSize: 12, color: '#78716c', marginTop: 2, marginBottom: 16 }}>Alocação por classe de ativo</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <SmallDonutChart data={investPortData} label="Patrimônio" total="R$ 96.500,00" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
              {investPortData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#57534e' }}>{d.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1c1917' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InvestimentosView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Banner */}
      <div style={{ background: '#5a1a1a', borderRadius: 14, padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#f5f0eb' }}>Investimentos totais:</span>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#C9A227' }}>R$ 252.569,67</span>
      </div>

      {/* Objetivos card */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e7e2dc', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {/* Table */}
        <div style={{ borderRight: '1px solid #e7e2dc' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '12px 20px', borderBottom: '1px solid #f0ebe5' }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: '#1c1917' }}>Objetivo</span>
            <span style={{ fontWeight: 700, fontSize: 13, color: '#1c1917' }}>Valor</span>
          </div>
          {objetivos.map((obj, i) => (
            <div key={obj.label} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '11px 20px', borderBottom: i < objetivos.length - 1 ? '1px solid #f5f0eb' : 'none', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CircleIcon initial={obj.initial} />
                <span style={{ fontSize: 13, color: '#1c1917' }}>{obj.label}</span>
              </div>
              <span style={{ fontSize: 13, color: '#57534e', fontVariantNumeric: 'tabular-nums' }}>{obj.valor}</span>
            </div>
          ))}
        </div>

        {/* Chart — fills full panel height, labels rendered outside with lines */}
        <div style={{ minHeight: 360, overflow: 'hidden' }}>
          <LargeDonutChart items={objetivos} />
        </div>
      </div>

      {/* Ativos table */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e7e2dc', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px 150px 110px 140px', padding: '11px 20px', borderBottom: '1px solid #f0ebe5', background: '#faf8f6' }}>
          {['Tipo', 'Valor', 'Objetivo', 'Corretora', 'Classe'].map(h => (
            <span key={h} style={{ fontSize: 13, fontWeight: 700, color: '#1c1917' }}>{h}</span>
          ))}
        </div>
        {ativos.map((a, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 150px 150px 110px 140px', padding: '11px 20px', borderBottom: i < ativos.length - 1 ? '1px solid #f5f0eb' : 'none', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CircleIcon initial={a.initial} />
              <span style={{ fontSize: 13, color: '#1c1917' }}>{a.tipo}</span>
            </div>
            <span style={{ fontSize: 13, color: '#57534e', fontVariantNumeric: 'tabular-nums' }}>{a.valor}</span>
            <div><Badge>{a.objetivo}</Badge></div>
            <span style={{ fontSize: 13, color: '#78716c' }}>{a.corretora}</span>
            <div><Badge>{a.classe}</Badge></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlaceholderView({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: '#78716c', fontSize: 14 }}>
      {label} — em breve
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeNav, setActiveNav] = useState('Visão Geral')

  function renderView() {
    if (activeNav === 'Visão Geral') return <VisaoGeralView />
    if (activeNav === 'Investimentos') return <InvestimentosView />
    return <PlaceholderView label={activeNav} />
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14 }}>

      {/* Sidebar */}
      <aside style={{ width: 200, flexShrink: 0, background: '#1c1917', display: 'flex', flexDirection: 'column', color: '#d6cfc8' }}>
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #292524' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, background: '#7c1d1d', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>♦</div>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#f5f0eb' }}>LAB.Finance</span>
          </div>
        </div>

        <div style={{ padding: '12px 16px', borderBottom: '1px solid #292524' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#292524', borderRadius: 8, padding: '8px 10px', cursor: 'pointer' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#7c1d1d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#f5f0eb', flexShrink: 0 }}>MC</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 12, color: '#f5f0eb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Lucas e Camila</div>
              <div style={{ fontSize: 10, color: '#78716c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Lucas@email...</div>
            </div>
            <span style={{ fontSize: 10, color: '#78716c', marginLeft: 'auto' }}>▾</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => {
            const active = activeNav === item.label
            return (
              <button key={item.label} onClick={() => setActiveNav(item.label)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: active ? '#7c1d1d' : 'transparent',
                color: active ? '#f5f0eb' : '#a8a29e',
                fontSize: 13, fontWeight: active ? 600 : 400,
                textAlign: 'left', width: '100%', transition: 'background 0.15s, color 0.15s'
              }}>
                <span style={{ fontSize: 14, width: 16, textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </nav>

        <div style={{ padding: '8px 8px 16px', borderTop: '1px solid #292524', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {bottomNav.map(item => (
            <button key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: '#78716c', fontSize: 13, textAlign: 'left', width: '100%' }}>
              <span style={{ fontSize: 14, width: 16, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, background: '#f5f0eb', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <header style={{ padding: '20px 28px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: '#78716c', textTransform: 'uppercase', marginBottom: 3 }}>Painel Financeiro</div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1c1917', margin: 0, lineHeight: 1.2 }}>Suas Finanças</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e7e2dc', borderRadius: 8, padding: '7px 14px', fontSize: 13, color: '#a8a29e' }}>
              <span style={{ fontSize: 12 }}>🔍</span>
              Buscar transações...
            </div>
            <div style={{ width: 34, height: 34, background: '#fff', border: '1px solid #e7e2dc', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, cursor: 'pointer' }}>🔔</div>
          </div>
        </header>

        {/* Single "Home" tab */}
        <div style={{ padding: '10px 28px 0', borderBottom: '1px solid #e7e2dc' }}>
          <div style={{ display: 'inline-block', padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#1c1917', borderBottom: '2px solid #1c1917', marginBottom: -1 }}>
            Home
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '16px 28px 24px', overflowY: 'auto' }}>
          {renderView()}
        </div>
      </main>
    </div>
  )
}
