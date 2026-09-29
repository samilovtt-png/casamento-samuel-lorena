module.exports=async function handler(req,res){
 if(req.method!=="POST") return res.status(405).json({error:"Método não permitido"});
 try{
  const {items}=req.body||{};
  if(!Array.isArray(items)||!items.length) return res.status(400).json({error:"Carrinho vazio"});
  const safe=items.map(x=>({quantity:Math.max(1,Number(x.quantity)||1),price:Math.round(Number(x.price)||0),description:String(x.description||"Presente de casamento").slice(0,120)}));
  if(safe.some(x=>x.price<=0)) return res.status(400).json({error:"Informe um valor válido para o presente"});
  const order_nsu="SL-"+Date.now();
  const origin="https://casamento-samuel-lorena.vercel.app";
  const payload={handle:"samuel-fernando7",items:safe,order_nsu,redirect_url:origin+"/pagamento-concluido"};
  const r=await fetch("https://api.checkout.infinitepay.io/links",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
  const data=await r.json().catch(()=>({}));
  if(!r.ok) return res.status(r.status).json({error:data.message||data.error||"Não foi possível gerar o pagamento",details:data});
  return res.status(200).json(data);
 }catch(e){return res.status(500).json({error:"Erro ao criar checkout InfinitePay"});}
}