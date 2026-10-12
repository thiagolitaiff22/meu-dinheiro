'use strict';
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

