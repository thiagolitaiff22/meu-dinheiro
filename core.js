'use strict';
/* =========================================================
   Meu Dinheiro: núcleo (dados, regras, utilitários)
   Modelo inspirado no Mobills: lançamentos pendentes/pagos,
   repetição, cartão com fatura, transferência, saldo previsto.
   ========================================================= */
const KEY = 'meudinheiro.v1';

const ICONS = {
  utensils: '<path d="M3 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6a2 2 0 0 0 2 2h3zm0 0v7"/>',
  cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 2h2l2.7 12.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L22 7H5.1"/>',
  car: '<path d="M19 17h2a1 1 0 0 0 1-1v-3a2 2 0 0 0-1.5-1.9L16 10l-2.2-2.3a2 2 0 0 0-1.8-.7H5a1.5 1.5 0 0 0-1.4.9L2.2 10.8A3.7 3.7 0 0 0 2 12v4a1 1 0 0 0 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  game: '<path d="M6 12h4M8 10v4"/><path d="M15 13h.01M18 11h.01"/><path d="M17.3 5H6.7a4 4 0 0 0-3.9 3.2L2 16a3 3 0 0 0 5.2 2l1.4-2h6.8l1.4 2A3 3 0 0 0 22 16l-.8-7.8A4 4 0 0 0 17.3 5z"/>',
  shirt: '<path d="M20.4 5.6 16 3a4 4 0 0 1-8 0L3.6 5.6a1 1 0 0 0-.5 1.2l1.3 3.7a1 1 0 0 0 1 .7H7v9a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-9h1.6a1 1 0 0 0 1-.7l1.3-3.7a1 1 0 0 0-.5-1.2z"/>',
  repeat: '<path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  bulb: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.7.6 1 1.4 1 2.3h6c0-.9.3-1.7 1-2.3A7 7 0 0 0 12 2z"/>',
  spark: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
  arrowup: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  arrowdown: '<path d="M12 5v14M5 12l7 7 7-7"/>',
  trend: '<path d="M3 7l6 6 4-4 8 8"/><path d="M15 17h6v-6"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M17.9 17.9A10 10 0 0 1 12 19c-6.5 0-10-7-10-7a17 17 0 0 1 4.1-5M9.9 5.2A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-2.2 3.2M1 1l22 22"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  bank: '<path d="M3 21h18M5 21V10M9 21V10M15 21V10M19 21V10M2 10l10-7 10 7z"/>',
  swap: '<path d="M7 7h13l-4-4M17 17H4l4 4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>'
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ''}</svg>`;

const CATS = [['utensils', 'Alimentação', '#e8590c'], ['cart', 'Mercado', '#2f9e44'], ['car', 'Transporte', '#1c7ed6'], ['home', 'Moradia', '#7048e8'], ['heart', 'Saúde', '#e03131'], ['book', 'Educação', '#0c8599'], ['game', 'Lazer', '#d6336c'], ['shirt', 'Roupas', '#9c36b5'], ['repeat', 'Assinaturas', '#3b5bdb'], ['bag', 'Bares e delivery', '#f08c00'], ['trend', 'Dívidas', '#d9480f'], ['tag', 'Outros', '#5c7080']];
const CATS_REC = [['trend', 'Salário', '#2f9e44'], ['spark', 'Extra', '#0c8599'], ['bag', 'Vendas', '#f08c00'], ['tag', 'Outros', '#5c7080']];
const TIPOS = { necessario: 'Necessário', cortavel: 'Dá pra cortar', besteira: 'Besteira' };
const FORMAS = { boleto: 'Boleto', pix: 'Pix', cartao: 'Cartão', debito: 'Débito automático', dinheiro: 'Dinheiro' };
const COR_BANCO = ['#cc092f', '#8a05be', '#ec7000', '#0b6bcb', '#1a8f5c', '#c2185b'];

/* ---------- utilitários ---------- */
const $ = s => document.querySelector(s);
const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const R = v => BRL.format(v || 0);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const p2 = n => String(n).padStart(2, '0');
const hoje = () => { const d = new Date(); return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`; };
const mesNome = m => { const [y, mo] = m.split('-'); return new Date(y, mo - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }); };
const mesCurto = m => { const [y, mo] = m.split('-'); return new Date(y, mo - 1, 1).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''); };
const mesMove = (m, n) => { const [y, mo] = m.split('-').map(Number); const d = new Date(y, mo - 1 + n, 1); return `${d.getFullYear()}-${p2(d.getMonth() + 1)}`; };
const ultimoDia = m => { const [y, mo] = m.split('-').map(Number); return new Date(y, mo, 0).getDate(); };
const dataNoMes = (m, dia) => `${m}-${p2(Math.min(dia, ultimoDia(m)))}`;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const soma = (arr, f) => arr.reduce((t, x) => t + f(x), 0);
const fmtIn = v => String(Math.round(v * 100) / 100).replace('.', ',');
const num = v => {
  let s = String(v ?? '').trim().replace(/[^\d.,-]/g, '');
  if (s.includes(',') || /^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '').replace(',', '.');
  const n = parseFloat(s);
  return isFinite(n) ? n : 0;
};
const catInfo = nome => CATS.concat(CATS_REC).find(x => x[1] === nome) || CATS[CATS.length - 1];

