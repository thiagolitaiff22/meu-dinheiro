'use strict';
/* =========================================================
   Telas e formulários (layout E-Wallet, regras Mobills)
   ========================================================= */

/* ---------- formulários ---------- */
const opcoesConta = () => [['', 'Sem conta (dinheiro)'], ...S.bancos.map(b => ['b:' + b.id, b.nome])];
const opcoesPagar = () => [...opcoesConta(), ...S.cartoes.map(c => ['c:' + c.id, 'Cartão ' + c.nome])];
const bancoNome = id => { const b = S.bancos.find(x => x.id === id); return b ? b.nome : ''; };
const cartaoNome = id => { const c = S.cartoes.find(x => x.id === id); return c ? 'Cartão ' + c.nome : ''; };
const origemTxt = l => (l.cartao ? cartaoNome(l.cartao) : bancoNome(l.conta));

function formLanc(tipo = 'despesa', edit = null) {
  const rec = tipo === 'receita', tr = tipo === 'transf';
  const cats = (rec ? CATS_REC : CATS).map(c => [c[1], c[1]]);
  const padrao = S.bancos[0] ? 'b:' + S.bancos[0].id : '';
  const atual = edit ? (edit.cartao ? 'c:' + edit.cartao : edit.conta ? 'b:' + edit.conta : '') : padrao;
  const titulo = edit ? 'Editar lançamento' : rec ? 'Nova receita' : tr ? 'Transferência' : 'Nova despesa';
  let corpo = '';
  if (tipo === 'despesa' && !edit) {
    corpo += `<div class="ia"><div class="mute row" style="gap:6px">${ic('spark')}Conte o gasto (voz ou texto) e/ou fotografe o recibo</div>
      <textarea name="_texto" rows="2" placeholder="Ex.: gastei 45 no almoço com o pessoal, foi mais por impulso"></textarea>
      <div class="row" style="margin-top:8px"><button type="button" class="btn small ghost" data-ia="mic">${ic('mic')}Falar</button><label class="btn small ghost" style="margin:0">${ic('camera')}Recibo<input type="file" accept="image/*" data-ia="foto" hidden></label><button type="button" class="btn small" data-ia="go">Analisar</button></div>
      <div class="mute" data-ia="status" style="margin-top:6px"></div></div>`;
  }
  corpo += campo('Valor (R$)', 'valor', { mode: 'decimal', value: edit ? fmtIn(edit.valor) : '', ph: '0,00' });
  if (tr) {
    const cs = opcoesConta();
    corpo += selecao('De qual conta', 'de', cs, S.bancos[0] ? S.bancos[0].id : '') .replace(/value="b:/g, 'value="') +
             selecao('Para qual conta', 'para', cs, S.bancos[1] ? S.bancos[1].id : '').replace(/value="b:/g, 'value="');
  } else {
    corpo += campo('Descrição', 'descricao', { value: edit ? edit.desc : '', ph: rec ? 'Ex.: salário' : 'Ex.: iFood, mercado...' });
    corpo += selecao('Categoria', 'categoria', cats, edit ? edit.cat : cats[0][0]);
    corpo += selecao(rec ? 'Receber em' : 'Pagar com', 'forma', rec ? opcoesConta() : opcoesPagar(), atual);
  }
  corpo += campo('Data', 'data', { type: 'date', value: edit ? edit.data : hoje() });
  if (!tr) corpo += selecao('Situação', 'situacao', [['pago', rec ? 'Recebida' : 'Paga'], ['pendente', 'Pendente']], edit ? (edit.pago ? 'pago' : 'pendente') : 'pago');
  if (tipo === 'despesa') corpo += selecao('Foi...', 'tipo', Object.entries(TIPOS), edit ? (edit.sent || 'necessario') : 'necessario');
  if (!edit && !tr) corpo += selecao('Repetir', 'repete', [['nao', 'Não repete'], ['fixa', 'Todo mês (conta fixa)'], ['parcelada', 'Parcelada']], 'nao') +
    campo('Número de parcelas (se parcelada)', 'parcelas', { mode: 'numeric', ph: '12' });

  const el = sheet(titulo, corpo, f => {
    const valor = num(f.valor);
    if (valor <= 0) { toast('Informe um valor'); return false; }
    const data = f.data || hoje();
    if (tr) {
      const de = (f.de || '').replace('b:', ''), para = (f.para || '').replace('b:', '');
      if (de === para) { toast('Escolha contas diferentes'); return false; }
      const novo = { tipo: 'transf', valor, desc: 'Transferência', cat: '', data, conta: de, destino: para, cartao: '', pago: true, nat: 'variavel' };
      if (edit) Object.assign(edit, novo); else S.lancs.push({ id: uid(), ...novo });
      toast('Transferência registrada');
      return;
    }
    const [k, id] = (f.forma || '').split(':');
    const conta = k === 'b' ? id : '', cartao = k === 'c' ? id : '';
    const base = { tipo, valor, desc: (f.descricao || '').trim() || f.categoria, cat: f.categoria, data, conta, cartao, pago: f.situacao !== 'pendente' || !!cartao, sent: f.tipo || 'necessario' };
    if (edit) { Object.assign(edit, base); toast('Lançamento atualizado'); return; }
    const rep = f.repete || 'nao';
    if (rep === 'fixa') {
      const s = { id: uid(), tipo, desc: base.desc, valor, cat: base.cat, conta, cartao, dia: +data.slice(8), forma: '', inicio: data.slice(0, 7), fim: '' };
      S.series.push(s);
      S.lancs.push({ id: uid(), ...base, serie: s.id, nat: 'fixa' });
      garantirSeries();
    } else if (rep === 'parcelada') {
      const n = Math.max(2, Math.min(60, parseInt(f.parcelas, 10) || 2)), sid = uid();
      for (let i = 0; i < n; i++) {
        S.lancs.push({ id: uid(), ...base, desc: `${base.desc} (${i + 1}/${n})`, data: dataNoMes(mesMove(data.slice(0, 7), i), +data.slice(8)), pago: i === 0 ? base.pago : !!cartao, serie: sid, parc: `${i + 1}/${n}`, nat: 'variavel' });
      }
    } else {
      S.lancs.push({ id: uid(), ...base, nat: 'variavel' });
    }
    mes = data.slice(0, 7);
    toast(rec ? 'Receita salva' : 'Despesa salva');
  });
  if (tipo === 'despesa' && !edit) ligarIA(el);
}

async function novoLancamento() {
  const k = await menuAcoes('O que você quer lançar?', [['despesa', 'Despesa', 'danger-solid'], ['receita', 'Receita', ''], ['transf', 'Transferência entre contas', '']]);
  if (k === 'transf' && S.bancos.length < 2) { toast('Cadastre pelo menos 2 contas para transferir'); return; }
  if (k) formLanc(k);
}

function formBanco(id) {
  const b = id ? S.bancos.find(x => x.id === id) : null;
  sheet(b ? 'Editar conta' : 'Nova conta', campo('Nome', 'nome', { value: b ? b.nome : '', ph: 'Ex.: Bradesco, Nubank, Carteira' }) +
    campo('Saldo atual (R$)', 'valor', { mode: 'decimal', value: b ? fmtIn(saldoDe(b.id)) : '', ph: '0,00' }), f => {
    if (!f.nome.trim()) { toast('Informe o nome'); return false; }
    if (b) { const mov = saldoDe(b.id) - b.saldoInicial; b.nome = f.nome.trim(); b.saldoInicial = num(f.valor) - mov; }
    else S.bancos.push({ id: uid(), nome: f.nome.trim(), saldoInicial: num(f.valor) });
    toast('Conta salva');
  });
}
function formCartao(id) {
  const c = id ? S.cartoes.find(x => x.id === id) : null;
  sheet(c ? 'Editar cartão' : 'Novo cartão de crédito',
    campo('Nome', 'nome', { value: c ? c.nome : '', ph: 'Ex.: Nubank, Itaú' }) +
    campo('Limite (R$)', 'limite', { mode: 'decimal', value: c ? fmtIn(c.limite) : '', ph: '0,00' }) +
    campo('Dia do fechamento', 'fechamento', { mode: 'numeric', value: c ? c.fechamento : '', ph: '25' }) +
    campo('Dia do vencimento', 'vencimento', { mode: 'numeric', value: c ? c.vencimento : '', ph: '5' }), f => {
    const fe = Math.round(num(f.fechamento)), ve = Math.round(num(f.vencimento));
    if (!f.nome.trim() || fe < 1 || fe > 31 || ve < 1 || ve > 31) { toast('Confira nome e dias (1 a 31)'); return false; }
    const d = { nome: f.nome.trim(), limite: num(f.limite), fechamento: fe, vencimento: ve };
    if (c) Object.assign(c, d); else S.cartoes.push({ id: uid(), ...d });
    toast('Cartão salvo');
  });
}
function formSaldo(bancoId = '') {
  const el = sheet('Ajustar saldo',
    (S.bancos.length ? selecao('Conta', 'banco', [['', 'Sem conta (dinheiro)'], ...S.bancos.map(b => [b.id, b.nome])], bancoId) : '') +
    campo('Quanto tem agora (R$)', 'valor', { mode: 'decimal', value: fmtIn(saldoDe(bancoId || '')) }),
    f => {
      const id = f.banco || '';
      const mov = movimento(id);
      const base = num(f.valor) - mov;
      if (id && temBanco(id)) S.bancos.find(b => b.id === id).saldoInicial = base; else S.saldoInicial = base;
      toast('Saldo ajustado');
    });
  const sel = el.querySelector('[name=banco]');
  if (sel) sel.addEventListener('change', () => { el.querySelector('[name=valor]').value = fmtIn(saldoDe(sel.value || '')); });
}
function formLimite(cat) {
  sheet(`Limite: ${cat}`, campo('Limite mensal (R$)', 'valor', { mode: 'decimal', value: S.orcamentos[cat] ? fmtIn(S.orcamentos[cat]) : '', ph: '0,00 (vazio = sem limite)' }), f => {
    const v = num(f.valor); if (v > 0) S.orcamentos[cat] = v; else delete S.orcamentos[cat];
    toast('Limite salvo');
  });
}
function formPagarFatura(c, m) {
  const f0 = faturasAbertas(c).find(x => x.mes === m); if (!f0) return;
  sheet(`Pagar fatura ${c.nome}`, `<div class="mute">Fatura de ${esc(mesNome(m))}: <b>${R(f0.valor)}</b></div>` +
    selecao('Pagar com a conta', 'conta', [['', 'Sem conta (dinheiro)'], ...S.bancos.map(b => [b.id, b.nome])], S.bancos[0] ? S.bancos[0].id : '') +
    campo('Data do pagamento', 'data', { type: 'date', value: hoje() }), f => {
    const l = { id: uid(), tipo: 'fatura', valor: f0.valor, desc: `Fatura ${c.nome}`, cat: '', data: f.data || hoje(), conta: f.conta || '', cartao: c.id, pago: true, nat: 'variavel', fkey: chaveFatura(c, m) };
    S.lancs.push(l);
    S.faturas[chaveFatura(c, m)] = { pago: true, lanc: l.id };
    toast('Fatura paga');
  }, 'Pagar');
}

/* ---------- partes de tela ---------- */
function linhaLanc(l) {
  const rec = l.tipo === 'receita', tr = l.tipo === 'transf', ft = l.tipo === 'fatura';
  const valor = tr ? `<b>${R(l.valor)}</b>` : `<b class="${rec ? 'pos' : 'neg'}">${rec ? '+' : '−'}${mv(l.valor)}</b>`;
  const podeToggle = (l.tipo === 'despesa' || rec) && !l.cartao;
  const marca = podeToggle
    ? `<button class="chk ${l.pago ? 'on' : ''}" data-act="toggle" data-id="${l.id}" aria-label="${l.pago ? 'Marcar como pendente' : 'Marcar como paga'}">${ic('check')}</button>`
    : `<span class="chk off">${ic(l.cartao ? 'card' : tr ? 'swap' : 'check')}</span>`;
  const icone = tr || ft ? `<span class="emoji">${ic(tr ? 'swap' : 'card')}</span>` : catBubble(l.cat);
  let det = tr ? `${esc(bancoNome(l.conta) || 'Dinheiro')} → ${esc(bancoNome(l.destino) || 'Dinheiro')}` : esc(l.cat || '');
  const o = origemTxt(l); if (o && !tr) det += ` · ${esc(o)}`;
  const st = [];
  if (!l.pago && podeToggle) st.push(atrasado(l) ? '<span class="neg">atrasada</span>' : '<span>pendente</span>');
  if (l.parc) st.push(`<span>${esc(l.parc)}</span>`);
  if (l.nat === 'fixa') st.push('<span>fixa</span>');
  if (l.sent === 'besteira' && l.tipo === 'despesa') st.push('<span class="neg">besteira</span>');
  return `<div class="item ${podeToggle && !l.pago ? 'pend' : ''}" data-act="lancMenu" data-id="${l.id}">${marca}${icone}
    <div class="grow"><div class="nm">${esc(l.desc)}</div><div class="mute sm">${det}${st.length ? ' · ' + st.join(' · ') : ''}</div></div>${valor}</div>`;
}

/* ---------- Início (Principal) ---------- */
function vInicio() {
  garantirSeries(mes);
  const des = despesasMes().filter(l => l.pago || l.cartao), rec = receitasMes().filter(l => l.pago);
  const totD = soma(des, l => l.valor), totR = soma(rec, l => l.valor);
  const pend = pendentes().filter(l => l.tipo === 'despesa').sort((a, b) => a.data.localeCompare(b.data));
  const pendR = pendentes().filter(l => l.tipo === 'receita');
  const atras = pend.filter(atrasado);
  const prev = saldoPrevisto();
  const saldo = saldoAtual();
  const abertas = dividasAbertas();

  let h = `<header class="hero wallet"><div class="row between"><div class="brand">Meu Dinheiro</div><div class="row" style="gap:8px"><button class="gear" data-act="olho" aria-label="Mostrar ou ocultar valores">${ic(S.ocultar ? 'eyeoff' : 'eye')}</button>${gearBtn()}</div></div>
    <div class="hl">Saldo atual</div>
    <div class="hbig ${saldo < 0 ? 'neg' : ''}">${mv(saldo)}</div>
    <div class="hsub">Previsto até o fim de ${esc(mesCurto(mes))}: <b>${mv(prev)}</b></div>
  </header><!--w-->`;

  h += `<div class="quick">
    <button data-act="novo" data-t="despesa"><span class="qi">${ic('arrowdown')}</span>Despesa</button>
    <button data-act="novo" data-t="receita"><span class="qi">${ic('arrowup')}</span>Receita</button>
    <button data-act="novo" data-t="transf"><span class="qi">${ic('swap')}</span>Transferir</button>
    <button data-act="ir" data-tab="trans"><span class="qi">${ic('clock')}</span>Extrato</button>
  </div>`;
  h += mnav();

  h += `<div class="grid2">
    <div class="stat"><span class="circ up">${ic('arrowup')}</span><div><div class="mute sm">Receitas</div><b class="pos">${mv(totR)}</b></div></div>
    <div class="stat"><span class="circ down">${ic('arrowdown')}</span><div><div class="mute sm">Despesas</div><b class="neg">${mv(totD)}</b></div></div>
  </div>`;

  h += `<div class="sec row between"><span>Contas a pagar</span><span data-act="ir" data-tab="trans">ver todas ›</span></div>`;
  if (!pend.length) h += `<div class="card mute">${S.lancs.length ? 'Nada pendente neste mês.' : 'Lance sua primeira despesa com o botão +.'}</div>`;
  else {
    h += `<div class="tiles">`;
    pend.slice(0, 8).forEach(l => {
      const [i, , col] = catInfo(l.cat);
      h += `<button class="tile" data-act="lancMenu" data-id="${l.id}"><span class="ti" style="color:${col}">${ic(i)}</span><span class="tn">${esc(l.desc)}</span><span class="tv ${atrasado(l) ? 'neg' : ''}">${mv(l.valor)}</span><span class="td">dia ${l.data.slice(8)}</span></button>`;
    });
    h += `</div>`;
    if (atras.length) h += `<div class="mute sm" style="margin:4px 2px 10px"><span class="neg">${atras.length} atrasada(s)</span> · ${mv(soma(atras, l => l.valor))}</div>`;
  }

  h += `<div class="card"><div class="row between"><h2 style="margin:0">Contas</h2><button class="btn small" data-act="novoBanco">Adicionar</button></div>`;
  if (!S.bancos.length) h += `<div class="mute" style="margin-top:6px">Cadastre seus bancos para ver o saldo de cada um. Tudo manual, sem vínculo automático.</div>`;
  S.bancos.forEach((b, i) => {
    const v = saldoDe(b.id), cor = COR_BANCO[i % COR_BANCO.length];
    h += `<div class="item" data-act="editBanco" data-id="${b.id}"><span class="emoji" style="color:${cor}"><b>${esc(b.nome.slice(0, 1).toUpperCase())}</b></span><div class="grow"><b>${esc(b.nome)}</b></div><b class="${v < 0 ? 'neg' : ''}">${mv(v)}</b></div>`;
  });
  const sem = saldoDe('');
  if (S.bancos.length && Math.abs(sem) > 0.004) h += `<div class="item"><span class="emoji">${ic('tag')}</span><div class="grow"><b>Sem conta / dinheiro</b></div><b>${mv(sem)}</b></div>`;
  h += `<div class="row between tot"><span class="mute">Total</span><b>${mv(saldo)}</b></div></div>`;

  if (S.cartoes.length) {
    h += `<div class="card"><div class="row between"><h2 style="margin:0">Cartões de crédito</h2><span class="mute" data-act="ir" data-tab="cartoes">ver ›</span></div>`;
    S.cartoes.forEach(c => {
      const usado = limiteUsado(c), fat = totalFatura(c, mes);
      h += `<div class="item" data-act="ir" data-tab="cartoes"><span class="emoji">${ic('card')}</span><div class="grow"><b>${esc(c.nome)}</b><div class="mute sm">fatura de ${esc(mesCurto(mes))}: ${mv(fat)}</div></div><div style="text-align:right"><b>${mv(c.limite - usado)}</b><div class="mute sm">disponível</div></div></div>`;
    });
    h += `</div>`;
  }

  const bes = soma(despesasMes().filter(l => l.sent === 'besteira'), l => l.valor);
  let promo;
  if (bes > 0) promo = `<b>${mv(bes)}</b> em besteira neste mês.${abertas.length ? ` Isso pagaria <b>${Math.min(100, Math.round(bes / restante(abertas[0]) * 100))}%</b> da dívida “${esc(abertas[0].nome)}”.` : ''}`;
  else if (!S.cartoes.length) promo = `Tem cartão de crédito? Cadastre em <b>Mais → Cartões</b> para acompanhar a fatura e o limite.`;
  else promo = `Tudo certo por aqui. Continue lançando suas despesas.`;
  h += `<div class="promo"><div><div class="pt">Dica do mês</div><div class="pd">${promo}</div></div><span class="pi">${ic('bulb')}</span></div>`;

  if (S.metas.length || abertas.length) {
    const media = S.metas.length ? Math.round(soma(S.metas, m => m.alvo ? m.atual / m.alvo * 100 : 0) / S.metas.length) : 0;
    h += `<div class="grid2">
      <div class="mini" data-act="ir" data-tab="dividas"><span>Dívidas em aberto</span><b>${mv(soma(abertas, restante))}</b><span>${abertas.length} dívida(s) ›</span></div>
      <div class="mini" data-act="ir" data-tab="metas"><span>Metas</span><b>${S.metas.length ? media + '%' : '—'}</b><span>${S.metas.length} meta(s) ›</span></div></div>`;
  }
  if (pendR.length) h += `<div class="mute sm" style="text-align:center">${pendR.length} receita(s) pendente(s): ${mv(soma(pendR, l => l.valor))}</div>`;
  return h;
}

/* ---------- Transações ---------- */
function vTrans() {
  garantirSeries(mes);
  const todos = doMes().filter(l => l.tipo !== 'fatura' || true);
  let lista = todos;
  if (filtro === 'receitas') lista = todos.filter(l => l.tipo === 'receita');
  if (filtro === 'despesas') lista = todos.filter(l => l.tipo === 'despesa');
  if (filtro === 'pendentes') lista = todos.filter(l => !l.pago && (l.tipo === 'despesa' || l.tipo === 'receita') && !l.cartao);
  lista = [...lista].sort((a, b) => b.data.localeCompare(a.data));
  const rec = soma(todos.filter(l => l.tipo === 'receita' && l.pago), l => l.valor);
  const des = soma(todos.filter(l => l.tipo === 'despesa' && (l.pago || l.cartao)), l => l.valor);
  let h = heroSmall('Transações', mnav());
  h += `<div class="pills2">${[['todas', 'Todas'], ['receitas', 'Receitas'], ['despesas', 'Despesas'], ['pendentes', 'Pendentes']].map(([k, t]) => `<button class="${filtro === k ? 'on' : ''}" data-act="filtro" data-k="${k}">${t}</button>`).join('')}</div>`;
  h += `<div class="card"><div class="row between"><span class="mute">Receitas</span><b class="pos">+${mv(rec)}</b></div>
    <div class="row between sp"><span class="mute">Despesas</span><b class="neg">−${mv(des)}</b></div>
    <div class="row between sp"><span class="mute">Resultado do mês</span><b class="${rec - des < 0 ? 'neg' : 'pos'}">${mv(rec - des)}</b></div></div>`;
  if (!lista.length) h += `<div class="empty">Nada por aqui neste filtro.</div>`;
  let dia = '', aberto = false;
  lista.forEach(l => {
    if (l.data !== dia) {
      if (aberto) h += `</div>`;
      dia = l.data; aberto = true;
      h += `<div class="day">${l.data.slice(8)}/${l.data.slice(5, 7)}${l.data === hoje() ? ' · hoje' : ''}</div><div class="card list">`;
    }
    h += linhaLanc(l);
  });
  if (aberto) h += `</div>`;
  h += `<div class="mute sm" style="text-align:center">Toque no círculo para marcar como paga/recebida. Toque na linha para editar ou excluir.</div>`;
  return h;
}

/* ---------- Estatísticas e planejamento ---------- */
function vEstat() {
  garantirSeries(mes);
  const meses = []; for (let i = 5; i >= 0; i--) meses.push(mesMove(mes, -i));
  const dados = meses.map(m => ({
    m, r: soma(receitasMes(m).filter(l => l.pago), l => l.valor),
    d: soma(despesasMes(m).filter(l => l.pago || l.cartao), l => l.valor)
  }));
  const maxV = Math.max(1, ...dados.map(x => Math.max(x.r, x.d)));
  const totR = dados[5].r, totD = dados[5].d;
  let h = heroSmall('Estatísticas', mnav());
  h += `<div class="card"><div class="mute sm">Saldo atual</div><div class="big">${mv(saldoAtual())}</div>
    <h2 style="margin-top:12px">Visão geral · últimos 6 meses</h2>
    <div class="chart">${dados.map(x => `<div class="col"><div class="bars"><i class="br" style="height:${Math.round(x.r / maxV * 100)}%"></i><i class="bd" style="height:${Math.round(x.d / maxV * 100)}%"></i></div><span>${esc(mesCurto(x.m))}</span></div>`).join('')}</div>
    <div class="legend"><span><i class="br"></i>Receitas</span><span><i class="bd"></i>Despesas</span></div></div>`;
  h += `<div class="grid2">
    <div class="stat big2"><span class="circ up">${ic('arrowup')}</span><div><div class="mute sm">Receitas</div><b class="pos">${mv(totR)}</b></div></div>
    <div class="stat big2"><span class="circ down">${ic('arrowdown')}</span><div><div class="mute sm">Despesas</div><b class="neg">${mv(totD)}</b></div></div></div>`;

  // despesas por categoria + limites (planejamento)
  const porCat = {};
  despesasMes().forEach(l => porCat[l.cat] = (porCat[l.cat] || 0) + l.valor);
  const nomes = [...new Set([...Object.keys(porCat), ...Object.keys(S.orcamentos)])].sort((a, b) => (porCat[b] || 0) - (porCat[a] || 0));
  const totCat = soma(Object.values(porCat), v => v) || 1;
  h += `<div class="card"><div class="row between"><h2 style="margin:0">Despesas por categoria</h2><span class="mute sm">toque para definir limite</span></div>`;
  if (!nomes.length) h += `<div class="mute" style="margin-top:6px">Sem despesas neste mês.</div>`;
  nomes.forEach(c => {
    const v = porCat[c] || 0, lim = S.orcamentos[c] || 0;
    h += `<div class="item" style="flex-wrap:wrap" data-act="limite" data-cat="${esc(c)}">${catBubble(c)}<div class="grow"><b>${esc(c)}</b><div class="mute sm">${Math.round(v / totCat * 100)}% das despesas${lim ? ` · limite ${mv(lim)}` : ''}</div></div><b>${mv(v)}</b>${lim ? `<div style="width:100%">${bar(v / lim * 100)}</div>` : ''}</div>`;
  });
  h += `</div>`;

  // custo fixo x variavel
  const fixo = soma(despesasMes().filter(l => l.nat === 'fixa'), l => l.valor), tot = soma(despesasMes(), l => l.valor);
  h += `<div class="card"><div class="row between"><h2 style="margin:0">Fixo × variável</h2><span class="mute">${tot > 0 ? Math.round(fixo / tot * 100) : 0}% fixo</span></div>
    <div class="grid2" style="margin:8px 0 0"><div><div class="mute sm">Fixo</div><b class="neg">−${mv(fixo)}</b></div><div><div class="mute sm">Variável</div><b class="neg">−${mv(tot - fixo)}</b></div></div>${tot > 0 ? bar(fixo / tot * 100) : ''}</div>`;

  // contas fixas e parcelamentos
  h += `<div class="card"><h2>Contas fixas e parcelamentos</h2>`;
  if (!S.series.length) h += `<div class="mute">Nenhuma conta fixa. Ao lançar uma despesa, escolha “Todo mês” em Repetir.</div>`;
  S.series.forEach(s => {
    h += `<div class="item"><span class="emoji">${ic('repeat')}</span><div class="grow"><b>${esc(s.desc)}</b><div class="mute sm">todo dia ${p2(s.dia)}${s.fim ? ' · encerrada' : ''}</div></div><b>${mv(s.valor)}</b>${s.fim ? '' : `<button class="btn small ghost" data-act="encerrar" data-id="${s.id}">Encerrar</button>`}</div>`;
  });
  const parcel = {};
  S.lancs.filter(l => l.parc).forEach(l => { (parcel[l.serie] = parcel[l.serie] || []).push(l); });
  Object.values(parcel).forEach(ps => {
    const abertasP = ps.filter(l => !l.pago && !l.cartao || (l.cartao && l.data >= hoje()));
    if (!abertasP.length) return;
    const n = +ps[0].parc.split('/')[1];
    h += `<div class="item"><span class="emoji">${ic('swap')}</span><div class="grow"><b>${esc(ps[0].desc.replace(/ \(\d+\/\d+\)$/, ''))}</b><div class="mute sm">parcelado em ${n}x · faltam ${abertasP.length}</div></div><b>${mv(soma(abertasP, l => l.valor))}</b></div>`;
  });
  h += `</div>`;
  return h;
}

/* ---------- Contas e cartões (em Mais) ---------- */
function vContas() {
  let h = heroSmall('Contas bancárias');
  h += `<div class="card"><div class="row between"><div><div class="mute sm">Saldo total</div><div class="big">${mv(saldoAtual())}</div></div><button class="btn small" data-act="novoBanco">Adicionar</button></div></div>`;
  h += `<div class="card list">`;
  if (!S.bancos.length) h += `<div class="mute">Nenhuma conta cadastrada. Os saldos são lançados à mão, sem vínculo com o banco.</div>`;
  S.bancos.forEach((b, i) => {
    const cor = COR_BANCO[i % COR_BANCO.length];
    h += `<div class="item" style="flex-wrap:wrap"><span class="emoji" style="color:${cor}"><b>${esc(b.nome.slice(0, 1).toUpperCase())}</b></span><div class="grow"><b>${esc(b.nome)}</b></div><b>${mv(saldoDe(b.id))}</b>
      <div class="row" style="width:100%;justify-content:flex-end;margin-top:6px"><button class="btn small ghost" data-act="ajustarSaldo" data-id="${b.id}">Ajustar saldo</button><button class="btn small ghost" data-act="editBanco" data-id="${b.id}">Editar</button><button class="btn small danger" data-act="delBanco" data-id="${b.id}">Excluir</button></div></div>`;
  });
  const sem = saldoDe('');
  if (Math.abs(sem) > 0.004 || !S.bancos.length) h += `<div class="item" style="flex-wrap:wrap"><span class="emoji">${ic('tag')}</span><div class="grow"><b>Sem conta / dinheiro</b></div><b>${mv(sem)}</b><div class="row" style="width:100%;justify-content:flex-end;margin-top:6px"><button class="btn small ghost" data-act="ajustarSaldo" data-id="">Ajustar saldo</button></div></div>`;
  h += `</div>`;
  return h;
}
function vCartoes() {
  let h = heroSmall('Cartões de crédito');
  h += `<div class="card row between"><span class="mute">Faturas e limite</span><button class="btn small" data-act="novoCartao">Adicionar</button></div>`;
  if (!S.cartoes.length) h += `<div class="empty">Nenhum cartão cadastrado.<br>Cadastre com o limite, o dia de fechamento e o de vencimento.</div>`;
  S.cartoes.forEach(c => {
    const usado = limiteUsado(c), abertas = faturasAbertas(c);
    h += `<div class="card"><div class="row between"><b>${esc(c.nome)}</b><span class="mute sm">fecha dia ${p2(c.fechamento)} · vence dia ${p2(c.vencimento)}</span></div>
      ${bar(c.limite ? usado / c.limite * 100 : 0)}
      <div class="row between sm"><span class="mute">Usado ${mv(usado)}</span><span class="mute">Disponível ${mv(c.limite - usado)}</span></div>`;
    if (!abertas.length) h += `<div class="mute sm" style="margin-top:8px">Nenhuma fatura em aberto.</div>`;
    abertas.forEach(f => {
      h += `<div class="item"><div class="grow"><b>Fatura ${esc(mesCurto(f.mes))}</b><div class="mute sm">vence ${f.venc.slice(8)}/${f.venc.slice(5, 7)}</div></div><b>${mv(f.valor)}</b><button class="btn small" data-act="pagarFatura" data-id="${c.id}" data-m="${f.mes}">Pagar</button></div>`;
    });
    h += `<div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn small ghost" data-act="editCartao" data-id="${c.id}">Editar</button><button class="btn small danger" data-act="delCartao" data-id="${c.id}">Excluir</button></div></div>`;
  });
  return h;
}

/* ---------- Mais ---------- */
function vMais() {
  const linha = (t, ico, titulo, sub) => `<div class="item" data-act="ir" data-tab="${t}"><span class="emoji">${ic(ico)}</span><div class="grow"><b>${titulo}</b><div class="mute sm">${sub}</div></div><span class="mute">›</span></div>`;
  let h = heroSmall('Mais');
  h += `<div class="card list">
    ${linha('contas', 'bank', 'Contas bancárias', `${S.bancos.length} cadastrada(s) · saldo ${mv(saldoAtual())}`)}
    ${linha('cartoes', 'card', 'Cartões de crédito', `${S.cartoes.length} cadastrado(s)`)}
    ${linha('dividas', 'trend', 'Dívidas', 'Quanto falta e ordem de quitação')}
    ${linha('metas', 'target', 'Metas', 'Quanto já juntou e quanto falta')}
  </div>`;
  h += `<div class="card"><h2>IA (voz e recibos)</h2><div class="mute" style="margin-bottom:10px">Cole sua chave da API da Anthropic. Ela fica só neste aparelho. O texto e a foto do recibo são enviados à Anthropic para serem interpretados.</div>
    <input class="plain" style="width:100%;text-align:left" type="password" autocomplete="off" data-act="chave" value="${esc(chaveIA())}" placeholder="sk-ant-..."></div>`;
  h += `<div class="card"><h2>Conta</h2>${sb && user
    ? `<div class="mute" style="margin-bottom:10px">Dados na nuvem, na conta <b>${esc(user.email || '')}</b>.</div><button class="btn small danger" data-act="sair">Sair</button>`
    : `<div class="mute">Modo local: os dados ficam só neste aparelho.</div>`}</div>`;
  h += `<div class="card"><h2>Backup</h2><div class="mute" style="margin-bottom:10px">Exporte de vez em quando para não perder nada.</div>
    <div class="row"><button class="btn small" data-act="exportar">Exportar</button><button class="btn small ghost" data-act="importar">Restaurar</button></div></div>`;
  h += `<div class="card"><button class="btn danger" data-act="apagar">Apagar todos os dados</button></div>`;
  return h;
}

/* ---------- login (só quando a nuvem estiver ligada) ---------- */
function telaLogin(msg = '') {
  document.querySelector('.tabbar').hidden = true;
  $('#app').innerHTML = `<header class="hero"><div class="brand">Meu Dinheiro</div><div class="hsub" style="margin-top:6px">Entre uma única vez. Depois o iPhone lembra de você.</div></header>
    <div class="wrap"><div class="card login">
      <label>Usuário (ou e-mail)<input id="em" type="text" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false"></label>
      <label>Senha (mínimo 6 caracteres)<input id="pw" type="password" autocomplete="current-password"></label>
      <div id="lmsg" class="neg" style="min-height:22px;margin-top:8px">${esc(msg)}</div>
      <div class="row" style="margin-top:8px"><button class="btn grow" data-login="in">Entrar</button><button class="btn ghost grow" data-login="up">Criar conta</button></div>
    </div></div>`;
}
async function entrar(tipo) {
  let email = $('#em').value.trim().toLowerCase();
  const senha = $('#pw').value, out = $('#lmsg');
  if (!email || senha.length < 6) { out.textContent = 'Informe o usuário e uma senha de pelo menos 6 caracteres.'; return; }
  if (!email.includes('@')) email = `${email.replace(/[^a-z0-9._-]/g, '')}@meudinheiro.app`;
  out.textContent = 'Aguarde...';
  const { data, error } = tipo === 'up' ? await sb.auth.signUp({ email, password: senha }) : await sb.auth.signInWithPassword({ email, password: senha });
  if (error) { out.textContent = /invalid login/i.test(error.message) ? 'Usuário ou senha incorretos.' : error.message; return; }
  if (!data.session) { out.textContent = 'Conta criada. Confirme o e-mail e toque em Entrar.'; return; }
  user = data.user;
  document.querySelector('.tabbar').hidden = false;
  render(); await carregarNuvem(); render();
}

/* ---------- render e eventos ---------- */
const VIEWS = { inicio: vInicio, trans: vTrans, estat: vEstat, mais: vMais, contas: vContas, cartoes: vCartoes, dividas: vDividas, metas: vMetas };
const ABAS_MAIS = ['mais', 'contas', 'cartoes', 'dividas', 'metas'];
function render() {
  const y = window.scrollY;
  const [topo, corpo] = VIEWS[tab]().split('<!--w-->');
  $('#app').innerHTML = `${topo}<div class="wrap">${corpo}</div>`;
  document.querySelectorAll('.tabbar button').forEach(b => {
    const t = b.dataset.tab; if (!t) return;
    b.classList.toggle('on', t === tab || (t === 'mais' && ABAS_MAIS.includes(tab)));
  });
  window.scrollTo(0, y);
}
function ir(t) { tab = t; render(); window.scrollTo(0, 0); }

document.querySelector('.tabbar').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.hasAttribute('data-add')) {
    const ctx = { contas: () => formBanco(), cartoes: () => formCartao(), dividas: () => formDivida(), metas: () => formMeta() }[tab];
    if (ctx) ctx(); else novoLancamento();
    return;
  }
  ir(b.dataset.tab);
});

