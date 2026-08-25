/** Google Apps Script — Samuel & Lorena — V30
 * Recebe confirmações de presença e doações por projeto.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (data.tipo === 'doacao') {
      let sh = ss.getSheetByName('Doacoes');
      if (!sh) sh = ss.insertSheet('Doacoes');
      if (sh.getLastRow() === 0) {
        sh.appendRow(['ID','Data/Hora','Nome','Projeto','Valor','Status','ID RSVP','Origem','Confirmado pelos noivos?','Observações']);
        sh.setFrozenRows(1);
      }
      const ids = sh.getLastRow() > 1 ? sh.getRange(2,1,sh.getLastRow()-1,1).getValues().flat() : [];
      const existing = ids.indexOf(data.id);
      const row = [data.id,new Date(),data.nome || '',data.projeto || '',Number(data.valor||0),data.status || 'Informada pelo convidado',data.rsvpId || '',data.origem || 'Site','',''];
      if (existing >= 0) sh.getRange(existing+2,1,1,row.length).setValues([row]);
      else sh.appendRow(row);
      sh.getRange('B:B').setNumberFormat('dd/mm/yyyy hh:mm');
      sh.getRange('E:E').setNumberFormat('R$ #,##0.00');
      return ContentService.createTextOutput(JSON.stringify({ok:true,id:data.id,tipo:'doacao'})).setMimeType(ContentService.MimeType.JSON);
    }

    let sh = ss.getSheetByName('Convidados');
    if (!sh) sh = ss.insertSheet('Convidados');
    if (sh.getLastRow() === 0) {
      sh.appendRow(['ID','Data/Hora','Nome','Família','Status RSVP','Adultos','Crianças','Valor','Mensagem','Origem']);
      sh.setFrozenRows(1);
    }
    const ids = sh.getLastRow() > 1 ? sh.getRange(2,1,sh.getLastRow()-1,1).getValues().flat() : [];
    const existing = ids.indexOf(data.id);
    const row = [data.id,new Date(),data.nome,data.familia || '',data.status || 'Confirmado',Number(data.adultos||0),Number(data.criancas||0),Number(data.valor||0),data.mensagem||'',data.origem||'Site'];
    if (existing >= 0) sh.getRange(existing+2,1,1,row.length).setValues([row]);
    else sh.appendRow(row);
    sh.getRange('B:B').setNumberFormat('dd/mm/yyyy hh:mm');
    sh.getRange('H:H').setNumberFormat('R$ #,##0.00');
    return ContentService.createTextOutput(JSON.stringify({ok:true,id:data.id,tipo:'rsvp'})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}