/* ---------- estado e migração ---------- */
const vazio = () => ({ v: 2, saldoInicial: 0, bancos: [], cartoes: [], lancs: [], series: [], faturas: {}, orcamentos: {}, dividas: [], metas: [], ocultar: false });

function migrar(raw) {
  const d = Object.assign(vazio(), raw);
  if (raw.v === 2) return d;
  // v1 -> v2
  d.v = 2;
  d.lancs = Array.isArray(raw.lancs) ? raw.lancs : [];
  (raw.gastos || []).forEach(g => d.lancs.push({
    id: g.id, tipo: 'despesa', valor: g.valor, desc: g.descricao, cat: g.categoria, data: g.data,
    conta: g.banco || '', cartao: '', pago: true, nat: (g.custo === 'fixo' || g.conta) ? 'fixa' : 'variavel',
    sent: g.tipo || 'necessario', serie: g.conta || ''
  }));
  (raw.entradas || []).forEach(e => d.lancs.push({
    id: e.id, tipo: 'receita', valor: e.valor, desc: e.descricao, cat: 'Outros', data: e.data,
    conta: e.banco || '', cartao: '', pago: true, nat: 'variavel'
  }));
  d.series = Array.isArray(raw.series) ? raw.series : [];
  const inicio = hoje().slice(0, 7);
  (raw.contas || []).forEach(c => {
    if (!c || !c.id || typeof c.valor !== 'number') return;
    d.series.push({ id: c.id, tipo: 'despesa', desc: c.nome, valor: c.valor, cat: c.categoria || 'Outros', conta: c.banco || '', cartao: '', dia: c.dia, forma: c.forma || 'boleto', inicio, fim: '' });
  });
  delete d.gastos; delete d.entradas; delete d.contas; delete d.renda; delete d.seeded;
  return d;
}

function carregar() {
  let raw = null;
  try { raw = JSON.parse(localStorage.getItem(KEY)); } catch (e) { raw = null; }
  if (!raw) {
    const n = vazio();
    n.series.push({ id: uid(), tipo: 'despesa', desc: 'Carro', valor: 1720, cat: 'Transporte', conta: '', cartao: '', dia: 10, forma: 'boleto', inicio: hoje().slice(0, 7), fim: '' });
    return n;
  }
  return migrar(raw);
}

let S = carregar();
let tab = 'inicio';
let mes = hoje().slice(0, 7);
let filtro = 'todas';

/* ---------- repetição: gera os lançamentos pendentes das séries ---------- */
function garantirSeries(ate) {
  const limite = [mesMove(hoje().slice(0, 7), 3), ate || ''].sort().pop();
  let mudou = false;
  S.series.forEach(s => {
    for (let m = s.inicio; m <= limite; m = mesMove(m, 1)) {
      if (s.fim && m > s.fim) break;
      if (!S.lancs.some(l => l.serie === s.id && l.data.startsWith(m))) {
        S.lancs.push({ id: uid(), tipo: s.tipo, valor: s.valor, desc: s.desc, cat: s.cat, data: dataNoMes(m, s.dia), conta: s.conta || '', cartao: s.cartao || '', pago: false, nat: 'fixa', sent: 'necessario', serie: s.id });
        mudou = true;
      }
    }
  });
  return mudou;
}

/* ---------- regras de saldo ---------- */
const temBanco = id => !!id && S.bancos.some(b => b.id === id);
const contaDe = l => (temBanco(l.conta) ? l.conta : '');
const lancsPagos = () => S.lancs.filter(l => l.pago || l.tipo === 'fatura' || (l.tipo === 'despesa' && l.cartao));

