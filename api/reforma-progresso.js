// Progresso público: somente totais agregados de cotas de Reforma e Mobília pagas.
// Nunca expor nomes de convidados, pedidos, transações ou chaves do Supabase.
const BASE=process.env.SUPABASE_URL,KEY=process.env.SUPABASE_SERVICE_ROLE_KEY;
const META_CENTAVOS=5000000;
module.exports=async function handler(req,res){
 if(req.method!=="GET")return res.status(405).json({error:"Método não permitido"});
 if(!BASE||!KEY)return res.status(503).json({error:"Serviço indisponível"});
 try{
  let total=0,offset=0;
  for(let page=0;page<100;page++){
   const url=BASE+"/rest/v1/itens_pedido?select=nome_presente,quantidade,valor_unitario,pedidos!inner(status)&pedidos.status=eq.pago&nome_presente=like."+encodeURIComponent("Cota Reforma e Mobília*")+"&order=id.asc&limit=1000&offset="+offset;
   const r=await fetch(url,{headers:{apikey:KEY}});
   if(!r.ok)throw Error("Consulta de progresso falhou: "+r.status);
   const rows=await r.json();
   if(!Array.isArray(rows))throw Error("Resposta inválida");
   for(const item of rows){
    const quantity=Number(item.quantidade),unit=Number(item.valor_unitario);
    if(!Number.isSafeInteger(quantity)||quantity<1||!Number.isSafeInteger(unit)||unit<0)throw Error("Valor inválido");
    total+=quantity*unit;
    if(!Number.isSafeInteger(total))throw Error("Total inválido");
   }
   if(rows.length<1000)break;
   offset+=1000;
   if(page===99)throw Error("Paginação excedida");
  }
  res.setHeader("Cache-Control","public, s-maxage=60, stale-while-revalidate=120");
  return res.status(200).json({percentual:Math.min(100,Math.round(total/META_CENTAVOS*1000)/10)});
 }catch(e){console.error("Reforma progresso:",e.message);return res.status(503).json({error:"Progresso temporariamente indisponível"});}
};
