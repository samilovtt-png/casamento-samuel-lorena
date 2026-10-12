const {test}=require('node:test');const assert=require('node:assert/strict');const {summarize,normalize}=require('../lib/painel');
test('counts individual guests without inferring sex from names; children are separate',()=>{
 const groups=[{id:'grupo001',nome:'Responsável',status:'confirmado',adultos:3,criancas:1,pessoas:[{nome:'Ana',categoria:'mulher',presente:true},{nome:'José',categoria:'homem',presente:false},{nome:'Alex',categoria:'nao_informado',presente:false},{nome:'Bia',categoria:'crianca',presente:true}]},{id:'grupo002',nome:'Antigo',status:'confirmado',adultos:2,criancas:1,pessoas:[]},{status:'cancelado',adultos:100,criancas:100}];
 const r=summarize(groups,[],[],[]);assert.deepEqual(r.resumo,{total:7,adultos:5,mulheres:1,homens:1,criancas:2,naoInformado:3,presentes:2,familias:2,recebido:0,pendente:0,pedidosPagos:0,pedidosPendentes:0});assert.equal(r.convidados.length,5);
});
test('money is in cents, paid transactions deduplicated, failed and pending orders are not received',()=>{
 const orders=[{id:1,status:'pago',valor_total:20000},{id:2,status:'pendente',valor_total:40000},{id:3,status:'erro_checkout',valor_total:50000},{id:4,status:'estornado',valor_total:30000}];
 const payments=[{id:1,pedido_id:1,status:'pago',transaction_nsu:'tx1',valor_pago:19000},{id:2,pedido_id:1,status:'pago',transaction_nsu:'tx1',valor_pago:19000},{id:3,pedido_id:2,status:'pendente',valor_pago:40000},{id:4,pedido_id:4,status:'pago',transaction_nsu:'refund',valor_pago:30000}];
 const r=summarize([],orders,payments,[{pedido_id:1,nome_presente:'Cafeteira',quantidade:1,valor_unitario:20000}]);assert.equal(r.resumo.recebido,19000);assert.equal(r.resumo.pendente,40000);assert.equal(r.resumo.pedidosPagos,1);assert.equal(r.pedidos[0].presentes[0].nome,'Cafeteira');
});
test('new RSVP ignores forged counts and arrival flags, validates names and categories',()=>{
 const row=normalize({id:'group-123',nome:'Maria',adultos:999,pessoas:[{nome:'João',categoria:'homem',presente:true},{nome:'Filho',categoria:'crianca'}]});assert.equal(row.adultos,1);assert.equal(row.criancas,1);assert.equal(row.pessoas[0].presente,false);assert.throws(()=>normalize({id:'group-123',nome:'Maria',pessoas:[{nome:'X',categoria:'homem'}]}));assert.throws(()=>normalize({id:'group-123',nome:'Maria',pessoas:[{nome:'José',categoria:'inventada'}]}));
});
test('unauthenticated and other authenticated users cannot access dashboard data',async()=>{
 process.env.SUPABASE_URL='https://example.test';process.env.SUPABASE_SERVICE_ROLE_KEY='test-server-only';delete require.cache[require.resolve('../api/_galeria')];delete require.cache[require.resolve('../api/painel-noivos')];const handler=require('../api/painel-noivos');const old=global.fetch;let calls=0;global.fetch=async url=>{calls++;assert.ok(url.endsWith('/auth/v1/user'));return {ok:true,json:async()=>({email:'outro@example.test',email_confirmed_at:'2026-01-01'})};};
 const response=()=>({code:200,headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(body){this.body=body;return this;}});
 try{let res=response();await handler({method:'GET',headers:{}},res);assert.equal(res.code,401);assert.equal(calls,0);assert.equal(res.headers['Cache-Control'],'private, no-store');res=response();await handler({method:'GET',headers:{authorization:'Bearer other'}},res);assert.equal(res.code,401);assert.equal(calls,1);}finally{global.fetch=old;}
});
