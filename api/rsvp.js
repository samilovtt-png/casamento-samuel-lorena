module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Método não permitido' });
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbyZfxQ-cecnDXAQkwDarlK2RwTE-zoEefNLFgrvevS12tsjJ7GyMV3uJSVM5LqI2tVo6Q/exec';
  try {
    const body = req.body || {};
    if (!body.nome || Number(body.adultos || 0) + Number(body.criancas || 0) < 1) {
      return res.status(400).json({ok:false,error:'Dados de confirmação inválidos'});
    }
    const upstream = await fetch(url, {
      method:'POST',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify(body),
      redirect:'follow'
    });
    const text = await upstream.text();
    let data; try { data = JSON.parse(text); } catch { data = {ok:upstream.ok}; }
    if (!upstream.ok || data.ok === false) throw new Error(data.error || 'Falha na planilha');
    return res.status(200).json({ok:true,id:body.id});
  } catch (e) {
    console.error(e);
    return res.status(502).json({ok:false,error:'Falha ao gravar na planilha'});
  }
}
