/**
 * 차BTI 설문 집계 — Google Apps Script
 * 사용법은 "집계_설정가이드.md" 참고.
 * 구글 스프레드시트 > 확장 프로그램 > Apps Script 에 이 코드를 통째로 붙여넣고 배포하세요.
 */

var LOG_SHEET  = '이벤트로그';   // 모든 행동이 한 줄씩 쌓이는 원본 로그
var DONE_SHEET = '완료응답';     // 설문을 끝까지 마친 사람만 (문항별 선택 포함)

/* 브라우저(설문 페이지)가 데이터를 보낼 때 실행됨 */
function doPost(e){
  var lock = LockService.getScriptLock();      // 동시 접속 충돌 방지
  try{
    lock.waitLock(20000);
    var d = JSON.parse(e.postData.contents);
    logEvent(d);
    if(d.event === 'complete') logCompletion(d);
    return json({ok:true});
  }catch(err){
    return json({ok:false, error:String(err)});
  }finally{
    try{ lock.releaseLock(); }catch(e2){}
  }
}

/* 웹앱 URL을 브라우저에서 그냥 열면 지금까지 요약(접속/시작/완료 수)을 보여줌 */
function doGet(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var log = ss.getSheetByName(LOG_SHEET);
  var out = {접속수:0, 시작수:0, 완료수:0, 완료율:'0%'};
  if(log && log.getLastRow() > 1){
    var vals = log.getDataRange().getValues();
    var v={}, s={}, c={};
    for(var r=1; r<vals.length; r++){
      var ev = vals[r][1], sess = vals[r][3];
      if(ev==='view')     v[sess]=1;
      if(ev==='start')    s[sess]=1;
      if(ev==='complete') c[sess]=1;
    }
    out.접속수 = Object.keys(v).length;
    out.시작수 = Object.keys(s).length;
    out.완료수 = Object.keys(c).length;
    out.완료율 = out.접속수 ? Math.round(out.완료수/out.접속수*100)+'%' : '0%';
  }
  return json(out);
}

function logEvent(d){
  var sh = getSheet(LOG_SHEET,
    ['시각','이벤트','방문자','세션','문항','선택','축','유형코드','예산대','선택지문구','유입경로','User-Agent','URL']);
  sh.appendRow([
    d.ts||new Date(), d.event||'', d.visitor||'', d.session||'',
    d.q||'', d.choice||'', d.axis||'', d.code||'', d.band||'',
    d.text||'', d.ref||'', d.ua||'', d.url||''
  ]);
}

function logCompletion(d){
  var a = d.answers || [];
  var sh = getSheet(DONE_SHEET,
    ['시각','방문자','세션','유형코드','Q1','Q2','Q3','Q4','Q5','Q6','Q7','Q8','유형명']);
  // 이미 만들어둔 시트에 '유형명'(M열) 헤더가 없으면 추가
  if(sh.getRange(1,13).getValue() !== '유형명') sh.getRange(1,13).setValue('유형명');
  var row = [d.ts||new Date(), d.visitor||'', d.session||'', d.code||''];
  for(var k=0; k<8; k++) row.push(a[k]||'');
  row.push(d.name||'');   // M열: 결과 유형명 (예: 가성비 드라이버)
  sh.appendRow(row);
}

function getSheet(name, headers){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if(!sh){ sh = ss.insertSheet(name); sh.appendRow(headers); }
  else if(sh.getLastRow() === 0){ sh.appendRow(headers); }
  return sh;
}

function json(obj){
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
