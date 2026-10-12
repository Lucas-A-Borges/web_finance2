import { useMemo, useRef, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { projectId, publicAnonKey } from '../utils/supabase/info'
import { supabase } from './supabaseClient'; // Ajuste o caminho dependendo de onde salvou o supabaseClient.ts

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

const navItems = [
  { label: 'Visão Geral', icon: '⊞' },
  { label: 'Gastos', icon: '◫' },
  { label: 'Investimentos', icon: '↗' },
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

// ─── Investimentos data ───────────────────────────────────────────────────────

type Ativo = {
  id: number
  tipo: string
  valor: string
  objetivo: string
  corretora: string
  classe: string
  vencimento: string
}

type Objetivo = {
  initial: string
  label: string
  valor: string
  color: string
}

type ExpenseRow = {
  id: number
  nome?: string
  data?: string
  lancamento?: string
  categoria: string
  valor: string
}

type ValueRow = {
  id: number
  nome: string
  valor: string
}

type DreamRow = {
  id: number
  nome: string
}

const initialAtivos: Ativo[] = [
  { id: 1, tipo: 'CDB DI', valor: 'R$ 11.619,41', objetivo: 'Investimentos', corretora: 'itau', classe: 'Renda fixa', vencimento: '' },
  { id: 2, tipo: 'Fundo DI', valor: 'R$ 23.871,45', objetivo: 'casa', corretora: 'itau', classe: 'Renda fixa', vencimento: '' },
  { id: 3, tipo: 'Viland infra', valor: 'R$ 36.728,89', objetivo: 'casa', corretora: 'itau', classe: 'Renda fixa', vencimento: '' },
  { id: 4, tipo: 'Caixinha turbo', valor: 'R$ 5.458,70', objetivo: 'Investimentos', corretora: 'nu', classe: 'Renda fixa', vencimento: '' },
  { id: 5, tipo: 'Fundo Activi rend', valor: 'R$ 48.267,55', objetivo: 'casa', corretora: 'itau', classe: 'Renda fixa', vencimento: '' },
  { id: 6, tipo: 'Index SP500', valor: 'R$ 516,30', objetivo: 'Investimentos', corretora: 'itau', classe: 'Internacional', vencimento: '' },
  { id: 7, tipo: 'Tesouro IPCA', valor: 'R$ 1.841,89', objetivo: 'Previdência', corretora: 'nu', classe: 'Renda fixa', vencimento: '15/08/2026' },
  { id: 8, tipo: 'CDB Bs2', valor: 'R$ 1.235,68', objetivo: 'Investimentos', corretora: 'nu', classe: 'Renda fixa', vencimento: '' },
  { id: 9, tipo: 'sparta', valor: 'R$ 3.610,98', objetivo: 'Investimentos', corretora: 'XP', classe: 'Renda fixa', vencimento: '' },
  { id: 10, tipo: 'CDB FACTA', valor: 'R$ 1.278,87', objetivo: 'Viagem', corretora: 'XP', classe: 'Renda fixa', vencimento: '07/10/2026' },
  { id: 11, tipo: 'FIC FIR', valor: 'R$ 88,89', objetivo: 'Investimentos', corretora: 'XP', classe: 'Renda fixa', vencimento: '' },
  { id: 12, tipo: 'Cofrinho prev', valor: 'R$ 208,77', objetivo: 'Previdência', corretora: 'itau', classe: 'Renda fixa', vencimento: '' },
]

const objectiveColors = ['#7c1d1d', '#4a3728', '#C9A227', '#2d5a87', '#4a7c6f', '#1a1a1a', '#a8a29e', '#b8a898']

const initialGastosFixos: ExpenseRow[] = [
  { id: 1, nome: 'Aluguel', categoria: 'Moradia', valor: 'R$ 2.200,00' },
  { id: 2, nome: 'Energia elétrica', categoria: 'Contas', valor: 'R$ 189,90' },
  { id: 3, nome: 'Internet', categoria: 'Contas', valor: 'R$ 99,90' },
]

const initialCartoes: ExpenseRow[] = [
  { id: 1, data: '07/07/2025', lancamento: 'Supermercado Extra', valor: 'R$ 642,30', categoria: 'Alimentação' },
]

const initialRendas: ValueRow[] = [
  { id: 1, nome: 'Salário', valor: 'R$ 8.500,00' },
]

const initialSonhos: DreamRow[] = [
  { id: 1, nome: 'Casa' },
  { id: 2, nome: 'Viagem' },
]

const initialCarteiraMeta: ValueRow[] = [
  { id: 1, nome: 'Investimentos', valor: 'R$ 50.000,00' },
  { id: 2, nome: 'Casa', valor: 'R$ 150.000,00' },
]

const initialInvestimentosMeta: ValueRow[] = [
  { id: 1, nome: 'Renda fixa', valor: 'R$ 180.000,00' },
  { id: 2, nome: 'Internacional', valor: 'R$ 20.000,00' },
]

const initialSonhosMeta: ValueRow[] = [
  { id: 1, nome: 'Casa', valor: 'R$ 150.000,00' },
  { id: 2, nome: 'Viagem', valor: 'R$ 30.000,00' },
]

const initialViagemMeta: ValueRow[] = [
  { id: 1, nome: 'Passagens', valor: 'R$ 8.000,00' },
  { id: 2, nome: 'Hospedagem', valor: 'R$ 12.000,00' },
]

const initialViagemAtual: ValueRow[] = [
  { id: 1, nome: 'Reserva atual', valor: 'R$ 4.500,00' },
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
  const cleaned = s.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')
  const value = parseFloat(cleaned)
  return Number.isFinite(value) ? value : 0
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function groupByObjetivo(ativos: Ativo[]): Objetivo[] {
  const grouped = new Map<string, { label: string; value: number }>()

  ativos.forEach(ativo => {
    const label = ativo.objetivo.trim()
    if (!label) return
    const key = label.toLocaleLowerCase('pt-BR')
    const current = grouped.get(key)
    grouped.set(key, {
      label: current?.label ?? label,
      value: (current?.value ?? 0) + parseValor(ativo.valor),
    })
  })

  return Array.from(grouped.values())
    .filter(item => item.value > 0)
    .map((item, index) => ({
      initial: item.label.charAt(0).toUpperCase(),
      label: item.label,
      valor: formatCurrency(item.value),
      color: objectiveColors[index % objectiveColors.length],
    }))
}

function groupValues(items: { categoria: string; valor: string }[]) {
  const grouped = new Map<string, { name: string; value: number }>()

  items.forEach(item => {
    const name = item.categoria.trim()
    if (!name) return
    const key = name.toLocaleLowerCase('pt-BR')
    const current = grouped.get(key)
    grouped.set(key, {
      name: current?.name ?? name,
      value: (current?.value ?? 0) + parseValor(item.valor),
    })
  })

  return Array.from(grouped.values())
    .filter(item => item.value > 0)
    .map((item, index) => ({ ...item, color: objectiveColors[index % objectiveColors.length] }))
}

function groupInvestmentsByClass(ativos: Ativo[]) {
  return groupValues(ativos.map(ativo => ({ categoria: ativo.classe, valor: ativo.valor })))
}

function valueRowsToChart(rows: ValueRow[]) {
  return groupValues(rows.map(row => ({ categoria: row.nome, valor: row.valor })))
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

function LargeDonutChart({ items }: { items: Objetivo[] }) {
  const data = items.map(obj => ({ name: obj.label, value: parseValor(obj.valor), color: obj.color }))
  const total = data.reduce((s, d) => s + d.value, 0)
  const totalFmt = formatCurrency(total)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 44, right: 72, bottom: 44, left: 72 }}>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius="32%" outerRadius="52%"
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

function CategoryPieChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr) minmax(180px, 0.65fr)', alignItems: 'center', minHeight: 290 }}>
      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 22, right: 54, bottom: 22, left: 54 }}>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius="72%"
              stroke="#fff"
              strokeWidth={3}
              label={renderOuterLabel}
              labelLine={{ stroke: '#c4b8ae', strokeWidth: 1 }}
            >
              {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 24 }}>
        <div style={{ marginBottom: 5 }}>
          <div style={{ fontSize: 11, color: '#78716c' }}>Total registrado</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#7c1d1d', marginTop: 2 }}>{formatCurrency(total)}</div>
        </div>
        {data.map(item => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: item.color }} />
              <span style={{ fontSize: 12, color: '#57534e' }}>{item.name}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#1c1917' }}>{total ? ((item.value / total) * 100).toFixed(1) : '0'}%</span>
          </div>
        ))}
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

