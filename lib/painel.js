const categories=['mulher','homem','crianca','nao_informado'];
function normalize(body){
 const text=(v,max)=>typeof v==='string'?v.trim().slice(0,max):'';
 const nome=text(body.nome,120),id=text(body.id,100);
 if(!/^[a-zA-Z0-9-]{8,100}$/.test(id)||nome.length<2)throw Error('Informe seu nome completo.');
 const pessoas=body.pessoas;
 let adultos,criancas,safe=[];
 if(pessoas!==undefined){
  if(!Array.isArray(pessoas)||pessoas.length<1||pessoas.length>30)throw Error('Informe de 1 a 30 convidados.');
  safe=pessoas.map(p=>{const nome=text(p.nome,120);if(nome.length<2||!categories.includes(p.categoria))throw Error('Preencha o nome e a categoria de cada convidado.');if(p.alimentacao!==undefined&&!['come_carne','vegetariano','nao_informado'].includes(p.alimentacao))throw Error('Selecione uma opção de alimentação válida.');return {nome,categoria:p.categoria,presente:false,...(p.alimentacao!==undefined?{alimentacao:p.alimentacao}:{})};});
  criancas=safe.filter(p=>p.categoria==='crianca').length;adultos=safe.length-criancas;
 }else{
  adultos=Number(body.adultos);criancas=Number(body.criancas);
  if(!Number.isInteger(adultos)||!Number.isInteger(criancas)||adultos<0||criancas<0||adultos+criancas<1||adultos+criancas>30)throw Error('Quantidade de convidados inválida.');
 }
 return {id,nome,adultos,criancas,pessoas:safe,mensagem:text(body.mensagem,1000),familia:text(body.familia,120)};
}
function summarize(confirmacoes,pedidos,pagamentos,itens){
 const counts={total:0,adultos:0,mulheres:0,homens:0,criancas:0,naoInformado:0,presentes:0,familias:0};
 const convidados=[];
 for(const group of confirmacoes){
  if(group.status!=='confirmado')continue;
  counts.familias++;counts.adultos+=group.adultos;counts.criancas+=group.criancas;counts.total+=group.adultos+group.criancas;
  const people=Array.isArray(group.pessoas)?group.pessoas:[];
  if(!people.length){counts.naoInformado+=group.adultos;convidados.push({grupoId:group.id,nome:group.nome,categoria:'grupo_legado',familia:group.familia||group.nome,presente:false,criadoEm:group.criado_em,quantidade:group.adultos+group.criancas});continue;}
  for(const [index,p] of people.entries()){
   if(p.categoria==='mulher')counts.mulheres++;else if(p.categoria==='homem')counts.homens++;else if(p.categoria==='nao_informado')counts.naoInformado++;
   if(p.presente)counts.presentes++;
   convidados.push({...p,grupoId:group.id,index,familia:group.familia||group.nome,criadoEm:group.criado_em});
  }
 }
 const amounts=new Map(),seen=new Set();
 for(const p of pagamentos){if(p.status!=='pago')continue;const key=p.transaction_nsu||'id:'+p.id;if(seen.has(key))continue;seen.add(key);amounts.set(String(p.pedido_id),(amounts.get(String(p.pedido_id))||0)+Number(p.valor_pago||0));}
 const orders=pedidos.map(p=>{const gifts=itens.filter(i=>String(i.pedido_id)===String(p.id));const excluido=['estornado','cancelado','reembolsado'].includes(p.status);const recebido=excluido?0:(amounts.get(String(p.id))||(p.status==='pago'?Number(p.valor_total):0));return {...p,recebido,presentes:gifts.map(i=>({nome:i.nome_presente,quantidade:i.quantidade,valor:i.valor_unitario})),situacao:excluido?p.status:recebido>0?'pago':p.status||'pendente'};});
 const recebido=orders.reduce((s,o)=>s+o.recebido,0),pendente=orders.filter(o=>o.situacao==='pendente').reduce((s,o)=>s+Number(o.valor_total),0);
 return {resumo:{...counts,recebido,pendente,pedidosPagos:orders.filter(o=>o.recebido>0).length,pedidosPendentes:orders.filter(o=>o.situacao==='pendente').length},convidados,pedidos:orders,confirmacoes};
}
module.exports={normalize,summarize};
