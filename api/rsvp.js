const crypto=require('node:crypto');const {ready,api}=require('./_galeria');const {normalize}=require('../lib/painel');
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({ok:false,error:'Método não permitido'});
 if(!ready())return res.status(503).json({ok:false,error:'Confirmação indisponível'});
 let row;try{row=normalize(req.body||{});}catch(e){return res.status(400).json({ok:false,error:e.message});}
 try{
  const hash=crypto.createHash('sha256').update(JSON.stringify(row)).digest('hex');
  const existing=await api('/rest/v1/confirmacoes_casamento?id=eq.'+encodeURIComponent(row.id)+'&select=hash_conteudo');
  if(existing.length)return existing[0].hash_conteudo===hash?res.json({ok:true,id:row.id}):res.status(409).json({ok:false,error:'Esta confirmação já foi registrada.'});
  const ip=String(req.headers['x-forwarded-for']||'unknown').split(',')[0].trim();
  const key=crypto.createHmac('sha256',process.env.SUPABASE_SERVICE_ROLE_KEY).update('rsvp:'+ip).digest('hex');
  if(!await api('/rest/v1/rpc/confirmacao_reservar_envio',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({p_chave:key})}))return res.status(429).json({ok:false,error:'Limite de confirmações atingido. Tente novamente em uma hora.'});
  // ON CONFLICT DO NOTHING: retries cannot overwrite attendee data or check-ins.
  await api('/rest/v1/confirmacoes_casamento?on_conflict=id',{method:'POST',headers:{'Content-Type':'application/json',Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify({...row,hash_conteudo:hash})});
  const saved=await api('/rest/v1/confirmacoes_casamento?id=eq.'+encodeURIComponent(row.id)+'&select=hash_conteudo');
  if(saved[0]?.hash_conteudo!==hash)return res.status(409).json({ok:false,error:'Esta confirmação já foi registrada.'});
  return res.json({ok:true,id:row.id});
 }catch(e){console.error('RSVP',e.message);return res.status(502).json({ok:false,error:'Não foi possível registrar. Tente novamente.'});}
};
