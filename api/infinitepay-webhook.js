const HANDLE="samuel-fernando7";
module.exports=async function handler(req,res){
 if(req.method!=="POST")return res.status(405).json({error:"Método não permitido"});
 const b=req.body||{};
 const order_nsu=String(b.order_nsu||"");
 const transaction_nsu=String(b.transaction_nsu||"");
 const slug=String(b.invoice_slug||b.slug||"");
 if(!/^SL-[a-zA-Z0-9-]{8,80}$/.test(order_nsu)||!transaction_nsu||!slug)return res.status(400).json({error:"Dados incompletos"});
 try{
  const r=await fetch("https://api.checkout.infinitepay.io/payment_check",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({handle:HANDLE,order_nsu,transaction_nsu,slug})});
  const data=await r.json().catch(()=>({}));
  if(!r.ok||data.success!==true||data.paid!==true)return res.status(400).json({error:"Pagamento não confirmado"});
  // Ainda não registra como pago: requer armazenamento persistente e comparação com pedido original.
  console.log("Pagamento validado na InfinitePay; aguardando persistência segura",JSON.stringify({order_nsu,transaction_nsu,slug,amount:data.amount}));
  return res.status(200).json({received:true,verified:true,recorded:false});
 }catch(e){return res.status(400).json({error:"Falha ao verificar pagamento"});}
};