function VisaoGeralView({ ativos, gastosFixos, cartoes }: { ativos: Ativo[]; gastosFixos: ExpenseRow[]; cartoes: ExpenseRow[] }) {
  const gastosData = useMemo(() => groupValues([...gastosFixos, ...cartoes]), [gastosFixos, cartoes])
  const investPortData = useMemo(() => groupInvestmentsByClass(ativos), [ativos])
  const totalGastos = gastosData.reduce((sum, item) => sum + item.value, 0)
  const totalInvestimentos = investPortData.reduce((sum, item) => sum + item.value, 0)

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
            <SmallDonutChart data={gastosData} label="Total gasto" total={formatCurrency(totalGastos)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
              {gastosData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#57534e' }}>{d.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1c1917' }}>{totalGastos > 0 ? ((d.value / totalGastos) * 100).toFixed(1) : '0'}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid #e7e2dc' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#1c1917' }}>Carteira de investimentos</div>
          <div style={{ fontSize: 12, color: '#78716c', marginTop: 2, marginBottom: 16 }}>Alocação por classe de ativo</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <SmallDonutChart data={investPortData} label="Patrimônio" total={formatCurrency(totalInvestimentos)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
              {investPortData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#57534e' }}>{d.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1c1917' }}>{totalInvestimentos > 0 ? ((d.value / totalInvestimentos) * 100).toFixed(1) : '0'}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InvestimentosView({ ativos }: { ativos: Ativo[] }) {
  const objetivos = useMemo(() => groupByObjetivo(ativos), [ativos])
  const total = ativos.reduce((sum, ativo) => sum + parseValor(ativo.valor), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Banner */}
      <div style={{ background: '#5a1a1a', borderRadius: 14, padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#f5f0eb' }}>Investimentos totais:</span>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#C9A227' }}>{formatCurrency(total)}</span>
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
        <div style={{ minHeight: 410, overflow: 'hidden' }}>
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
          <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '1fr 150px 150px 110px 140px', padding: '11px 20px', borderBottom: i < ativos.length - 1 ? '1px solid #f5f0eb' : 'none', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CircleIcon initial={a.tipo.trim().charAt(0).toUpperCase() || '?'} />
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

const editorColumns: { key: Exclude<keyof Ativo, 'id'>; label: string; width: string }[] = [
  { key: 'tipo', label: 'Tipo', width: '1.25fr' },
  { key: 'valor', label: 'Valor', width: '1fr' },
  { key: 'objetivo', label: 'Objetivo', width: '1.1fr' },
  { key: 'corretora', label: 'Corretora', width: '0.9fr' },
  { key: 'classe', label: 'Classe', width: '1.15fr' },
  { key: 'vencimento', label: 'Vencimento', width: '1fr' },
]

function EditarInvestimentosView({ rows, onChange }: {
  rows: Ativo[]
  onChange: (rows: Ativo[]) => void
}) {
  const gridTemplate = `${editorColumns.map(column => column.width).join(' ')} 44px`

  function updateCell(id: number, key: Exclude<keyof Ativo, 'id'>, value: string) {
    onChange(rows.map(row => row.id === id ? { ...row, [key]: value } : row))
  }

  function addRow() {
    onChange([...rows, {
      id: Math.max(0, ...rows.map(row => row.id)) + 1,
      tipo: '',
      valor: '',
      objetivo: '',
      corretora: '',
      classe: '',
      vencimento: '',
    }])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e7e2dc', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 900 }}>
            <div style={{ display: 'grid', gridTemplateColumns: gridTemplate, background: '#7c1d1d', color: '#fff', alignItems: 'center' }}>
              {editorColumns.map(column => (
                <div key={column.key} style={{ padding: '11px 10px', fontSize: 12, fontWeight: 700, borderRight: '1px solid rgba(255,255,255,0.2)' }}>{column.label}</div>
              ))}
              <div />
            </div>

            {rows.map((row, rowIndex) => (
              <div key={row.id} style={{ display: 'grid', gridTemplateColumns: gridTemplate, borderBottom: rowIndex < rows.length - 1 ? '1px solid #e7e2dc' : 'none', alignItems: 'stretch' }}>
                {editorColumns.map(column => (
                  <input
                    key={column.key}
                    value={row[column.key]}
                    onChange={event => updateCell(row.id, column.key, event.target.value)}
                    placeholder={column.key === 'valor' ? 'R$ 0,00' : column.key === 'vencimento' ? 'dd/mm/aaaa' : 'Digite...'}
                    aria-label={`${column.label} da linha ${rowIndex + 1}`}
                    style={{ width: '100%', minWidth: 0, padding: '10px', border: 'none', borderRight: '1px solid #e7e2dc', outline: 'none', color: '#1c1917', background: '#fff', fontSize: 12, fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums' }}
                    onFocus={event => { event.currentTarget.style.background = '#fffaf5' }}
                    onBlur={event => { event.currentTarget.style.background = '#fff' }}
                  />
                ))}
                <button
                  onClick={() => onChange(rows.filter(item => item.id !== row.id))}
                  aria-label={`Excluir linha ${rowIndex + 1}`}
                  title="Excluir linha"
                  style={{ border: 'none', background: '#fff', color: '#a8a29e', cursor: 'pointer', fontSize: 18 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '12px 14px', background: '#faf8f6', borderTop: '1px solid #e7e2dc' }}>
          <button onClick={addRow} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 13px', border: '1px solid #d8d0c8', borderRadius: 8, background: '#fff', color: '#5a1a1a', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            <span style={{ fontSize: 17, lineHeight: 0 }}>+</span>
            Adicionar linha
          </button>
        </div>
      </div>

      <p style={{ margin: 0, color: '#78716c', fontSize: 11 }}>
        As alterações são salvas automaticamente e atualizam o total, a tabela de objetivos e o gráfico da aba Home.
      </p>
    </div>
  )
}

type ExpenseColumn = {
  key: 'nome' | 'data' | 'lancamento' | 'categoria' | 'valor'
  label: string
  width: string
}

function EditableExpenseTable({ rows, columns, onChange }: {
  rows: ExpenseRow[]
  columns: ExpenseColumn[]
  onChange: (rows: ExpenseRow[]) => void
}) {
  const gridTemplate = `${columns.map(column => column.width).join(' ')} 44px`

  function updateCell(id: number, key: ExpenseColumn['key'], value: string) {
    onChange(rows.map(row => row.id === id ? { ...row, [key]: value } : row))
  }

  function addRow() {
    const row: ExpenseRow = {
      id: Math.max(0, ...rows.map(item => item.id)) + 1,
      categoria: '',
      valor: '',
    }
    columns.forEach(column => {
      if (column.key !== 'categoria' && column.key !== 'valor') row[column.key] = ''
    })
    onChange([...rows, row])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e7e2dc', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 720 }}>
            <div style={{ display: 'grid', gridTemplateColumns: gridTemplate, background: '#7c1d1d', color: '#fff', alignItems: 'center' }}>
              {columns.map(column => (
                <div key={column.key} style={{ padding: '11px 12px', fontSize: 12, fontWeight: 700, borderRight: '1px solid rgba(255,255,255,0.2)' }}>{column.label}</div>
              ))}
              <div />
            </div>

            {rows.map((row, rowIndex) => (
              <div key={row.id} style={{ display: 'grid', gridTemplateColumns: gridTemplate, borderBottom: rowIndex < rows.length - 1 ? '1px solid #e7e2dc' : 'none' }}>
                {columns.map(column => (
                  <input
                    key={column.key}
                    value={row[column.key] ?? ''}
                    onChange={event => updateCell(row.id, column.key, event.target.value)}
                    placeholder={column.key === 'valor' ? 'R$ 0,00' : column.key === 'data' ? 'dd/mm/aaaa' : 'Digite...'}
                    aria-label={`${column.label} da linha ${rowIndex + 1}`}
                    style={{ width: '100%', minWidth: 0, padding: '11px 12px', border: 'none', borderRight: '1px solid #e7e2dc', outline: 'none', color: '#1c1917', background: '#fff', fontSize: 12, fontFamily: 'inherit', fontVariantNumeric: 'tabular-nums' }}
                    onFocus={event => { event.currentTarget.style.background = '#fffaf5' }}
                    onBlur={event => { event.currentTarget.style.background = '#fff' }}
                  />
                ))}
                <button
                  onClick={() => onChange(rows.filter(item => item.id !== row.id))}
                  aria-label={`Excluir linha ${rowIndex + 1}`}
                  title="Excluir linha"
                  style={{ border: 'none', background: '#fff', color: '#a8a29e', cursor: 'pointer', fontSize: 18 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '12px 14px', background: '#faf8f6', borderTop: '1px solid #e7e2dc' }}>
          <button onClick={addRow} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 13px', border: '1px solid #d8d0c8', borderRadius: 8, background: '#fff', color: '#7c1d1d', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            <span style={{ fontSize: 17, lineHeight: 0 }}>+</span>
            Adicionar linha
          </button>
        </div>
      </div>
      <p style={{ margin: 0, color: '#78716c', fontSize: 11 }}>As alterações são salvas automaticamente e atualizam o gráfico de gastos da Visão Geral.</p>
    </div>
  )
}

function GastosView({ tab, gastosFixos, cartoes, onGastosChange, onCartoesChange }: {
  tab: 'Gastos fixos' | 'Cartões'
  gastosFixos: ExpenseRow[]
  cartoes: ExpenseRow[]
  onGastosChange: (rows: ExpenseRow[]) => void
  onCartoesChange: (rows: ExpenseRow[]) => void
}) {
  const chartData = useMemo(() => groupValues([...gastosFixos, ...cartoes]), [gastosFixos, cartoes])
  const table = tab === 'Cartões'
    ? (
      <EditableExpenseTable
        rows={cartoes}
        onChange={onCartoesChange}
        columns={[
          { key: 'data', label: 'Data', width: '0.8fr' },
          { key: 'lancamento', label: 'Lançamento', width: '1.6fr' },
          { key: 'valor', label: 'Valor', width: '1fr' },
          { key: 'categoria', label: 'Categoria', width: '1.1fr' },
        ]}
      />
    )
    : (
      <EditableExpenseTable
        rows={gastosFixos}
        onChange={onGastosChange}
        columns={[
          { key: 'nome', label: 'Nome', width: '1.5fr' },
          { key: 'categoria', label: 'Categoria', width: '1.2fr' },
          { key: 'valor', label: 'Valor', width: '1fr' },
        ]}
      />
    )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e7e2dc', overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px 0' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1c1917' }}>Gastos por categoria</div>
          <div style={{ fontSize: 12, color: '#78716c', marginTop: 2 }}>Consolidado de gastos fixos e lançamentos dos cartões</div>
        </div>
        <CategoryPieChart data={chartData} />
      </div>
      {table}
    </div>
  )
}

function CompactValueTable({ rows, onChange, nameLabel = 'Objetivo', showTotal = false }: {
  rows: ValueRow[]
  onChange: (rows: ValueRow[]) => void
  nameLabel?: string
  showTotal?: boolean
}) {
  const total = rows.reduce((sum, row) => sum + parseValor(row.valor), 0)

  function addRow() {
    onChange([...rows, { id: Math.max(0, ...rows.map(row => row.id)) + 1, nome: '', valor: '' }])
  }

  return (
    <div style={{ border: '1px solid #e7e2dc', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 40px', background: '#7c1d1d', color: '#fff' }}>
        <div style={{ padding: '9px 12px', fontSize: 11, fontWeight: 700 }}>{nameLabel}</div>
        <div style={{ padding: '9px 12px', fontSize: 11, fontWeight: 700, borderLeft: '1px solid rgba(255,255,255,0.2)' }}>Valor</div>
        <div />
      </div>
      {rows.map((row, index) => (
        <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 40px', borderBottom: '1px solid #eee8e2' }}>
          <input
            value={row.nome}
            onChange={event => onChange(rows.map(item => item.id === row.id ? { ...item, nome: event.target.value } : item))}
            placeholder={nameLabel}
            aria-label={`${nameLabel} ${index + 1}`}
            style={{ border: 'none', borderRight: '1px solid #eee8e2', padding: '9px 12px', outline: 'none', fontSize: 12, fontFamily: 'inherit', color: '#1c1917' }}
          />
          <input
            value={row.valor}
            onChange={event => onChange(rows.map(item => item.id === row.id ? { ...item, valor: event.target.value } : item))}
            placeholder="R$ 0,00"
            aria-label={`Valor ${index + 1}`}
            style={{ border: 'none', padding: '9px 12px', outline: 'none', fontSize: 12, fontFamily: 'inherit', color: '#1c1917', fontVariantNumeric: 'tabular-nums' }}
          />
          <button onClick={() => onChange(rows.filter(item => item.id !== row.id))} aria-label={`Excluir linha ${index + 1}`} style={{ border: 'none', background: '#fff', color: '#a8a29e', cursor: 'pointer', fontSize: 17 }}>×</button>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', background: '#faf8f6' }}>
        <button onClick={addRow} style={{ border: '1px solid #d8d0c8', background: '#fff', color: '#7c1d1d', borderRadius: 7, padding: '6px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>+ Adicionar</button>
        {showTotal && <div style={{ fontSize: 12, color: '#57534e' }}>Total: <strong style={{ color: '#7c1d1d' }}>{formatCurrency(total)}</strong></div>}
      </div>
    </div>
  )
}

function RendaView({ rows, onChange }: { rows: ValueRow[]; onChange: (rows: ValueRow[]) => void }) {
  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#1c1917' }}>Fontes de renda</div>
        <div style={{ fontSize: 12, color: '#78716c', marginTop: 3 }}>Cadastre suas entradas mensais. O total é calculado automaticamente.</div>
      </div>
      <CompactValueTable rows={rows} onChange={onChange} nameLabel="Fonte de renda" showTotal />
    </div>
  )
}

function SonhosView({ rows, onChange }: { rows: DreamRow[]; onChange: (rows: DreamRow[]) => void }) {
  function addRow() {
    onChange([...rows, { id: Math.max(0, ...rows.map(row => row.id)) + 1, nome: '' }])
  }

  return (
    <div style={{ maxWidth: 620 }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#1c1917' }}>Seus sonhos</div>
        <div style={{ fontSize: 12, color: '#78716c', marginTop: 3 }}>Os nomes desta lista identificam quais objetivos de Investimentos entram no gráfico realizado.</div>
      </div>
      <div style={{ border: '1px solid #e7e2dc', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px', background: '#7c1d1d', color: '#fff' }}>
          <div style={{ padding: '10px 12px', fontSize: 11, fontWeight: 700 }}>Sonho</div>
          <div />
        </div>
        {rows.map((row, index) => (
          <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '1fr 40px', borderBottom: '1px solid #eee8e2' }}>
            <input value={row.nome} onChange={event => onChange(rows.map(item => item.id === row.id ? { ...item, nome: event.target.value } : item))} placeholder="Digite um sonho..." aria-label={`Sonho ${index + 1}`} style={{ border: 'none', padding: '10px 12px', outline: 'none', fontSize: 12, fontFamily: 'inherit', color: '#1c1917' }} />
            <button onClick={() => onChange(rows.filter(item => item.id !== row.id))} aria-label={`Excluir sonho ${index + 1}`} style={{ border: 'none', background: '#fff', color: '#a8a29e', cursor: 'pointer', fontSize: 17 }}>×</button>
          </div>
        ))}
        <div style={{ padding: '10px 11px', background: '#faf8f6' }}>
          <button onClick={addRow} style={{ border: '1px solid #d8d0c8', background: '#fff', color: '#7c1d1d', borderRadius: 7, padding: '6px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>+ Adicionar sonho</button>
        </div>
      </div>
    </div>
  )
}

function GoalChart({ title, data }: { title: string; data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  return (
    <div style={{ background: '#faf8f6', border: '1px solid #eee8e2', borderRadius: 14, padding: '15px 16px' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#7c1d1d', marginBottom: 8 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <SmallDonutChart data={data} label={title} total={formatCurrency(total)} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
          {data.length === 0 && <span style={{ fontSize: 11, color: '#a8a29e' }}>Sem valores registrados</span>}
          {data.map(item => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: '#57534e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1c1917' }}>{total ? ((item.value / total) * 100).toFixed(1) : '0'}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GoalSection({ title, description, metaRows, onMetaChange, actualData, actualRows, onActualChange, nameLabel }: {
  title: string
  description: string
  metaRows: ValueRow[]
  onMetaChange: (rows: ValueRow[]) => void
  actualData: { name: string; value: number; color: string }[]
  actualRows?: ValueRow[]
  onActualChange?: (rows: ValueRow[]) => void
  nameLabel: string
}) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e7e2dc', borderRadius: 16, padding: 20 }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#1c1917' }}>{title}</div>
        <div style={{ fontSize: 12, color: '#78716c', marginTop: 2 }}>{description}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: actualRows ? '1fr 1fr' : 'minmax(340px, 0.65fr)', gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 10, color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Planejamento da meta</div>
          <CompactValueTable rows={metaRows} onChange={onMetaChange} nameLabel={nameLabel} />
        </div>
        {actualRows && onActualChange && (
          <div>
            <div style={{ fontSize: 10, color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Valores realizados</div>
            <CompactValueTable rows={actualRows} onChange={onActualChange} nameLabel={nameLabel} />
          </div>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <GoalChart title="Meta" data={valueRowsToChart(metaRows)} />
        <GoalChart title="Realizado" data={actualData} />
      </div>
    </div>
  )
}

function MetasHomeView({ ativos, sonhos, carteiraMeta, investimentosMeta, sonhosMeta, viagemMeta, viagemAtual, onCarteiraMetaChange, onInvestimentosMetaChange, onSonhosMetaChange, onViagemMetaChange, onViagemAtualChange }: {
  ativos: Ativo[]
  sonhos: DreamRow[]
  carteiraMeta: ValueRow[]
  investimentosMeta: ValueRow[]
  sonhosMeta: ValueRow[]
  viagemMeta: ValueRow[]
  viagemAtual: ValueRow[]
  onCarteiraMetaChange: (rows: ValueRow[]) => void
  onInvestimentosMetaChange: (rows: ValueRow[]) => void
  onSonhosMetaChange: (rows: ValueRow[]) => void
  onViagemMetaChange: (rows: ValueRow[]) => void
  onViagemAtualChange: (rows: ValueRow[]) => void
}) {
  const carteiraAtual = groupValues(groupByObjetivo(ativos).map(item => ({ categoria: item.label, valor: item.valor })))
  const investimentosAtual = groupInvestmentsByClass(ativos)
  const dreamNames = new Set(sonhos.map(sonho => sonho.nome.trim().toLocaleLowerCase('pt-BR')).filter(Boolean))
  const sonhosAtual = groupValues(
    ativos
      .filter(ativo => dreamNames.has(ativo.objetivo.trim().toLocaleLowerCase('pt-BR')))
      .map(ativo => ({ categoria: ativo.objetivo, valor: ativo.valor }))
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <GoalSection title="Carteira" description="Distribuição desejada e patrimônio atual separado pelos objetivos de Investimentos." metaRows={carteiraMeta} onMetaChange={onCarteiraMetaChange} actualData={carteiraAtual} nameLabel="Objetivo" />
      <GoalSection title="Investimentos" description="Compare a alocação planejada com os ativos atuais separados por classe." metaRows={investimentosMeta} onMetaChange={onInvestimentosMetaChange} actualData={investimentosAtual} nameLabel="Classe" />
      <GoalSection title="Sonhos" description="O realizado considera somente objetivos de Investimentos listados na aba Sonhos." metaRows={sonhosMeta} onMetaChange={onSonhosMetaChange} actualData={sonhosAtual} nameLabel="Sonho" />
      <GoalSection title="Viagem" description="Planejamento e valores realizados preenchidos manualmente." metaRows={viagemMeta} onMetaChange={onViagemMetaChange} actualData={valueRowsToChart(viagemAtual)} actualRows={viagemAtual} onActualChange={onViagemAtualChange} nameLabel="Item" />
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

function HeaderAction({ label, onClick, children, disabled = false }: {
  label: string
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{ position: 'relative' }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #e7e2dc', background: '#fff', color: disabled ? '#c4b8ae' : '#7c1d1d', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'wait' : 'pointer' }}
      >
        {children}
      </button>
      {hovered && (
        <div style={{ position: 'absolute', right: 0, top: 40, zIndex: 20, background: '#1c1917', color: '#fff', borderRadius: 6, padding: '6px 9px', fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap', boxShadow: '0 5px 16px rgba(28,25,23,0.18)' }}>
          {label}
        </div>
      )}
    </div>
  )
}

function SaveIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 3h11l3 3v15H5V3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M8 3v6h8V3M8 21v-7h8v7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
}

function ImportIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 18v3h14v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function SearchIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" /><path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
}

function BellIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

// ─── App ──────────────────────────────────────────────────────────────────────

function loadLocal<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

function persistLocal<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

function parseCsv(text: string) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean)
  if (!lines.length) return []
  const delimiter = (lines[0].match(/;/g)?.length ?? 0) >= (lines[0].match(/,/g)?.length ?? 0) ? ';' : ','
  const split = (line: string) => line.split(new RegExp(`${delimiter}(?=(?:[^"]*"[^"]*")*[^"]*$)`)).map(cell => cell.trim().replace(/^"|"$/g, '').replace(/""/g, '"'))
  const headers = split(lines[0]).map(header => header.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
  return lines.slice(1).map(line => {
    const values = split(line)
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']))
  })
}

export default function App() {
  const [activeNav, setActiveNav] = useState('Visão Geral')
  const [investmentTab, setInvestmentTab] = useState<'Home' | 'Editar investimentos'>('Home')
  const [expenseTab, setExpenseTab] = useState<'Gastos fixos' | 'Cartões'>('Gastos fixos')
  const [goalsTab, setGoalsTab] = useState<'Home' | 'Renda' | 'Sonhos'>('Home')
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [ativos, setAtivos] = useState<Ativo[]>(() => loadLocal('lab-finance-investimentos', initialAtivos))
  const [gastosFixos, setGastosFixos] = useState<ExpenseRow[]>(() => loadLocal('lab-finance-gastos-fixos', initialGastosFixos))
  const [cartoes, setCartoes] = useState<ExpenseRow[]>(() => loadLocal('lab-finance-cartoes', initialCartoes))
  const [rendas, setRendas] = useState<ValueRow[]>(() => loadLocal('lab-finance-rendas', initialRendas))
  const [sonhos, setSonhos] = useState<DreamRow[]>(() => loadLocal('lab-finance-sonhos', initialSonhos))
  const [carteiraMeta, setCarteiraMeta] = useState<ValueRow[]>(() => loadLocal('lab-finance-meta-carteira', initialCarteiraMeta))
  const [investimentosMeta, setInvestimentosMeta] = useState<ValueRow[]>(() => loadLocal('lab-finance-meta-investimentos', initialInvestimentosMeta))
  const [sonhosMeta, setSonhosMeta] = useState<ValueRow[]>(() => loadLocal('lab-finance-meta-sonhos', initialSonhosMeta))
  const [viagemMeta, setViagemMeta] = useState<ValueRow[]>(() => loadLocal('lab-finance-meta-viagem', initialViagemMeta))
  const [viagemAtual, setViagemAtual] = useState<ValueRow[]>(() => loadLocal('lab-finance-atual-viagem', initialViagemAtual))

  function updateGastosFixos(rows: ExpenseRow[]) {
    setGastosFixos(rows)
    localStorage.setItem('lab-finance-gastos-fixos', JSON.stringify(rows))
  }

  function updateCartoes(rows: ExpenseRow[]) {
    setCartoes(rows)
    localStorage.setItem('lab-finance-cartoes', JSON.stringify(rows))
  }

  function updateAtivos(rows: Ativo[]) {
    setAtivos(rows)
    persistLocal('lab-finance-investimentos', rows)
  }

  function updateValueRows(key: string, setter: React.Dispatch<React.SetStateAction<ValueRow[]>>, rows: ValueRow[]) {
    setter(rows)
    persistLocal(key, rows)
  }

  function updateDreams(rows: DreamRow[]) {
    setSonhos(rows)
    persistLocal('lab-finance-sonhos', rows)
  }

  async function saveAllData() {
    setSyncStatus('saving')
    try {
      //const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c1153085/finance-data`,
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/server/finance-data`,
         {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          user: 'Lucas',
          investimentos: ativos,
          gastosFixos,
          cartoes,
          rendas,
          sonhos,
          metas: { carteira: carteiraMeta, investimentos: investimentosMeta, sonhos: sonhosMeta, viagem: viagemMeta },
          realizados: { viagem: viagemAtual },
        }),
      })
      if (!response.ok) throw new Error('Falha ao salvar')
      setSyncStatus('saved')
      window.setTimeout(() => setSyncStatus('idle'), 2500)
    } catch {
      setSyncStatus('error')
      window.setTimeout(() => setSyncStatus('idle'), 3500)
    }
  }

  async function importFile(file: File) {
    const text = await file.text()
    if (file.name.toLocaleLowerCase().endsWith('.json')) {
      const imported = JSON.parse(text)
      if (imported.investimentos) updateAtivos(imported.investimentos)
      if (imported.gastosFixos) updateGastosFixos(imported.gastosFixos)
      if (imported.cartoes) updateCartoes(imported.cartoes)
      if (imported.rendas) updateValueRows('lab-finance-rendas', setRendas, imported.rendas)
      if (imported.sonhos) updateDreams(imported.sonhos)
      if (imported.metas?.carteira) updateValueRows('lab-finance-meta-carteira', setCarteiraMeta, imported.metas.carteira)
      if (imported.metas?.investimentos) updateValueRows('lab-finance-meta-investimentos', setInvestimentosMeta, imported.metas.investimentos)
      if (imported.metas?.sonhos) updateValueRows('lab-finance-meta-sonhos', setSonhosMeta, imported.metas.sonhos)
      if (imported.metas?.viagem) updateValueRows('lab-finance-meta-viagem', setViagemMeta, imported.metas.viagem)
      if (imported.realizados?.viagem) updateValueRows('lab-finance-atual-viagem', setViagemAtual, imported.realizados.viagem)
      return
    }

    const rows = parseCsv(text)
    if (!rows.length) return
    const headers = Object.keys(rows[0])
    if (headers.includes('tipo') && headers.includes('objetivo')) {
      updateAtivos(rows.map((row, index) => ({ id: index + 1, tipo: row.tipo, valor: row.valor, objetivo: row.objetivo, corretora: row.corretora ?? '', classe: row.classe ?? '', vencimento: row.vencimento ?? '' })))
    } else if (headers.includes('data') && headers.includes('lancamento')) {
      updateCartoes(rows.map((row, index) => ({ id: index + 1, data: row.data, lancamento: row.lancamento, valor: row.valor, categoria: row.categoria ?? '' })))
    } else if (headers.includes('nome') && headers.includes('categoria')) {
      updateGastosFixos(rows.map((row, index) => ({ id: index + 1, nome: row.nome, categoria: row.categoria, valor: row.valor ?? '' })))
    }
  }

  function renderView() {
    if (activeNav === 'Visão Geral') return <VisaoGeralView ativos={ativos} gastosFixos={gastosFixos} cartoes={cartoes} />
    if (activeNav === 'Gastos') {
      return (
        <GastosView
          tab={expenseTab}
          gastosFixos={gastosFixos}
          cartoes={cartoes}
          onGastosChange={updateGastosFixos}
          onCartoesChange={updateCartoes}
        />
      )
    }
    if (activeNav === 'Investimentos') {
      if (investmentTab === 'Editar investimentos') {
        return (
          <EditarInvestimentosView
            rows={ativos}
            onChange={updateAtivos}
          />
        )
      }
      return <InvestimentosView ativos={ativos} />
    }
    if (activeNav === 'Metas') {
      if (goalsTab === 'Renda') {
        return <RendaView rows={rendas} onChange={rows => updateValueRows('lab-finance-rendas', setRendas, rows)} />
      }
      if (goalsTab === 'Sonhos') {
        return <SonhosView rows={sonhos} onChange={updateDreams} />
      }
      return (
        <MetasHomeView
          ativos={ativos}
          sonhos={sonhos}
          carteiraMeta={carteiraMeta}
          investimentosMeta={investimentosMeta}
          sonhosMeta={sonhosMeta}
          viagemMeta={viagemMeta}
          viagemAtual={viagemAtual}
          onCarteiraMetaChange={rows => updateValueRows('lab-finance-meta-carteira', setCarteiraMeta, rows)}
          onInvestimentosMetaChange={rows => updateValueRows('lab-finance-meta-investimentos', setInvestimentosMeta, rows)}
          onSonhosMetaChange={rows => updateValueRows('lab-finance-meta-sonhos', setSonhosMeta, rows)}
          onViagemMetaChange={rows => updateValueRows('lab-finance-meta-viagem', setViagemMeta, rows)}
          onViagemAtualChange={rows => updateValueRows('lab-finance-atual-viagem', setViagemAtual, rows)}
        />
      )
    }
    return <PlaceholderView label={activeNav} />
  }

  const sectionTabs: readonly string[] = activeNav === 'Investimentos'
    ? ['Home', 'Editar investimentos']
    : activeNav === 'Gastos'
      ? ['Gastos fixos', 'Cartões']
      : activeNav === 'Metas'
        ? ['Home', 'Renda', 'Sonhos']
      : ['Home']

  function isActiveTab(tab: string) {
    if (activeNav === 'Investimentos') return investmentTab === tab
    if (activeNav === 'Gastos') return expenseTab === tab
    if (activeNav === 'Metas') return goalsTab === tab
    return true
  }

  function selectTab(tab: string) {
    if (activeNav === 'Investimentos') setInvestmentTab(tab as 'Home' | 'Editar investimentos')
    if (activeNav === 'Gastos') setExpenseTab(tab as 'Gastos fixos' | 'Cartões')
    if (activeNav === 'Metas') setGoalsTab(tab as 'Home' | 'Renda' | 'Sonhos')
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
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#7c1d1d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#f5f0eb', flexShrink: 0 }}>L</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 12, color: '#f5f0eb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Lucas</div>
              <div style={{ fontSize: 10, color: '#78716c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>lucas@email...</div>
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7, paddingTop: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e7e2dc', borderRadius: 8, padding: '7px 14px', fontSize: 13, color: '#a8a29e' }}>
                <SearchIcon />
                Buscar transações...
              </div>
              <div style={{ width: 34, height: 34, background: '#fff', border: '1px solid #e7e2dc', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#57534e', cursor: 'pointer' }}><BellIcon /></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 7 }}>
              <HeaderAction
                label={syncStatus === 'saving' ? 'Salvando no Supabase...' : syncStatus === 'saved' ? 'Dados salvos no Supabase' : syncStatus === 'error' ? 'Falha ao salvar. Tente novamente' : 'Salvar todos os dados'}
                onClick={saveAllData}
                disabled={syncStatus === 'saving'}
              >
                <SaveIcon />
              </HeaderAction>
              <HeaderAction label="Importar planilha" onClick={() => fileInputRef.current?.click()}>
                <ImportIcon />
              </HeaderAction>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv,text/csv,application/json"
                onChange={event => {
                  const file = event.target.files?.[0]
                  if (file) importFile(file).catch(() => setSyncStatus('error'))
                  event.currentTarget.value = ''
                }}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </header>

        {/* Section tabs */}
        <div style={{ padding: '10px 28px 0', borderBottom: '1px solid #e7e2dc' }}>
          {sectionTabs.map(tab => {
            const active = isActiveTab(tab)
            return (
              <button
                key={tab}
                onClick={() => selectTab(tab)}
                style={{ padding: '8px 16px', fontSize: 13, fontWeight: active ? 700 : 500, color: active ? '#1c1917' : '#78716c', border: 'none', borderBottom: active ? '2px solid #7c1d1d' : '2px solid transparent', marginBottom: -1, background: 'transparent', cursor: sectionTabs.length > 1 ? 'pointer' : 'default' }}
              >
                {tab}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '16px 28px 24px', overflowY: 'auto' }}>
          {renderView()}
        </div>
      </main>
    </div>
  )
}
