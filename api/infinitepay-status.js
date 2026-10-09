const HANDLE="samuel-fernando7";
module.exports=async function handler(req,res){
 if(req.method!=="POST")return res.status(405).json({error:"Método não permitido"});
 const {order_nsu,transaction_nsu,slug}=req.body||{};
 if(!/^SL-[a-zA-Z0-9-]{8,80}$/.test(String(order_nsu||""))||!transaction_nsu||!slug)return res.status(400).json({error:"Identificadores incompletos"});
 try{
  const r=await fetch("https://api.checkout.infinitepay.io/payment_check",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({handle:HANDLE,order_nsu,transaction_nsu,slug})});
  const d=await r.json().catch(()=>({}));
  if(!r.ok||d.success!==true)return res.status(502).json({error:"Não foi possível confirmar o pagamento"});
  return res.status(200).json({paid:d.paid===true,capture_method:d.capture_method||null});
 }catch(e){return res.status(502).json({error:"Consulta indisponível"});}
};