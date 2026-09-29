module.exports=async function handler(req,res){
 if(req.method!=="POST") return res.status(405).json({error:"Método não permitido"});
 try{
  const {order_nsu,transaction_nsu,slug}=req.body||{};
  if(!order_nsu||!transaction_nsu||!slug) return res.status(400).json({error:"Dados de pagamento incompletos"});
  const r=await fetch("https://api.checkout.infinitepay.io/payment_check",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({handle:"samuel-fernando7",order_nsu,transaction_nsu,slug})});
  const data=await r.json().catch(()=>({}));
  if(!r.ok) return res.status(r.status).json({error:data.message||data.error||"Não foi possível verificar o pagamento"});
  return res.status(200).json({success:!!data.success,paid:!!data.paid,amount:data.amount,paid_amount:data.paid_amount,installments:data.installments,capture_method:data.capture_method});
 }catch(e){return res.status(500).json({error:"Erro ao verificar pagamento"});}
}