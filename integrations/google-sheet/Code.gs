/**
 * Flow Score → Google Sheet
 *
 * Receives each completed Flow Score from flovoai.com/questionnaire and adds
 * it as a new row in this spreadsheet. Setup steps are in SETUP.md alongside
 * this file.
 *
 * The header row is created automatically the first time a result arrives.
 */

const SHEET_NAME = 'Flow Score';

const HEADERS = [
  'Submitted', 'Name', 'Email', 'Company',
  'Flow Score', 'Winning work %', 'Doing the work %', 'Getting paid & admin %',
  'Industry', 'Business type', 'Team size', 'Turnover', 'Main goal',
  'Admin hrs/week', 'Hourly cost (£)', 'Admin cost (£/year)',
  'All answers', 'Page',
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Ignore spam: bots fill in the hidden "website" field; real visitors don't
    if (d.website) return ok_();
    // Ignore anything without a name and a valid-looking email
    if (!d.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.email || ''))) return ok_();

    const answers = Object.keys(d.answers || {})
      .map(function (id) { const a = d.answers[id]; return a.question + '\n→ ' + a.answer; })
      .join('\n\n');

    getSheet_().appendRow([
      new Date(),
      text_(d.name), text_(d.email), text_(d.company),
      num_(d.score), num_(d.win_score), num_(d.do_score), num_(d.paid_score),
      text_(d.industry), text_(d.business_type), text_(d.team_size), text_(d.turnover), text_(d.goal),
      num_(d.admin_hours), num_(d.hourly_cost), num_(d.admin_cost_year),
      text_(answers, 5000), text_(d.page),
    ]);
  } catch (err) {
    console.error(err);
  } finally {
    lock.releaseLock();
  }
  return ok_();
}

/** Run this once from the editor to check everything works (adds a test row). */
function testSetup() {
  doPost({ postData: { contents: JSON.stringify({
    name: 'Test Person', email: 'test@example.com', company: 'Test Ltd',
    score: 64, win_score: 70, do_score: 55, paid_score: 67,
    industry: 'Trades & construction', business_type: 'Joinery & carpentry',
    team_size: '2 to 5 people', turnover: '£100k to £500k', goal: 'Win more work',
    admin_hours: 12, hourly_cost: 20, admin_cost_year: 11500,
    answers: { example: { question: 'This is a test row', answer: 'You can delete it' } },
    page: 'testSetup',
  }) } });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

// Text is trimmed to a sensible length, and anything that could be read as a
// spreadsheet formula (starting with = + - @) is stored as plain text.
function text_(v, max) {
  if (v === null || v === undefined) return '';
  const s = String(v).slice(0, max || 500);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function num_(v) {
  const n = Number(v);
  return v === null || v === undefined || v === '' || isNaN(n) ? '' : n;
}

function ok_() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
