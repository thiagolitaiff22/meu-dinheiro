'use strict';
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

