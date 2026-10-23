const {ready,verify,api}=require('./_galeria');
const {normalizeGuest}=require('../lib/lista-convidados');
const TABLE='/rest/v1/lista_convidados_casamento';
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','private, no-store');res.setHeader('Vary','Authorization');
 if(!['GET','POST','PATCH','DELETE'].includes(req.method))return res.status(405).json({error:'Método inválido'});
 if(!ready())return res.status(503).json({error:'Lista indisponível'});
 try{
  if(!await verify(req))return res.status(401).json({error:'Entre com o acesso dos noivos.'});
  if(req.method==='GET'){
   let rows=[];for(let offset=0;offset<20000;offset+=1000){const page=await api(TABLE+'?select=*&order=criado_em.asc,id.asc&limit=1000&offset='+offset);rows.push(...page);if(page.length<1000)return res.json({convidados:rows});}return res.status(413).json({error:'Lista muito extensa.'});
  }
  const body=req.body||{};let values;
  if(req.method==='POST'||(req.method==='PATCH'&&!body.restaurar)){try{values=normalizeGuest(body);}catch(e){return res.status(400).json({error:e.message});}}
  const headers={'Content-Type':'application/json',Prefer:'return=representation'};
  if(req.method==='POST'){const rows=await api(TABLE,{method:'POST',headers,body:JSON.stringify(values)});return res.status(201).json({convidado:rows[0]});}
  if(typeof body.id!=='string'||! /^[0-9a-f-]{36}$/i.test(body.id)||typeof body.atualizado_em!=='string'||!Number.isFinite(Date.parse(body.atualizado_em)))return res.status(400).json({error:'Registro inválido. Atualize a lista.'});
  const change=req.method==='DELETE'?{removido_em:new Date().toISOString()}:body.restaurar===true?{removido_em:null}:values;
  const rows=await api(TABLE+'?id=eq.'+encodeURIComponent(body.id)+'&atualizado_em=eq.'+encodeURIComponent(body.atualizado_em),{method:'PATCH',headers,body:JSON.stringify({...change,atualizado_em:new Date().toISOString()})});
  if(!rows.length)return res.status(409).json({error:'Este registro foi alterado em outro acesso. Atualize a lista e tente novamente.'});
  return res.json({convidado:rows[0]});
 }catch(e){console.error('Lista convidados',e.message);return res.status(502).json({error:'Não foi possível salvar ou carregar a lista. Tente novamente.'});}
};