function excluirLanc(l, todas) {
  if (todas && l.serie) {
    S.lancs = S.lancs.filter(x => !(x.serie === l.serie && x.data >= l.data && !x.pago));
    const s = S.series.find(x => x.id === l.serie);
    if (s) { s.fim = mesMove(l.data.slice(0, 7), -1); if (s.fim < s.inicio) S.series = S.series.filter(x => x.id !== s.id); }
  } else {
    S.lancs = S.lancs.filter(x => x.id !== l.id);
    if (l.tipo === 'fatura' && l.fkey) delete S.faturas[l.fkey];
  }
  salvar(); render();
}

$('#app').addEventListener('click', async e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const { act, id } = el.dataset;
  if (el.tagName === 'INPUT') return;
  e.stopPropagation();
  switch (act) {
    case 'mes': mes = mesMove(mes, +el.dataset.n); render(); break;
    case 'ir': ir(el.dataset.tab); break;
    case 'olho': S.ocultar = !S.ocultar; salvar(); render(); break;
    case 'filtro': filtro = el.dataset.k; render(); break;
    case 'novo': if (el.dataset.t === 'transf' && S.bancos.length < 2) toast('Cadastre pelo menos 2 contas para transferir'); else formLanc(el.dataset.t); break;
    case 'toggle': {
      const l = S.lancs.find(x => x.id === id); if (!l) break;
      l.pago = !l.pago; salvar(); render();
      toast(l.pago ? (l.tipo === 'receita' ? 'Receita recebida' : 'Despesa paga') : 'Voltou para pendente');
      break;
    }
    case 'lancMenu': {
      const l = S.lancs.find(x => x.id === id); if (!l) break;
      const itens = [];
      if ((l.tipo === 'despesa' || l.tipo === 'receita') && !l.cartao) itens.push(['toggle', l.pago ? 'Marcar como pendente' : (l.tipo === 'receita' ? 'Marcar como recebida' : 'Marcar como paga'), 'ghost']);
      if (l.tipo !== 'fatura') itens.push(['editar', 'Editar', 'ghost']);
      itens.push(['excluir', 'Excluir', 'danger-solid']);
      if (l.serie && l.tipo !== 'fatura') itens.push(['excluirTodas', 'Excluir esta e as próximas', 'danger-solid']);
      const k = await menuAcoes(`${l.desc} · ${R(l.valor)}`, itens);
      if (k === 'toggle') { l.pago = !l.pago; salvar(); render(); }
      else if (k === 'editar') formLanc(l.tipo, l);
      else if (k === 'excluir') { if (await confirmar(`Excluir "${l.desc}"?`)) excluirLanc(l, false); }
      else if (k === 'excluirTodas') { if (await confirmar('Excluir esta e as próximas repetições?')) excluirLanc(l, true); }
      break;
    }
    case 'encerrar': {
      const s = S.series.find(x => x.id === id);
      if (s && await confirmar(`Encerrar "${s.desc}"? Os próximos meses serão removidos.`, 'Encerrar')) {
        const fimM = hoje().slice(0, 7);
        s.fim = fimM;
        S.lancs = S.lancs.filter(l => !(l.serie === s.id && !l.pago && l.data.slice(0, 7) > fimM));
        if (s.inicio > fimM) S.series = S.series.filter(x => x.id !== s.id);
        salvar(); render();
      }
      break;
    }
    case 'limite': formLimite(el.dataset.cat); break;
    case 'novoBanco': formBanco(); break;
    case 'editBanco': formBanco(id); break;
    case 'ajustarSaldo': formSaldo(id || ''); break;
    case 'delBanco': {
      const b = S.bancos.find(x => x.id === id);
      if (b && await confirmar(`Excluir a conta "${b.nome}"? Os lançamentos ficam em "Sem conta".`)) { S.bancos = S.bancos.filter(x => x.id !== id); salvar(); render(); }
      break;
    }
    case 'novoCartao': formCartao(); break;
    case 'editCartao': formCartao(id); break;
    case 'delCartao': {
      const c = S.cartoes.find(x => x.id === id);
      if (c && await confirmar(`Excluir o cartão "${c.nome}"? As compras dele ficam como "Sem conta".`)) {
        S.lancs.forEach(l => { if (l.cartao === id) { l.cartao = ''; l.pago = true; } });
        S.cartoes = S.cartoes.filter(x => x.id !== id); salvar(); render();
      }
      break;
    }
    case 'pagarFatura': { const c = S.cartoes.find(x => x.id === id); if (c) formPagarFatura(c, el.dataset.m); break; }
    case 'pagar': formPagamento(id); break;
    case 'aporte': formAporte(id); break;
    case 'delDivida': {
      const d = S.dividas.find(x => x.id === id);
      if (d && await confirmar(`Excluir a dívida "${d.nome}" e seus pagamentos?`)) { S.dividas = S.dividas.filter(x => x.id !== id); salvar(); render(); }
      break;
    }
    case 'delMeta': {
      const m = S.metas.find(x => x.id === id);
      if (m && await confirmar(`Excluir a meta "${m.nome}"?`)) { S.metas = S.metas.filter(x => x.id !== id); salvar(); render(); }
      break;
    }
    case 'sair':
      if (await confirmar('Sair da conta? Seus dados continuam na nuvem.', 'Sair')) {
        await sb.auth.signOut(); try { localStorage.removeItem(KEY); } catch (_) {}
        S = vazio(); user = null; telaLogin();
      }
      break;
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
          if (!d || typeof d !== 'object' || !(Array.isArray(d.lancs) || Array.isArray(d.gastos))) throw 0;
          confirmar('Substituir os dados atuais pelos do backup?', 'Substituir').then(ok => {
            if (ok) { S = migrar(d); salvar(); render(); toast('Backup restaurado'); }
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
  const el = e.target; if (el.dataset.act !== 'chave') return;
  try { localStorage.setItem(KEY_API, el.value.trim()); toast('Chave salva'); } catch (_) { toast('Não consegui salvar a chave'); }
});
document.addEventListener('click', e => {
  const b = e.target.closest('[data-login]'); if (b && sb) entrar(b.dataset.login);
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && sb && user && !pendenteNuvem) carregarNuvem().then(render);
});

async function iniciar() {
  if (garantirSeries()) salvar();
  if (!sb) { render(); return; }
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { telaLogin(); return; }
  user = session.user;
  render(); await carregarNuvem(); garantirSeries(); render();
}
iniciar();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
