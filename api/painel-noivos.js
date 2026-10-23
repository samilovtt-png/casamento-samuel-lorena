const {ready,verify,api}=require('./_galeria');
const {summarize}=require('../lib/painel');
async function all(table,select){let rows=[];for(let offset=0;offset<20000;offset+=1000){const page=await api('/rest/v1/'+table+'?select='+select+'&order=id.asc&limit=1000&offset='+offset);rows.push(...page);if(page.length<1000)return rows;}throw Error('Volume excedido');}
module.exports=async(req,res)=>{
 if(req.query?.lista==='1')return require('../lib/lista-convidados-api')(req,res);
 res.setHeader('Cache-Control','private, no-store');res.setHeader('Vary','Authorization');
 if(!['GET','PATCH'].includes(req.method))return res.status(405).json({error:'Método inválido'});
 if(!ready())return res.status(503).json({error:'Painel indisponível'});
 try{
  if(!await verify(req))return res.status(401).json({error:'Entre com o acesso dos noivos.'});
  if(req.method==='PATCH'){
   const {id,index,presente,atualizadoEm}=req.body||{};
   if(typeof id!=='string'||!/^[a-zA-Z0-9-]{8,100}$/.test(id)||!Number.isInteger(index)||typeof presente!=='boolean'||typeof atualizadoEm!=='string')return res.status(400).json({error:'Dados inválidos'});
   const rows=await api('/rest/v1/confirmacoes_casamento?id=eq.'+encodeURIComponent(id)+'&select=*');const group=rows[0];
   if(!group||group.status!=='confirmado'||!group.pessoas[index])return res.status(404).json({error:'Convidado não encontrado'});
   if(group.atualizado_em!==atualizadoEm)return res.status(409).json({error:'Outro acesso atualizou este grupo. Atualize o painel.'});
   group.pessoas[index].presente=presente;
   const result=await api('/rest/v1/confirmacoes_casamento?id=eq.'+encodeURIComponent(id)+'&atualizado_em=eq.'+encodeURIComponent(atualizadoEm),{method:'PATCH',headers:{'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify({pessoas:group.pessoas,atualizado_em:new Date().toISOString()})});
   if(!result.length)return res.status(409).json({error:'Atualize o painel e tente novamente.'});return res.json({ok:true});
  }
  const [c,o,p,i]=await Promise.all([all('confirmacoes_casamento','*'),all('pedidos','id,created_at,order_nsu,nome_convidado,email_convidado,valor_total,status,forma_pagamento'),all('pagamentos','id,pedido_id,transaction_nsu,valor_pago,status,paid_at,metodo_pagamento'),all('itens_pedido','id,pedido_id,nome_presente,quantidade,valor_unitario')]);
  return res.json({...summarize(c,o,p,i),atualizadoEm:new Date().toISOString()});
 }catch(e){console.error('Painel noivos',e.message);return res.status(500).json({error:'Não foi possível carregar o painel. Tente novamente.'});}
};