function movimento(id) { // efeito acumulado dos lançamentos efetivados numa conta ('' = sem conta)
  let t = 0;
  S.lancs.forEach(l => {
    if (!l.pago && l.tipo !== 'fatura') return;
    if (l.tipo === 'receita') { if (contaDe(l) === id) t += l.valor; }
    else if (l.tipo === 'despesa') { if (!l.cartao && contaDe(l) === id) t -= l.valor; }
    else if (l.tipo === 'fatura') { if (contaDe(l) === id) t -= l.valor; }
    else if (l.tipo === 'transf') {
      if (contaDe(l) === id) t -= l.valor;
      if ((temBanco(l.destino) ? l.destino : '') === id) t += l.valor;
    }
  });
  return t;
}
function saldoDe(id) {
  const base = id ? ((S.bancos.find(b => b.id === id) || {}).saldoInicial || 0) : (S.saldoInicial || 0);
  return base + movimento(id || '');
}
const saldoAtual = () => saldoDe('') + soma(S.bancos, b => saldoDe(b.id));

/* ---------- cartão de crédito e faturas ---------- */
function faturaDe(c, data) { // devolve o mês de vencimento (YYYY-MM) da compra
  const dia = +data.slice(8), mc = data.slice(0, 7);
  const base = dia > c.fechamento ? mesMove(mc, 1) : mc;
  return c.vencimento <= c.fechamento ? mesMove(base, 1) : base;
}
const chaveFatura = (c, m) => `${c.id}|${m}`;
function totalFatura(c, m) {
  return soma(S.lancs.filter(l => l.tipo === 'despesa' && l.cartao === c.id && faturaDe(c, l.data) === m), l => l.valor);
}
function faturasAbertas(c) {
  const meses = [...new Set(S.lancs.filter(l => l.tipo === 'despesa' && l.cartao === c.id).map(l => faturaDe(c, l.data)))].sort();
  return meses.filter(m => !(S.faturas[chaveFatura(c, m)] || {}).pago).map(m => ({ mes: m, valor: totalFatura(c, m), venc: dataNoMes(m, c.vencimento) }));
}
const limiteUsado = c => soma(faturasAbertas(c), f => f.valor);

/* ---------- totais do mês ---------- */
const doMes = (m = mes) => S.lancs.filter(l => l.data.startsWith(m));
const despesasMes = (m = mes) => doMes(m).filter(l => l.tipo === 'despesa');
const receitasMes = (m = mes) => doMes(m).filter(l => l.tipo === 'receita');
const pendentes = (m = mes) => doMes(m).filter(l => !l.pago && (l.tipo === 'despesa' || l.tipo === 'receita') && !l.cartao);
const atrasado = l => !l.pago && l.data < hoje();
function saldoPrevisto(m = mes) {
  const fim = dataNoMes(m, 31);
  const pend = S.lancs.filter(l => !l.pago && !l.cartao && l.data <= fim && (l.tipo === 'despesa' || l.tipo === 'receita'));
  const fat = soma(S.cartoes, c => soma(faturasAbertas(c).filter(f => f.venc <= fim), f => f.valor));
  return saldoAtual() + soma(pend.filter(l => l.tipo === 'receita'), l => l.valor) - soma(pend.filter(l => l.tipo === 'despesa'), l => l.valor) - fat;
}

/* ---------- dívidas (mantido) ---------- */
const restante = d => Math.max(0, d.total - soma(d.pagamentos || [], p => p.valor));
const dividasAbertas = () => S.dividas.filter(d => restante(d) > 0.004).sort((a, b) => restante(a) - restante(b));

/* ---------- nuvem (Supabase, opcional) ---------- */
const sb = (window.supabase && window.SUPABASE_URL && window.SUPABASE_KEY)
  ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true } })
  : null;
let user = null, pendenteNuvem = false, tSync = null;

