'use strict';
const KEY = 'meudinheiro.v1';
const ICONS = {
  utensils: '<path d="M3 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6a2 2 0 0 0 2 2h3zm0 0v7"/>',
  cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 2h2l2.7 12.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L22 7H5.1"/>',
  car: '<path d="M19 17h2a1 1 0 0 0 1-1v-3a2 2 0 0 0-1.5-1.9L16 10l-2.2-2.3a2 2 0 0 0-1.8-.7H5a1.5 1.5 0 0 0-1.400.9L2.200 10.800A3.700 3.700 0 0 0 2 12v4a1 1 0 0 0 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  heart: '<path d="M19 14c1.500-1.500 3-3.200 3-5.500A5.500 5.500 0 0 0 16.500 3c-1.800 0-3 .5-4.500 2-1.500-1.500-2.700-2-4.500-2A5.500 5.500 0 0 0 2 8.500c0 2.300 1.500 4 3 5.500l7 7z"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  game: '<path d="M6 12h4M8 10v4"/><path d="M15 13h.01M18 11h.01"/><path d="M17.300 5H6.700a4 4 0 0 0-3.900 3.200L2 16a3 3 0 0 0 5.200 2l1.400-2h6.800l1.400 2A3 3 0 0 0 22 16l-.8-7.800A4 4 0 0 0 17.300 5z"/>',
  shirt: '<path d="M20.400 5.600 16 3a4 4 0 0 1-8 0L3.600 5.600a1 1 0 0 0-.5 1.200l1.300 3.700a1 1 0 0 0 1 .7H7v9a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-9h1.600a1 1 0 0 0 1-.7l1.300-3.700a1 1 0 0 0-.5-1.200z"/>',
  repeat: '<path d="M17 2l4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  tag: '<path d="M20.600 13.400 13.400 20.600a2 2 0 0 1-2.800 0L2 12V2h10l8.600 8.600a2 2 0 0 1 0 2.800z"/><circle cx="7" cy="7" r="1"/>',
  alert: '<path d="M10.300 3.900 1.800 18a2 2 0 0 0 1.700 3h17a2 2 0 0 0 1.700-3L13.700 3.900a2 2 0 0 0-3.400 0z"/><path d="M12 9v4M12 17h.01"/>',
  bulb: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.700c.7.6 1 1.400 1 2.300h6c0-.9.3-1.700 1-2.300A7 7 0 0 0 12 2z"/>',
  spark: '<path d="M12 3l1.900 5.100L19 10l-5.100 1.900L12 17l-1.900-5.100L5 10l5.100-1.900z"/><path d="M19 15l.7 1.800 1.800.7-1.800.7L19 20l-.7-1.800-1.800-.7 1.800-.7z"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
  arrowup: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  arrowdown: '<path d="M12 5v14M5 12l7 7 7-7"/>',
  trend: '<path d="M3 7l6 6 4-4 8 8"/><path d="M15 17h6v-6"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ''}</svg>`;
const CATS = [['utensils','Alimentação','#e8590c'],['cart','Mercado','#2f9e44'],['car','Transporte','#1c7ed6'],['home','Moradia','#7048e8'],['heart','Saúde','#e03131'],['book','Educação','#0c8599'],['game','Lazer','#d6336c'],['shirt','Roupas','#9c36b5'],['repeat','Assinaturas','#3b5bdb'],['bag','Bares e delivery','#f08c00'],['tag','Outros','#5c7080']];
const TIPOS = { necessario: 'Necessário', cortavel: 'Dá pra cortar', besteira: 'Besteira' };

const $ = s => document.querySelector(s);
const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const R = v => BRL.format(v || 0);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const p2 = n => String(n).padStart(2, '0');
const hoje = () => { const d = new Date(); return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`; };
const mesNome = m => { const [y, mo] = m.split('-'); return new Date(y, mo - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }); };
const mesMove = (m, n) => { const [y, mo] = m.split('-').map(Number); const d = new Date(y, mo - 1 + n, 1); return `${d.getFullYear()}-${p2(d.getMonth() + 1)}`; };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const num = v => {
  let s = String(v ?? '').trim().replace(/[^\d.,-]/g, '');
  if (s.includes(',') || /^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '').replace(',', '.');
  const n = parseFloat(s);
  return isFinite(n) ? n : 0;
};
const catBubble = c => {
  const [i, , col] = CATS.find(x => x[1] === c) || CATS[CATS.length - 1];
  return `<span class="emoji" style="color:${col};background:color-mix(in srgb,${col} 14%,var(--card))">${ic(i)}</span>`;
};
const soma = (arr, f) => arr.reduce((t, x) => t + f(x), 0);

/* ---------- estado ---------- */
const vazio = () => ({ renda: 0, saldoInicial: 0, bancos: [], entradas: [], gastos: [], orcamentos: {}, dividas: [], metas: [], contas: [] });
const FORMAS = { boleto: 'Boleto', pix: 'Pix', cartao: 'Cartão', debito: 'Débito automático', dinheiro: 'Dinheiro' };
function carregar() {
  try { return Object.assign(vazio(), JSON.parse(localStorage.getItem(KEY))); } catch (e) { return vazio(); }
}
let S = carregar();
if (!S.seeded) {
  if (!S.contas.some(c => c.nome === 'Carro')) {
    S.contas.push({ id: uid(), nome: 'Carro', valor: 1720, dia: 10, forma: 'boleto', categoria: 'Transporte', pagos: {} });
  }
  S.seeded = true;
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (_) {}
}
let tab = 'inicio';
let mes = hoje().slice(0, 7);

/* ---------- nuvem (Supabase) ---------- */
const sb = (window.supabase && window.SUPABASE_URL && window.SUPABASE_KEY)
  ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true } })
  : null;
let user = null, pendente = false, tSync = null;

async function enviarNuvem() {
  const { error } = await sb.from('app_state').upsert({ user_id: user.id, data: S, updated_at: new Date().toISOString() });
  pendente = !!error;
  return !error;
}
async function carregarNuvem() {
  const { data, error } = await sb.from('app_state').select('data').eq('user_id', user.id).maybeSingle();
  if (error) { toast('Sem conexão com a nuvem; usando a cópia do aparelho'); return; }
  if (data && data.data && Object.keys(data.data).length) {
    S = Object.assign(vazio(), data.data);
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (_) {}
  } else {
    await enviarNuvem();
  }
}

function salvar() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Não consegui salvar os dados'); }
  if (sb && user) {
    pendente = true;
    clearTimeout(tSync);
    tSync = setTimeout(async () => { if (!(await enviarNuvem())) toast('Sem conexão: guardei no aparelho e envio depois'); }, 500);
  }
}
window.addEventListener('online', () => { if (sb && user && pendente) enviarNuvem(); });
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && sb && user && !pendente) carregarNuvem().then(render);
});

function telaLogin(msg = '') {
  document.querySelector('.tabbar').hidden = true;
  $('#app').innerHTML = `<header class="hero"><div class="hi">Meu Dinheiro</div><div class="sub" style="text-transform:none">Entre uma única vez. Depois o iPhone lembra de você.</div></header>
    <div class="wrap"><div class="card login">
      <label>Usuário (ou e-mail)<input id="em" type="text" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false"></label>
      <label>Senha (mínimo 6 caracteres)<input id="pw" type="password" autocomplete="current-password"></label>
      <div id="lmsg" class="neg" style="min-height:22px;margin-top:8px">${esc(msg)}</div>
      <div class="row" style="margin-top:8px"><button class="btn grow" data-login="in">Entrar</button><button class="btn ghost grow" data-login="up">Criar conta</button></div>
      <div class="mute" style="margin-top:12px">Primeira vez? Toque em "Criar conta".</div>
    </div></div>`;
}
async function entrar(tipo) {
  let email = $('#em').value.trim().toLowerCase();
  const senha = $('#pw').value, out = $('#lmsg');
  if (!email || senha.length < 6) { out.textContent = 'Informe o usuário e uma senha de pelo menos 6 caracteres.'; return; }
  if (!email.includes('@')) email = `${email.replace(/[^a-z0-9._-]/g, '')}@meudinheiro.app`;
  out.textContent = 'Aguarde...';
  const { data, error } = tipo === 'up' ? await sb.auth.signUp({ email, password: senha }) : await sb.auth.signInWithPassword({ email, password: senha });
  if (error) { out.textContent = /invalid login/i.test(error.message) ? 'E-mail ou senha incorretos.' : error.message; return; }
  if (!data.session) { out.textContent = 'Conta criada. Confirme o e-mail que o Supabase enviou e depois toque em Entrar.'; return; }
  user = data.user;
  document.querySelector('.tabbar').hidden = false;
  render(); await carregarNuvem(); render();
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-login]'); if (b && sb) entrar(b.dataset.login);
});
async function iniciar() {
  if (!sb) { render(); return; }
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { telaLogin(); return; }
  user = session.user;
  render(); await carregarNuvem(); render();
}
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2200);
}

/* ---------- helpers de UI ---------- */
const gearBtn = () => `<button class="gear" data-act="ir" data-tab="mais" aria-label="Configurações"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg></button>`;
const heroSmall = (titulo, extra = '') => `<header class="hero small"><div class="row between"><h1>${esc(titulo)}</h1>${gearBtn()}</div>${extra}</header><!--w-->`;
function bar(pct, extra = '') {
  const cls = pct > 100 ? 'over' : pct >= 80 ? 'warn' : '';
  return `<div class="bar ${cls} ${extra}"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>`;
}
function mnav() {
  return `<div class="mnav"><button data-act="mes" data-n="-1" aria-label="Mês anterior">‹</button><b>${esc(mesNome(mes))}</b><button data-act="mes" data-n="1" aria-label="Próximo mês">›</button></div>`;
}
function campo(label, name, o = {}) {
  const { type = 'text', value = '', ph = '', mode = '' } = o;
  return `<label>${label}<input name="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(ph)}" ${mode ? `inputmode="${mode}"` : ''} autocomplete="off"></label>`.replace('<label>', '<label>');
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
  const first = el.querySelector('input,select,textarea'); if (first) first.focus();
  return el;
}

/* ---------- IA: voz/texto + foto de recibo ---------- */
const KEY_API = 'meudinheiro.apikey';
const chaveIA = () => { try { return localStorage.getItem(KEY_API) || ''; } catch (e) { return ''; } };
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

function reduzirImagem(file, max = 1400) {
  return new Promise((ok, erro) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      ok(c.toDataURL('image/jpeg', 0.82).split(',')[1]);
    };
    img.onerror = () => erro(new Error('Não consegui abrir a imagem'));
    img.src = url;
  });
}

async function analisarIA(texto, imgB64) {
  const key = chaveIA();
  if (!key) throw new Error('Cadastre sua chave da Anthropic em Mais › IA.');
  const content = [];
  if (imgB64) content.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imgB64 } });
  content.push({ type: 'text', text:
`Você ajuda a registrar gastos pessoais no Brasil. Hoje é ${hoje()}.
${imgB64 ? 'Há a foto de um recibo/nota/comprovante. Leia o valor total, o estabelecimento e a data.' : ''}
O usuário explicou: "${texto || '(nada)'}"
Categorias válidas: ${CATS.map(c => c[1]).join(', ')}.
Classifique "tipo": "necessario" (contas, comida básica, saúde, transporte, essenciais), "cortavel" (conforto/conveniência que dá para reduzir) ou "besteira" (compra por impulso ou supérfluo). Use o que o usuário disse sobre o motivo para decidir.
Responda SOMENTE com JSON, sem texto extra:
{"valor": número em reais, "descricao": "curta", "categoria": "uma das válidas", "tipo": "necessario|cortavel|besteira", "data": "YYYY-MM-DD", "observacao": "frase curta explicando a classificação"}
Se não souber o valor, use 0.` });
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
    body: JSON.stringify({ model: 'claude-sonnet-5-5', max_tokens: 400, messages: [{ role: 'user', content }] })
  }).catch(() => { throw new Error('Não consegui falar com a IA (sem internet ou bloqueada neste ambiente).'); });
  if (!r.ok) throw new Error(r.status === 401 ? 'Chave inválida.' : `Erro da IA (${r.status}).`);
  const data = await r.json();
  const txt = (data.content || []).map(b => b.text || '').join('');
  const m = txt.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('A IA não retornou um resultado legível.');
  return JSON.parse(m[0]);
}

function ligarIA(el) {
  const f = el.querySelector('form'), st = el.querySelector('[data-ia=status]');
  const txt = f.elements['_texto'];
  let foto = null, rec = null;
  const msg = t => st.textContent = t;
  const micBtn = el.querySelector('[data-ia=mic]');
  if (!SR) micBtn.hidden = true;
  micBtn.addEventListener('click', () => {
    if (rec) { rec.stop(); return; }
    rec = new SR(); rec.lang = 'pt-BR'; rec.interimResults = false; rec.continuous = true;
    rec.onresult = e => { for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) txt.value += (txt.value ? ' ' : '') + e.results[i][0].transcript.trim(); };
    rec.onend = () => { rec = null; micBtn.innerHTML = ic('mic') + 'Falar'; };
    rec.onerror = () => msg('Microfone indisponível — use o 🎤 do teclado do iPhone.');
    try { rec.start(); micBtn.innerHTML = ic('stop') + 'Parar'; msg('Ouvindo...'); } catch (e) { rec = null; }
  });
  el.querySelector('[data-ia=foto]').addEventListener('change', async e => {
    const file = e.target.files[0]; if (!file) return;
    try { foto = await reduzirImagem(file); msg('Recibo anexado.'); } catch (err) { foto = null; msg(err.message); }
  });
  el.querySelector('[data-ia=go]').addEventListener('click', async ev => {
    if (rec) rec.stop();
    if (!txt.value.trim() && !foto) { msg('Fale/escreva algo ou fotografe o recibo.'); return; }
    ev.target.disabled = true; msg('Analisando...');
    try {
      const r = await analisarIA(txt.value.trim(), foto);
      const set = (n, v) => { if (v !== undefined && v !== null && v !== '') f.elements[n].value = v; };
      if (r.valor > 0) set('valor', String(r.valor).replace('.', ','));
      set('descricao', r.descricao);
      if (CATS.some(c => c[1] === r.categoria)) set('categoria', r.categoria);
      if (TIPOS[r.tipo]) set('tipo', r.tipo);
      if (/^\d{4}-\d{2}-\d{2}$/.test(r.data || '')) set('data', r.data);
      msg('Preenchi abaixo' + (r.observacao ? ` — ${r.observacao}` : '') + '. Confira e salve.');
    } catch (err) { msg(err.message || 'Falhou. Tente de novo.'); }
    ev.target.disabled = false;
  });
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

/* ---------- cálculos ---------- */
const gastosDoMes = () => S.gastos.filter(g => g.data.startsWith(mes));
const restante = d => Math.max(0, d.total - soma(d.pagamentos || [], p => p.valor));
const dividasAbertas = () => S.dividas.filter(d => restante(d) > 0.004).sort((a, b) => restante(a) - restante(b));

// Saldo = dinheiro informado + entradas - todos os gastos lançados (excluir um gasto devolve o valor).
const COR_BANCO = ['#cc092f', '#8a05be', '#ec7000', '#0b6bcb', '#1a8f5c', '#c2185b'];
const temBanco = id => !!id && S.bancos.some(b => b.id === id);
const doBucket = id => m => (id ? m.banco === id : !temBanco(m.banco));
function saldoDe(id) {
  const base = id ? ((S.bancos.find(b => b.id === id) || {}).saldoInicial || 0) : (S.saldoInicial || 0);
  const f = doBucket(id);
  return base + soma((S.entradas || []).filter(f), e => e.valor) - soma(S.gastos.filter(f), g => g.valor);
}
const saldoAtual = () => saldoDe(null) + soma(S.bancos, b => saldoDe(b.id));
const fmtIn = v => String(Math.round(v * 100) / 100).replace('.', ',');
const opcoesBanco = () => [['', 'Sem conta (dinheiro)'], ...S.bancos.map(b => [b.id, b.nome])];
const bancoTxt = id => { const b = S.bancos.find(x => x.id === id); return b ? ` · ${esc(b.nome)}` : ''; };
function formSaldo(bancoId = '') {
  const el = sheet('Ajustar saldo',
    (S.bancos.length ? selecao('Conta', 'banco', opcoesBanco(), bancoId) : '') +
    campo('Quanto tem agora (R$)', 'valor', { mode: 'decimal', value: fmtIn(saldoDe(bancoId || null)) }),
    f => {
      const id = f.banco || '';
      const fn = doBucket(id || null);
      const mov = soma((S.entradas || []).filter(fn), e => e.valor) - soma(S.gastos.filter(fn), g => g.valor);
      const base = num(f.valor) - mov;
      if (id && temBanco(id)) S.bancos.find(b => b.id === id).saldoInicial = base; else S.saldoInicial = base;
      toast('Saldo ajustado');
    });
  const sel = el.querySelector('[name=banco]');
  if (sel) sel.addEventListener('change', () => { el.querySelector('[name=valor]').value = fmtIn(saldoDe(sel.value || null)); });
}
function formBanco(id) {
  const b = id ? S.bancos.find(x => x.id === id) : null;
  sheet(b ? 'Editar conta' : 'Nova conta bancária',
    campo('Nome', 'nome', { value: b ? b.nome : '', ph: 'Ex.: Bradesco, Nubank, Carteira' }) +
    campo('Saldo atual (R$)', 'valor', { mode: 'decimal', value: b ? fmtIn(saldoDe(b.id)) : '', ph: '0,00' }),
    f => {
      if (!f.nome.trim()) { toast('Informe o nome'); return false; }
      if (b) { const mov = saldoDe(b.id) - b.saldoInicial; b.nome = f.nome.trim(); b.saldoInicial = num(f.valor) - mov; }
      else S.bancos.push({ id: uid(), nome: f.nome.trim(), saldoInicial: num(f.valor) });
      toast('Conta salva');
    });
}
function formEntrada() {
  sheet('Entrou dinheiro',
    campo('Valor (R$)', 'valor', { mode: 'decimal', ph: '0,00' }) +
    campo('Descrição', 'descricao', { ph: 'Ex.: salário, pix recebido...' }) +
    (S.bancos.length ? selecao('Entrou em qual conta?', 'banco', opcoesBanco(), S.bancos[0].id) : '') +
    campo('Data', 'data', { type: 'date', value: hoje() }), f => {
    const v = num(f.valor);
    if (v <= 0) { toast('Informe um valor'); return false; }
    S.entradas = S.entradas || [];
    S.entradas.push({ id: uid(), valor: v, descricao: f.descricao.trim() || 'Entrada', banco: f.banco || '', data: f.data || hoje() });
    toast(`+${R(v)} no saldo`);
  }, 'Adicionar');
}
const paga = c => !!(c.pagos && c.pagos[mes]);
const ehFixo = g => g.custo === 'fixo' || !!g.conta;
function contaStatus(c) {
  if (paga(c)) return { t: 'Paga', cls: 'pos' };
  const [y, m] = mes.split('-').map(Number);
  const dia = Math.min(c.dia, new Date(y, m, 0).getDate());
  const venc = `${mes}-${p2(dia)}`, h = hoje();
  if (venc < h) return { t: `Atrasada (venceu dia ${p2(dia)})`, cls: 'neg' };
  if (venc === h) return { t: 'Vence hoje', cls: 'neg' };
  const dias = Math.round((new Date(venc) - new Date(h)) / 864e5);
  return dias <= 5 ? { t: `Vence em ${dias} dia(s)`, cls: 'neg' } : { t: `Vence dia ${p2(dia)}`, cls: 'mute' };
}

/* ---------- telas ---------- */
function vInicio() {
  const g = gastosDoMes();
  const total = soma(g, x => x.valor);
  const bes = soma(g.filter(x => x.tipo === 'besteira'), x => x.valor);
  const cor = soma(g.filter(x => x.tipo === 'cortavel'), x => x.valor);
  const saldo = saldoAtual();
  const fixo = soma(g.filter(ehFixo), x => x.valor), variavel = total - fixo;
  const previstoFixo = soma(S.contas.filter(c => !paga(c)), c => c.valor);
  const abertas = dividasAbertas();
  const totalDiv = soma(abertas, restante);

  const rec = soma((S.entradas || []).filter(e => e.data.startsWith(mes)), e => e.valor);
  const pc = S.contas.filter(c => !paga(c)).sort((a, b) => a.dia - b.dia);
  const atras = pc.filter(c => contaStatus(c).t.startsWith('Atrasada'));
  const media = S.metas.length ? Math.round(soma(S.metas, m => m.alvo ? m.atual / m.alvo * 100 : 0) / S.metas.length) : 0;

  let h = `<header class="hero center">
    <div class="row between"><span style="width:40px"></span><div class="mcenter"><button data-act="mes" data-n="-1" aria-label="Mês anterior">‹</button><b>${esc(mesNome(mes))}</b><button data-act="mes" data-n="1" aria-label="Próximo mês">›</button></div>${gearBtn()}</div>
    <div class="hl">Saldo atual</div>
    <div class="hbig ${saldo < 0 ? 'neg' : ''}">${R(saldo)}</div>
    <div class="rd">
      <div class="row" style="gap:10px"><span class="circ up">${ic('arrowup')}</span><div><div class="hl2">Receitas</div><b class="rec">${R(rec)}</b></div></div>
      <div class="row" style="gap:10px"><span class="circ down">${ic('arrowdown')}</span><div><div class="hl2">Despesas</div><b class="des">${R(total)}</b></div></div>
    </div>
    <div class="row" style="margin-top:12px;justify-content:center"><button class="hbtn" data-act="entrada">+ Entrou dinheiro</button><button class="hbtn" data-act="ajustarSaldo">Ajustar saldo</button></div>
  </header><!--w-->`;

  h += `<div class="sec">Pendências e alertas</div><div class="hscroll">
    <div class="pcard" data-act="ir" data-tab="mensal"><div class="row between"><span class="pico">${ic('arrowdown')}</span><span class="badge ${pc.length ? 'bad' : ''}">${pc.length}</span></div><div class="mute">Contas a pagar</div><b>${R(previstoFixo)}</b></div>
    <div class="pcard" data-act="ir" data-tab="mensal"><div class="row between"><span class="pico">${ic('alert')}</span><span class="badge ${atras.length ? 'bad' : ''}">${atras.length}</span></div><div class="mute">Atrasadas</div><b class="${atras.length ? 'neg' : ''}">${R(soma(atras, c => c.valor))}</b></div>
    <div class="pcard" data-act="ir" data-tab="dividas"><div class="row between"><span class="pico">${ic('trend')}</span><span class="badge">${abertas.length}</span></div><div class="mute">Dívidas em aberto</div><b>${R(totalDiv)}</b></div>
    <div class="pcard" data-act="ir" data-tab="metas"><div class="row between"><span class="pico">${ic('target')}</span><span class="badge">${S.metas.length}</span></div><div class="mute">Metas</div><b>${S.metas.length ? media + '%' : '—'}</b></div>
  </div>`;

  const sem = saldoDe(null);
  h += `<div class="card"><div class="row between"><h2 style="margin:0">Contas</h2><button class="btn small" data-act="novoBanco">Adicionar conta</button></div>`;
  if (!S.bancos.length) h += `<div class="mute" style="margin-top:6px">Cadastre seus bancos para ver o saldo de cada um. Tudo manual, sem vínculo automático.</div>`;
  S.bancos.forEach((b, i) => {
    const v = saldoDe(b.id), cor = COR_BANCO[i % COR_BANCO.length];
    h += `<div class="item" data-act="editBanco" data-id="${b.id}"><span class="emoji" style="color:${cor};background:color-mix(in srgb,${cor} 14%,var(--card))"><b>${esc(b.nome.slice(0, 1).toUpperCase())}</b></span><div class="grow"><b>${esc(b.nome)}</b></div><b class="${v < 0 ? 'neg' : 'pos'}">${R(v)}</b></div>`;
  });
  if (S.bancos.length && Math.abs(sem) > 0.004) h += `<div class="item"><span class="emoji">${ic('tag')}</span><div class="grow"><b>Sem conta / dinheiro</b></div><b class="${sem < 0 ? 'neg' : 'pos'}">${R(sem)}</b></div>`;
  h += `<div class="row between" style="padding-top:8px;border-top:1px solid var(--line)"><span class="mute">Total</span><b>${R(saldo)}</b></div></div>`;

  h += `<div class="card" data-act="ir" data-tab="mensal"><div class="row between"><h2 style="margin:0">Próximos vencimentos</h2><span class="mute">ver todas ›</span></div>`;
  if (!pc.length) h += `<div class="mute" style="margin-top:6px">${S.contas.length ? 'Tudo pago neste mês.' : 'Nenhuma conta fixa cadastrada.'}</div>`;
  pc.slice(0, 4).forEach(c => {
    const st = contaStatus(c);
    h += `<div class="item"><div class="grow"><b>${esc(c.nome)}</b><div class="mute" style="font-size:12px">dia ${p2(c.dia)} · ${esc(FORMAS[c.forma] || '')}</div></div><div style="text-align:right"><b>${R(c.valor)}</b><div class="${st.cls}" style="font-size:12px">${esc(st.t)}</div></div></div>`;
  });
  h += `</div>`;

  h += `<div class="card"><div class="row between"><h2 style="margin:0">Fixo × variável</h2><span class="mute">${total > 0 ? Math.round(fixo / total * 100) : 0}% fixo</span></div>
    <div class="grid2" style="margin:8px 0 0"><div><div class="mute" style="font-size:12px">Fixo</div><b class="neg">−${R(fixo)}</b></div><div><div class="mute" style="font-size:12px">Variável</div><b class="neg">−${R(variavel)}</b></div></div>${total > 0 ? bar(fixo / total * 100) : ''}</div>`;

  if (bes + cor > 0) {
    let msg = `<b>${R(bes)}</b> em besteira e <b>${R(cor)}</b> que dava pra cortar.`;
    if (abertas.length && bes > 0) msg += ` A besteira pagaria <b>${Math.min(100, Math.round(bes / restante(abertas[0]) * 100))}%</b> da dívida “${esc(abertas[0].nome)}”.`;
    h += `<div class="card tip"><div class="row" style="gap:8px"><span class="neg">${ic('alert')}</span><div style="font-size:13px">${msg}</div></div></div>`;
  }

  const porCat = {};
  g.forEach(x => porCat[x.categoria] = (porCat[x.categoria] || 0) + x.valor);
  const cats = Object.entries(porCat).sort((a, b) => b[1] - a[1]);
  h += `<div class="card"><h2>Por categoria</h2>`;
  if (!cats.length) h += `<div class="mute">Nenhum gasto neste mês.</div>`;
  cats.slice(0, 5).forEach(([c, v]) => {
    const lim = S.orcamentos[c] || 0;
    h += `<div class="item" style="flex-wrap:wrap"><span class="row grow" style="gap:10px">${catBubble(c)}${esc(c)}</span><span style="text-align:right;white-space:nowrap"><b>${R(v)}</b>${lim ? `<span class="mute" style="font-size:12px"> / ${R(lim)}</span>` : ''}</span>${lim ? `<div style="width:100%">${bar(v / lim * 100)}</div>` : ''}</div>`;
  });
  if (cats.length > 5) h += `<div class="mute" style="font-size:12px;text-align:center" data-act="ir" data-tab="mensal">+${cats.length - 5} categorias em Planejamento ›</div>`;
  h += `</div>`;
  return h;
}

function formGasto() {
  const el = sheet('Novo gasto',
    `<div class="ia"><div class="mute row" style="gap:6px">${ic('spark')}Conte o gasto (voz ou texto) e/ou fotografe o recibo</div>
      <textarea name="_texto" rows="2" placeholder="Ex.: gastei 45 no almoço com o pessoal, foi mais por impulso"></textarea>
      <div class="row" style="margin-top:8px"><button type="button" class="btn small ghost" data-ia="mic">${ic('mic')}Falar</button><label class="btn small ghost" style="margin:0">${ic('camera')}Recibo<input type="file" accept="image/*" data-ia="foto" hidden></label><button type="button" class="btn small" data-ia="go">Analisar</button></div>
      <div class="mute" data-ia="status" style="margin-top:6px"></div></div>` +
    campo('Valor (R$)', 'valor', { mode: 'decimal', ph: '0,00' }) +
    campo('Descrição', 'descricao', { ph: 'Ex.: iFood, Uber, mercado...' }) +
    selecao('Categoria', 'categoria', CATS.map(c => [c[1], c[1]]), 'Alimentação') +
    selecao('Foi...', 'tipo', Object.entries(TIPOS), 'necessario') +
    selecao('Custo', 'custo', [['variavel', 'Variável (muda todo mês)'], ['fixo', 'Fixo (igual todo mês)']], 'variavel') +
    (S.bancos.length ? selecao('Saiu de qual conta?', 'banco', opcoesBanco(), S.bancos[0].id) : '') +
    campo('Data', 'data', { type: 'date', value: hoje() }),
    f => {
      const valor = num(f.valor);
      if (valor <= 0) { toast('Informe um valor'); return false; }
      S.gastos.push({ id: uid(), valor, descricao: f.descricao.trim() || f.categoria, categoria: f.categoria, tipo: f.tipo, custo: f.custo || 'variavel', banco: f.banco || '', data: f.data || hoje() });
      if (!f.data || !f.data.startsWith(mes)) mes = (f.data || hoje()).slice(0, 7);
      toast('Gasto salvo');
    });
  ligarIA(el);
}
function vGastos() {
  const g = gastosDoMes();
  const ent = (S.entradas || []).filter(e => e.data.startsWith(mes));
  const itens = [...g.map(x => ({ ...x, k: 'g' })), ...ent.map(e => ({ ...e, k: 'e' }))].sort((a, b) => b.data.localeCompare(a.data));
  let h = heroSmall('Transações', mnav());
  const tFixo = soma(g.filter(ehFixo), x => x.valor), tTotal = soma(g, x => x.valor), tRec = soma(ent, e => e.valor);
  h += `<div class="card"><div class="row between"><span class="mute">Receitas</span><b class="pos">+${R(tRec)}</b></div>
    <div class="row between" style="margin-top:6px"><span class="mute">Despesas</span><b class="neg">−${R(tTotal)}</b></div>
    <div class="row between" style="margin-top:6px"><span class="mute">Custo fixo</span><span class="neg">−${R(tFixo)}</span></div>
    <div class="row between" style="margin-top:6px"><span class="mute">Custo variável</span><span class="neg">−${R(tTotal - tFixo)}</span></div></div>`;
  if (!itens.length) h += `<div class="empty">Nada lançado neste mês.</div>`;
  let dia = '', aberto = false;
  itens.forEach(x => {
    if (x.data !== dia) {
      if (aberto) h += `</div>`;
      dia = x.data; aberto = true;
      h += `<div class="day">${x.data.slice(8)}/${x.data.slice(5, 7)}</div><div class="card" style="padding:4px 14px">`;
    }
    if (x.k === 'e') {
      h += `<div class="item" data-act="delEntrada" data-id="${x.id}"><span class="emoji" style="color:#22a35a;background:color-mix(in srgb,#22a35a 14%,var(--card))">${ic('arrowup')}</span>
        <div class="grow"><div>${esc(x.descricao)}</div><div class="mute">Receita${bancoTxt(x.banco)}</div></div><b class="pos">+${R(x.valor)}</b></div>`;
    } else {
      h += `<div class="item" data-act="delGasto" data-id="${x.id}">${catBubble(x.categoria)}
        <div class="grow"><div>${esc(x.descricao)}</div><div class="mute">${esc(x.categoria)}${bancoTxt(x.banco)}<span class="chip ${x.tipo}">${TIPOS[x.tipo] || ''}</span>${ehFixo(x) ? '<span class="chip">Fixo</span>' : ''}</div></div>
        <b class="neg">−${R(x.valor)}</b></div>`;
    }
  });
  if (aberto) h += `</div>`;
  h += `<div class="mute" style="text-align:center">Toque em um lançamento para excluir.</div>`;
  return h;
}

function formConta() {
  sheet('Nova conta fixa',
    campo('Nome', 'nome', { ph: 'Ex.: Carro' }) +
    campo('Valor mensal (R$)', 'valor', { mode: 'decimal', ph: '0,00' }) +
    campo('Dia do vencimento (1 a 31)', 'dia', { mode: 'numeric', ph: '10' }) +
    selecao('Forma de pagamento', 'forma', Object.entries(FORMAS), 'boleto') +
    selecao('Categoria', 'categoria', CATS.map(c => [c[1], c[1]]), 'Transporte') +
    (S.bancos.length ? selecao('Pagar com', 'banco', opcoesBanco(), S.bancos[0].id) : ''),
    f => {
      const valor = num(f.valor), dia = Math.round(num(f.dia));
      if (!f.nome.trim() || valor <= 0 || dia < 1 || dia > 31) { toast('Confira nome, valor e dia (1 a 31)'); return false; }
      S.contas.push({ id: uid(), nome: f.nome.trim(), valor, dia, forma: f.forma, categoria: f.categoria, banco: f.banco || '', pagos: {} });
    });
}
function formDivida() {
  sheet('Nova dívida',
    campo('Nome', 'nome', { ph: 'Ex.: Cartão Nubank' }) +
    campo('Credor (opcional)', 'credor', { ph: 'Banco, loja, pessoa...' }) +
    campo('Valor que falta pagar (R$)', 'total', { mode: 'decimal', ph: '0,00' }) +
    campo('Parcela mensal (R$)', 'parcela', { mode: 'decimal', ph: '0,00' }) +
    campo('Juros ao mês % (opcional)', 'juros', { mode: 'decimal', ph: '0' }),
    f => {
      const total = num(f.total);
      if (!f.nome.trim() || total <= 0) { toast('Informe nome e valor'); return false; }
      S.dividas.push({ id: uid(), nome: f.nome.trim(), credor: f.credor.trim(), total, parcela: num(f.parcela), juros: num(f.juros), pagamentos: [] });
    });
}
function formPagamento(id) {
  const d = S.dividas.find(x => x.id === id); if (!d) return;
  sheet(`Pagamento — ${d.nome}`,
    campo('Valor pago (R$)', 'valor', { mode: 'decimal', value: d.parcela ? String(d.parcela).replace('.', ',') : '' }) +
    campo('Data', 'data', { type: 'date', value: hoje() }),
    f => {
      const v = num(f.valor);
      if (v <= 0) { toast('Informe um valor'); return false; }
      d.pagamentos.push({ data: f.data || hoje(), valor: v });
      toast(restante(d) <= 0.004 ? 'Dívida quitada! Parabéns!' : 'Pagamento registrado');
    });
}

function blocoContas() {
  const pend = S.contas.filter(c => !paga(c));
  let h = '';
  h += `<div class="card"><div class="row between"><h2 style="margin:0">Contas fixas do mês</h2><button class="btn small" data-act="novaConta">Nova conta</button></div>`;
  if (!S.contas.length) h += `<div class="empty">Cadastre contas que se repetem todo mês (carro, aluguel, internet...).</div>`;
  else h += `<div class="mute" style="margin-top:6px">A pagar: <b>${R(soma(pend, c => c.valor))}</b> em ${pend.length} conta(s)</div>`;
  [...S.contas].sort((a, b) => a.dia - b.dia).forEach(c => {
    const st = contaStatus(c);
    h += `<div class="item" style="flex-wrap:wrap"><div class="grow"><b>${esc(c.nome)}</b><div class="mute">${esc(FORMAS[c.forma] || '')} · todo dia ${p2(c.dia)}</div></div>
      <div style="text-align:right"><b>${R(c.valor)}</b><div class="${st.cls}" style="font-size:12px">${esc(st.t)}</div></div>
      <div class="row" style="width:100%">${paga(c) ? `<button class="btn small ghost" data-act="desfazerConta" data-id="${c.id}">Desfazer pagamento</button>` : `<button class="btn small" data-act="pagarConta" data-id="${c.id}">Marcar como paga</button>`}<button class="btn small danger" data-act="delConta" data-id="${c.id}">Excluir</button></div></div>`;
  });
  h += `</div>`;
  return h;
}

function vMensal() {
  const g = gastosDoMes();
  const porCat = {};
  g.forEach(x => porCat[x.categoria] = (porCat[x.categoria] || 0) + x.valor);
  const pend = S.contas.filter(c => !paga(c));
  let h = heroSmall('Mensal', mnav());
  h += blocoContas();

  const linhas = CATS.map(([, nome]) => ({
    nome, gasto: porCat[nome] || 0, lim: S.orcamentos[nome] || 0,
    contas: S.contas.filter(c => (c.categoria || 'Outros') === nome).sort((a, b) => a.dia - b.dia)
  })).filter(l => l.gasto > 0 || l.lim > 0 || l.contas.length);

  h += `<div class="card"><h2>Categorias do mês</h2>`;
  if (!linhas.length) h += `<div class="empty">Sem movimento neste mês.<br>Lance gastos ou cadastre contas fixas.</div>`;
  linhas.forEach(l => {
    h += `<div style="padding:10px 0;border-top:1px solid var(--line)"><div class="row between"><span class="row grow" style="gap:10px">${catBubble(l.nome)}${esc(l.nome)}</span>
      <span style="text-align:right;white-space:nowrap"><b class="neg">−${R(l.gasto)}</b>${l.lim ? `<div class="mute" style="font-size:12px">limite ${R(l.lim)}</div>` : ''}</span></div>
      ${l.lim ? bar(l.gasto / l.lim * 100) : ''}`;
    l.contas.forEach(c => {
      const st = contaStatus(c);
      h += `<div class="row between mute" style="font-size:13px;margin-top:6px"><span>${esc(c.nome)} · sai dia ${p2(c.dia)} · ${esc(FORMAS[c.forma] || '')}</span><span class="${st.cls}">${esc(st.t)}</span></div>`;
    });
    h += `</div>`;
  });
  h += `</div>`;
  return h;
}

function vDividas() {
  const todas = [...S.dividas].sort((a, b) => restante(a) - restante(b));
  const abertas = dividasAbertas();
  let h = heroSmall('Dívidas');
  h += `<div class="card"><div class="mute">Total a pagar</div><div class="big">${R(soma(abertas, restante))}</div>
    <div class="mute">Parcelas somam ${R(soma(abertas, d => d.parcela))} por mês</div></div>`;
  if (abertas.length > 1) {
    const caro = [...abertas].sort((a, b) => (b.juros || 0) - (a.juros || 0))[0];
    h += `<div class="card tip"><h2 class="row" style="gap:8px">${ic('bulb')}Ordem de ataque</h2><div>Quite primeiro <b>${esc(abertas[0].nome)}</b> (menor saldo, ${R(restante(abertas[0]))}) — cada dívida eliminada libera a parcela para a próxima.${caro.juros > 0 ? ` Se preferir economizar juros, comece por <b>${esc(caro.nome)}</b> (${String(caro.juros).replace('.', ',')}% ao mês).` : ''}</div></div>`;
  }
  if (!todas.length) h += `<div class="empty">Nenhuma dívida cadastrada.<br>Cadastre para acompanhar o quanto falta.</div>`;
  todas.forEach(d => {
    const rest = restante(d), pago = d.total - rest, quit = rest <= 0.004;
    h += `<div class="card"><div class="row between"><div class="grow"><b>${esc(d.nome)}</b>${d.credor ? `<div class="mute">${esc(d.credor)}</div>` : ''}</div>
      <div style="text-align:right"><b class="${quit ? 'pos' : ''}">${quit ? 'Quitada ✓' : R(rest)}</b></div></div>
      ${bar(d.total ? pago / d.total * 100 : 0)}
      <div class="mute">Pago ${R(pago)} de ${R(d.total)}${d.parcela ? ` · parcela ${R(d.parcela)}` : ''}${d.juros ? ` · ${String(d.juros).replace('.', ',')}% a.m.` : ''}</div>
      <div class="row" style="margin-top:10px">${quit ? '' : `<button class="btn small" data-act="pagar" data-id="${d.id}">Registrar pagamento</button>`}<button class="btn small danger" data-act="delDivida" data-id="${d.id}">Excluir</button></div></div>`;
  });
  return h;
}

function formMeta() {
  sheet('Nova meta',
    campo('Nome', 'nome', { ph: 'Ex.: Reserva de emergência' }) +
    campo('Quanto quer juntar (R$)', 'alvo', { mode: 'decimal', ph: '0,00' }) +
    campo('Já tenho (R$)', 'atual', { mode: 'decimal', ph: '0,00' }) +
    campo('Prazo (opcional)', 'prazo', { type: 'date' }),
    f => {
      const alvo = num(f.alvo);
      if (!f.nome.trim() || alvo <= 0) { toast('Informe nome e valor'); return false; }
      S.metas.push({ id: uid(), nome: f.nome.trim(), alvo, atual: num(f.atual), prazo: f.prazo || '' });
    });
}
function formAporte(id) {
  const m = S.metas.find(x => x.id === id); if (!m) return;
  sheet(`Guardar — ${m.nome}`, campo('Valor (R$)', 'valor', { mode: 'decimal', ph: '0,00' }), f => {
    const v = num(f.valor);
    if (v <= 0) { toast('Informe um valor'); return false; }
    m.atual += v;
    toast(m.atual >= m.alvo ? 'Meta batida! Parabéns!' : 'Guardado!');
  });
}
function vMetas() {
  let h = heroSmall('Metas');
  if (!S.metas.length) h += `<div class="empty">Crie uma meta: reserva de emergência, viagem, entrada de algo...</div>`;
  S.metas.forEach(m => {
    const p = m.alvo ? m.atual / m.alvo * 100 : 0;
    let dica = '';
    if (m.prazo && m.atual < m.alvo) {
      const meses = Math.max(1, Math.ceil((new Date(m.prazo) - new Date()) / (30.44 * 864e5)));
      dica = ` · guardar ${R((m.alvo - m.atual) / meses)}/mês até ${m.prazo.slice(8)}/${m.prazo.slice(5, 7)}/${m.prazo.slice(0, 4)}`;
    }
    h += `<div class="card"><div class="row between"><b>${esc(m.nome)}</b><span class="mute">${Math.round(p)}%</span></div>${bar(p)}
      <div class="mute">${R(m.atual)} de ${R(m.alvo)}${dica}</div>
      <div class="row" style="margin-top:10px"><button class="btn small" data-act="aporte" data-id="${m.id}">Guardar dinheiro</button><button class="btn small danger" data-act="delMeta" data-id="${m.id}">Excluir</button></div></div>`;
  });
  return h;
}

function vMais() {
  let h = heroSmall('Mais');
  h += `<div class="card" style="padding:2px 12px">
    <div class="item" data-act="ir" data-tab="dividas"><span class="emoji" style="color:var(--accent);background:color-mix(in srgb,var(--accent) 14%,var(--card))">${ic('trend')}</span><div class="grow"><b>Dívidas</b><div class="mute" style="font-size:12px">Quanto falta e ordem de quitação</div></div><span class="mute">›</span></div>
    <div class="item" data-act="ir" data-tab="metas"><span class="emoji" style="color:var(--accent);background:color-mix(in srgb,var(--accent) 14%,var(--card))">${ic('target')}</span><div class="grow"><b>Metas</b><div class="mute" style="font-size:12px">Quanto já juntou e quanto falta</div></div><span class="mute">›</span></div>
  </div>`;
  h += `<div class="card"><div class="row between"><h2 style="margin:0">Contas bancárias</h2><button class="btn small" data-act="novoBanco">Adicionar</button></div>` +
    (S.bancos.length ? S.bancos.map(b => `<div class="item"><div class="grow"><b>${esc(b.nome)}</b><div class="mute" style="font-size:12px">${R(saldoDe(b.id))}</div></div><button class="btn small ghost" data-act="editBanco" data-id="${b.id}">Editar</button><button class="btn small danger" data-act="delBanco" data-id="${b.id}">Excluir</button></div>`).join('')
      : `<div class="mute" style="margin-top:6px">Nenhuma conta cadastrada. Os saldos são lançados à mão, sem vínculo com o banco.</div>`) + `</div>`;
  h += `<div class="card"><h2>Renda mensal</h2><div class="row between"><span class="mute">Quanto entra por mês</span><input class="plain" inputmode="decimal" data-act="renda" value="${S.renda ? String(S.renda).replace('.', ',') : ''}" placeholder="0,00"></div></div>`;
  h += `<div class="card"><h2>Limite por categoria</h2><div class="mute" style="margin-bottom:6px">Deixe em branco para não limitar.</div>`;
  CATS.forEach(([, c]) => {
    h += `<div class="item">${catBubble(c)}<div class="grow">${esc(c)}</div><input class="plain" inputmode="decimal" data-act="orc" data-cat="${esc(c)}" value="${S.orcamentos[c] ? String(S.orcamentos[c]).replace('.', ',') : ''}" placeholder="0,00"></div>`;
  });
  h += `</div>`;
  h += `<div class="card"><h2>IA (voz e recibos)</h2><div class="mute" style="margin-bottom:10px">Cole sua chave da API da Anthropic. Ela fica só neste aparelho. O texto e a foto do recibo são enviados à Anthropic para serem interpretados.</div>
    <div class="row"><input class="plain grow" style="width:auto;text-align:left" type="password" autocomplete="off" data-act="chave" value="${esc(chaveIA())}" placeholder="sk-ant-..."></div></div>`;
  h += `<div class="card"><h2>Conta</h2>${sb && user
    ? `<div class="mute" style="margin-bottom:10px">Dados guardados na nuvem, na conta <b>${esc(user.email || '')}</b>.</div><button class="btn small danger" data-act="sair">Sair</button>`
    : `<div class="mute">Modo local: os dados ficam só neste aparelho.</div>`}</div>`;
  h += `<div class="card"><h2>Backup</h2><div class="mute" style="margin-bottom:10px">Seus dados ficam só neste iPhone. Exporte de vez em quando para não perder nada.</div>
    <div class="row"><button class="btn small" data-act="exportar">Exportar</button><button class="btn small ghost" data-act="importar">Restaurar</button></div></div>`;
  h += `<div class="card"><button class="btn danger" data-act="apagar">Apagar todos os dados</button></div>`;
  return h;
}

/* ---------- render e eventos ---------- */
const VIEWS = { inicio: vInicio, gastos: vGastos, mensal: vMensal, dividas: vDividas, metas: vMetas, mais: vMais };
function render() {
  const y = window.scrollY;
  const [topo, corpo] = VIEWS[tab]().split('<!--w-->');
  $('#app').innerHTML = `${topo}<div class="wrap">${corpo}</div>`;
  document.querySelectorAll('.tabbar button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab || (b.dataset.tab === 'mais' && (tab === 'dividas' || tab === 'metas'))));
  window.scrollTo(0, y);
}
function ir(t) { tab = t; render(); window.scrollTo(0, 0); }

document.querySelector('.tabbar').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.hasAttribute('data-add')) { ({ mensal: formConta, dividas: formDivida, metas: formMeta }[tab] || formGasto)(); return; }
  ir(b.dataset.tab);
});

$('#app').addEventListener('click', async e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const { act, id } = el.dataset;
  if (el.tagName === 'INPUT') return;
  const achar = (lista) => S[lista].findIndex(x => x.id === id);
  switch (act) {
    case 'mes': mes = mesMove(mes, +el.dataset.n); render(); break;
    case 'ir': ir(el.dataset.tab); break;
    case 'novoGasto': formGasto(); break;    case 'novaDivida': formDivida(); break;
    case 'novaConta': formConta(); break;
    case 'ajustarSaldo': formSaldo(); break;
    case 'novoBanco': formBanco(); break;
    case 'editBanco': formBanco(id); break;
    case 'delBanco': {
      const b = S.bancos.find(x => x.id === id);
      if (b && await confirmar(`Excluir a conta "${b.nome}"? Os lançamentos ficam em "Sem conta".`)) { S.bancos = S.bancos.filter(x => x.id !== id); salvar(); render(); }
      break;
    }
    case 'delEntrada': {
      const i = (S.entradas || []).findIndex(x => x.id === id), en = S.entradas[i];
      if (en && await confirmar(`Excluir a receita "${en.descricao}" (${R(en.valor)})?`)) { S.entradas.splice(i, 1); salvar(); render(); }
      break;
    }
    case 'entrada': formEntrada(); break;
    case 'sair':
      if (await confirmar('Sair da conta? Seus dados continuam na nuvem.', 'Sair')) {
        await sb.auth.signOut(); try { localStorage.removeItem(KEY); } catch (_) {}
        S = vazio(); user = null; telaLogin();
      }
      break;
    case 'pagarConta': {
      const c = S.contas.find(x => x.id === id); if (!c || paga(c)) break;
      const dia = Math.min(c.dia, 28);
      const g = { id: uid(), valor: c.valor, descricao: c.nome, categoria: c.categoria || 'Outros', tipo: 'necessario', data: hoje().startsWith(mes) ? hoje() : `${mes}-${p2(dia)}`, conta: c.id, banco: c.banco || '' };
      S.gastos.push(g); c.pagos = c.pagos || {}; c.pagos[mes] = g.id;
      salvar(); render(); toast(`Paga: −${R(c.valor)} lançado nos gastos`);
      break;
    }
    case 'desfazerConta': {
      const c = S.contas.find(x => x.id === id); if (!c || !paga(c)) break;
      S.gastos = S.gastos.filter(g => g.id !== c.pagos[mes]); delete c.pagos[mes];
      salvar(); render(); toast('Pagamento desfeito');
      break;
    }
    case 'delConta': {
      const c = S.contas.find(x => x.id === id);
      if (c && await confirmar(`Excluir a conta fixa "${c.nome}"? Os gastos já lançados ficam.`)) { S.contas = S.contas.filter(x => x.id !== id); salvar(); render(); }
      break;
    }
    case 'novaMeta': formMeta(); break;
    case 'pagar': formPagamento(id); break;
    case 'aporte': formAporte(id); break;
    case 'delGasto': { const g = S.gastos[achar('gastos')]; if (g && await confirmar(`Excluir "${g.descricao}" (${R(g.valor)})?`)) { S.gastos.splice(achar('gastos'), 1); salvar(); render(); } break; }
    case 'delDivida': { const d = S.dividas[achar('dividas')]; if (d && await confirmar(`Excluir a dívida "${d.nome}" e seus pagamentos?`)) { S.dividas.splice(achar('dividas'), 1); salvar(); render(); } break; }
    case 'delMeta': { const m = S.metas[achar('metas')]; if (m && await confirmar(`Excluir a meta "${m.nome}"?`)) { S.metas.splice(achar('metas'), 1); salvar(); render(); } break; }
    case 'exportar': {
      const json = JSON.stringify(S, null, 2);
      sheet('Backup dos dados',
        `<div class="mute">Copie este texto e guarde em um lugar seguro (Notas, e-mail para você mesmo).</div><textarea id="bk" rows="8" readonly>${esc(json)}</textarea>`,
        () => {
          const ta = document.getElementById('bk'); ta.select();
          let ok = false; try { ok = document.execCommand('copy'); } catch (_) {}
          if (!ok && navigator.clipboard) navigator.clipboard.writeText(json).catch(() => {});
          toast('Copiado');
        }, 'Copiar');
      break;
    }
    case 'importar':
      sheet('Restaurar backup', `<div class="mute">Cole aqui o texto do backup.</div><textarea name="json" rows="8"></textarea>`, f => {
        try {
          const d = JSON.parse(f.json);
          if (!Array.isArray(d.gastos) || !Array.isArray(d.dividas)) throw 0;
          confirmar('Substituir os dados atuais pelos do backup?', 'Substituir').then(ok => {
            if (ok) { S = Object.assign(vazio(), d); salvar(); render(); toast('Backup restaurado'); }
          });
        } catch (_) { toast('Texto inválido'); return false; }
      }, 'Restaurar');
      break;
    case 'apagar':
      if (await confirmar('Apagar TODOS os dados deste aparelho? Não dá para desfazer.', 'Apagar tudo')) { S = vazio(); salvar(); render(); toast('Dados apagados'); }
      break;
  }
});

$('#app').addEventListener('change', e => {
  const el = e.target; if (!el.dataset.act) return;
  if (el.dataset.act === 'chave') { try { localStorage.setItem(KEY_API, el.value.trim()); toast('Chave salva'); } catch (_) { toast('Não consegui salvar a chave'); } }
  else if (el.dataset.act === 'renda') { S.renda = num(el.value); salvar(); toast('Renda salva'); }
  else if (el.dataset.act === 'orc') { const v = num(el.value); if (v > 0) S.orcamentos[el.dataset.cat] = v; else delete S.orcamentos[el.dataset.cat]; salvar(); toast('Limite salvo'); }
});

iniciar();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
