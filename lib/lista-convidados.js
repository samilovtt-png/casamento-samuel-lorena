function normalizeGuest(body){
 const text=(x,max)=>typeof x==='string'?x.trim().slice(0,max):'';
 const nome=text(body.nome,300),categoria=text(body.categoria,120),observacoes=text(body.observacoes,1000);
 const tipo=body.tipo||'convidado',situacao=body.situacao||'pendente';
 const quantidade=body.quantidade===null||body.quantidade===''?null:Number(body.quantidade);
 if(nome.length<2)throw Error('Informe o nome do convidado ou grupo.');
 if(!['convidado','equipe'].includes(tipo)||!['pendente','confirmado','nao_vai'].includes(situacao))throw Error('Selecione um tipo e uma situação válidos.');
 if(quantidade===null?tipo!=='equipe':!Number.isInteger(quantidade)||quantidade<1||quantidade>100)throw Error('Informe de 1 a 100 pessoas, ou deixe em branco para equipe sem quantidade definida.');
 if(typeof body.convite_enviado!=='boolean')throw Error('Informe se o convite foi enviado.');
 return {nome,categoria,observacoes,tipo,situacao,quantidade,convite_enviado:body.convite_enviado};
}
module.exports={normalizeGuest};