async function enviarNuvem() {
  const { error } = await sb.from('app_state').upsert({ user_id: user.id, data: S, updated_at: new Date().toISOString() });
  pendenteNuvem = !!error;
  return !error;
}
async function carregarNuvem() {
  const { data, error } = await sb.from('app_state').select('data').eq('user_id', user.id).maybeSingle();
  if (error) { toast('Sem conexão com a nuvem; usando a cópia do aparelho'); return; }
  if (data && data.data && Object.keys(data.data).length) {
    S = migrar(data.data);
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (_) {}
  } else {
    await enviarNuvem();
  }
}
function salvar() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Não consegui salvar os dados'); }
  if (sb && user) {
    pendenteNuvem = true;
    clearTimeout(tSync);
    tSync = setTimeout(async () => { if (!(await enviarNuvem())) toast('Sem conexão: guardei no aparelho e envio depois'); }, 500);
  }
}
window.addEventListener('online', () => { if (sb && user && pendenteNuvem) enviarNuvem(); });

/* ---------- interface básica ---------- */
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2200);
}
const mv = v => (S.ocultar ? 'R$ ••••' : R(v));            // valor respeitando o "olho"
const gearBtn = () => `<button class="gear" data-act="ir" data-tab="mais" aria-label="Mais"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg></button>`;
const heroSmall = (titulo, extra = '') => `<header class="hero small"><div class="row between"><h1>${esc(titulo)}</h1>${gearBtn()}</div>${extra}</header><!--w-->`;
function bar(pct) {
  const cls = pct > 100 ? 'over' : pct >= 80 ? 'warn' : '';
  return `<div class="bar ${cls}"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>`;
}
function mnav() {
  return `<div class="mnav"><button data-act="mes" data-n="-1" aria-label="Mês anterior">‹</button><b>${esc(mesNome(mes))}</b><button data-act="mes" data-n="1" aria-label="Próximo mês">›</button></div>`;
}
function catBubble(c) {
  const [i, , col] = catInfo(c);
  return `<span class="emoji" style="color:${col}">${ic(i)}</span>`;
}
function campo(label, name, o = {}) {
  const { type = 'text', value = '', ph = '', mode = '' } = o;
  return `<label>${label}<input name="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(ph)}" ${mode ? `inputmode="${mode}"` : ''} autocomplete="off"></label>`;
}
function selecao(label, name, opts, atual) {
  return `<label>${label}<select name="${name}">${opts.map(([v, t]) => `<option value="${esc(v)}" ${v === atual ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></label>`;
}
function sheet(titulo, corpo, aoSalvar, rotulo = 'Salvar') {
  const el = document.createElement('div');
  el.className = 'overlay';
  el.innerHTML = `<form class="sheet"><h2>${esc(titulo)}</h2>${corpo}<div class="row"><button type="button" class="btn ghost" data-x>Cancelar</button><button class="btn">${esc(rotulo)}</button></div></form>`;
  document.body.appendChild(el);
  el.addEventListener('click', e => { if (e.target === el || e.target.hasAttribute('data-x')) el.remove(); });
  el.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    if (aoSalvar(f) !== false) { el.remove(); salvar(); render(); }
  });
  const first = el.querySelector('input,select,textarea'); if (first && !first.hidden) first.focus();
  return el;
}
function confirmar(msg, rotulo = 'Excluir') {
  return new Promise(res => {
    const el = document.createElement('div');
    el.className = 'overlay';
    el.innerHTML = `<div class="sheet"><h2>${esc(msg)}</h2><div class="row"><button class="btn ghost" data-n>Cancelar</button><button class="btn danger-solid" data-y>${esc(rotulo)}</button></div></div>`;
    document.body.appendChild(el);
    el.addEventListener('click', e => {
      if (e.target === el || e.target.hasAttribute('data-n')) { el.remove(); res(false); }
      else if (e.target.hasAttribute('data-y')) { el.remove(); res(true); }
    });
  });
}
/* menu de ações (lista de botões) */
function menuAcoes(titulo, itens) {
  return new Promise(res => {
    const el = document.createElement('div');
    el.className = 'overlay';
    el.innerHTML = `<div class="sheet"><h2>${esc(titulo)}</h2>${itens.map(([k, t, cls]) => `<button class="btn ${cls || 'ghost'}" style="width:100%;margin-bottom:8px" data-k="${k}">${esc(t)}</button>`).join('')}<button class="btn ghost" style="width:100%" data-k="">Fechar</button></div>`;
    document.body.appendChild(el);
    el.addEventListener('click', e => {
      if (e.target === el) { el.remove(); res(''); return; }
      const b = e.target.closest('[data-k]'); if (b) { el.remove(); res(b.dataset.k); }
    });
  });
}
