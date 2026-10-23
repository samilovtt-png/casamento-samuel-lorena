function normalizeExpense(body){
 const text=(x,max)=>typeof x==='string'?x.trim().slice(0,max):'';
 const item=text(body.item,300),categoria=text(body.categoria,120),observacoes=text(body.observacoes,1000),tipo=body.tipo||'gasto';
 if(item.length<2)throw Error('Informe a descrição do gasto.');
 if(!['gasto','caucao'].includes(tipo))throw Error('Selecione um tipo válido.');
 const amount=k=>{const n=body[k];if(n===null||n===undefined||n==='')return null;if(!Number.isSafeInteger(n)||n<0||n>10000000000)throw Error('Informe valores válidos, com até duas casas decimais.');return n;};
 return {item,categoria,tipo,observacoes,previsto_centavos:amount('previsto_centavos'),pago_centavos:amount('pago_centavos')};
}
function expenseStatus(p){if(p.previsto_centavos===null)return 'a_definir';const paid=p.pago_centavos||0;if(paid>p.previsto_centavos)return 'credito';if(paid===p.previsto_centavos)return 'pago';return paid>0?'parcial':'pendente';}
function budgetSummary(rows){const active=rows.filter(p=>!p.removido_em),sum=(rows,key)=>rows.reduce((s,p)=>s+Number(p[key]||0),0);return {previsto:sum(active,'previsto_centavos'),pago:sum(active,'pago_centavos'),aPagar:active.reduce((s,p)=>s+(p.previsto_centavos===null?0:Math.max(0,p.previsto_centavos-(p.pago_centavos||0))),0),credito:active.reduce((s,p)=>s+(p.previsto_centavos===null?0:Math.max(0,(p.pago_centavos||0)-p.previsto_centavos)),0),fixo:sum(active.filter(p=>p.tipo==='gasto'),'previsto_centavos'),caucao:sum(active.filter(p=>p.tipo==='caucao'),'previsto_centavos'),aDefinir:active.filter(p=>p.previsto_centavos===null).length,itens:active.length};}
module.exports={normalizeExpense,expenseStatus,budgetSummary};
