/**
 * M Designe Ivanjica — backend za upite sa sajta
 * -----------------------------------------------
 * Upisuje svaki upit iz wizard forme (kontakt.html) u vezanu Google tabelu
 * i šalje jedno obaveštenje mejlom.
 *
 * Sajt šalje GET sa parametrima u adresi (site/js/main.js, forma "wizard").
 * Apps Script svaki POST preusmeri na sesijsku adresu i pretvori ga u GET,
 * čime se gubi e.postData, pa je GET jedini pouzdan put. doPost je ostavljen
 * za slučaj da front ikad promeni na JSON telo.
 */

/* ================= PODEŠAVANJA ================= */

// Dok se testira, obaveštenja idu na tvoju adresu. Tek kad vidiš da mejl
// stiže i izgleda kako treba, ovde ide mdesigneivanjica@gmail.com i pusti se
// Deploy > Manage deployments > New version.
var NOTIFY_TO   = 'pavlegosic9@gmail.com';
var SENDER_NAME = 'M Designe sajt';
var BRAND       = 'M Designe Ivanjica';
// Tabela sa upitima, link stoji u podnožju svakog mejla. Prazno ga sakriva.
var SHEET_URL   = '';
// Prazno kad je skripta vezana za tabelu. Popuniti samo ako je samostalna.
var SHEET_ID    = '';

/* ================= PALETA =================
   Boje su iz site/css/styles.css, ne izmišljene:
     krem podloga    #faf6ed   (--cream)
     mastilo         #121212   (--ink)
     akcenat terakota #c27d60  (--accent)
     akcenat tamniji  #a5654a  (--accent-dark)
     prigušeno        #6e6a65  (--muted)
     linije           #e4e1db  (--line)

   Kontrast: belo na #a5654a (dugme) = 4.6:1, prolazi AA za podebljan tekst. */

var C = {
  page:      '#faf6ed',
  card:      '#FFFFFF',
  panel:     '#f3eae0',
  line:      '#e4e1db',
  brand:     '#c27d60',
  brandDark: '#a5654a',
  ink:       '#121212',
  body:      '#4a4a4a',
  muted:     '#6e6a65',
  onBrand:   '#FFFFFF'
};

// Zaobljenja. Outlook na Windowsu ih poravna, ništa nosivo ne visi o njima.
var RADIUS = '16px';
var RPILL  = '8px';

// Jedno pismo. Veb fontovi se u mejlu ne učitavaju.
var SANS = 'Helvetica,Arial,sans-serif';

/* ================= ULAZ ================= */

function doGet(e) {
  var d = readParams_(e);
  if (!d.ime && !d.email && !d.poruka) {
    return json_({ ok: true, service: BRAND + ' endpoint za upite' });
  }
  return handle_(d);
}

function doPost(e) {
  var d = readParams_(e);
  if (e && e.postData && e.postData.contents) {
    try {
      var body = JSON.parse(e.postData.contents);
      for (var k in body) if (body[k]) d[k] = body[k];
    } catch (err) { /* nije JSON, parametri su već pročitani */ }
  }
  return handle_(d);
}

function handle_(d) {
  var sheetErr = '';
  // Namerno razdvojeno: neuspeo upis u tabelu ne sme da košta upit.
  try { saveRow_(d); } catch (err) { sheetErr = String(err); }
  try {
    sendEmail_(d);
  } catch (err) {
    return json_({ ok: false, error: String(err), sheetError: sheetErr });
  }
  return json_({ ok: true, sheetError: sheetErr });
}

/**
 * Imena parametara su tačno ona koja šalje site/js/main.js (submit wizard-a):
 *   kategorija, velicina, paket, rok, lokacija, ime, telefon, email,
 *   poruka, strana, poslato
 */
function readParams_(e) {
  var p = (e && e.parameter) ? e.parameter : {};
  return {
    ime:        p.ime        || '',
    telefon:    p.telefon    || '',
    email:      p.email      || '',
    kategorija: p.kategorija || '',
    velicina:   p.velicina   || '',
    paket:      p.paket      || '',
    rok:        p.rok        || '',
    lokacija:   p.lokacija   || '',
    poruka:     p.poruka     || '',
    strana:     p.strana     || '',
    poslato:    p.poslato    || ''
  };
}

/* ================= TABELA ================= */

function saveRow_(d) {
  var ss = SHEET_ID
    ? SpreadsheetApp.openById(SHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Nema tabele: veži skriptu za tabelu ili postavi SHEET_ID.');
  var sheet = ss.getSheets()[0];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Stiglo', 'Ime', 'Telefon', 'Email', 'Kategorija',
                     'Veličina', 'Paket', 'Rok', 'Lokacija', 'Poruka', 'Strana']);
    sheet.getRange(1, 1, 1, 11).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    new Date(),
    d.ime || '', d.telefon || '', d.email || '', d.kategorija || '',
    d.velicina || '', d.paket || '', d.rok || '', d.lokacija || '',
    d.poruka || '', d.strana || ''
  ]);
}

/* ================= MEJL ================= */

function sendEmail_(d) {
  MailApp.sendEmail(NOTIFY_TO, buildSubject_(d), buildPlain_(d), {
    name: SENDER_NAME,
    htmlBody: buildHtml_(d),
    replyTo: d.email || undefined   // odgovor ide pravo podnosiocu upita
  });
}

function buildSubject_(d) {
  var ko  = d.ime || 'Novi kontakt';
  var tail = d.kategorija ? ' (' + d.kategorija + ')' : '';
  return 'Novi upit, M Designe: ' + ko + tail;
}

function buildPlain_(d) {
  return [
    'NOVI UPIT SA SAJTA M DESIGNE IVANJICA',
    '',
    'Ime:         ' + (d.ime || ''),
    'Telefon:     ' + (d.telefon || ''),
    'Email:       ' + (d.email || ''),
    'Kategorija:  ' + (d.kategorija || ''),
    'Veličina:    ' + (d.velicina || ''),
    'Paket:       ' + (d.paket || ''),
    'Rok:         ' + (d.rok || ''),
    'Lokacija:    ' + (d.lokacija || ''),
    '',
    'PORUKA',
    (d.poruka || '(nije upisana)'),
    '',
    'Stiglo sa wizard obrasca na sajtu' + (d.strana ? ' (' + d.strana + ')' : '') + '.'
  ].join('\n');
}

/**
 * Pravila su namerna, videti reference/gotchas.md uz skill:
 *  - samo tabele i inline stilovi, bez flex/grid, bez veb fontova, bez slika
 *  - !important na svakoj boji i bgcolor na svakom bloku, da Gmail i
 *    Outlook.com u tamnom režimu ne preboje mejl
 *  - color-scheme meta sprečava Apple Mail da sam invertuje
 *  - dugmad su tabelarne ćelije sa razmakom, ne stilizovani linkovi
 */
function buildHtml_(d) {
  var ime = d.ime || 'Neko';

  // Dugme se pojavljuje samo kad je vrednost upotrebljiva.
  var cifre = String(d.telefon || '').replace(/[^\d+]/g, '');
  var zove  = cifre.replace(/\D/g, '').length >= 6;
  var tel   = 'tel:' + cifre;
  var pise  = /.+@.+\..+/.test(String(d.email || ''));

  var rows = [
    ['Ime',        d.ime],
    ['Telefon',    d.telefon, zove ? tel : ''],
    ['Email',      d.email, pise ? 'mailto:' + esc_(d.email) : ''],
    ['Kategorija', d.kategorija],
    ['Veličina',   d.velicina],
    ['Paket',      d.paket],
    ['Rok',        d.rok],
    ['Lokacija',   d.lokacija]
  ].filter(function (r) { return r[1]; }).map(function (r, i, all) {
    var border = (i === all.length - 1) ? '' : 'border-bottom:1px solid ' + C.line + ';';
    var value = r[2]
      ? '<a href="' + r[2] + '" style="color:' + C.ink + ' !important;text-decoration:none;' +
        'border-bottom:1px solid ' + C.line + ';">' + esc_(r[1]) + '</a>'
      : esc_(r[1]);
    return '<tr>' +
      '<td bgcolor="' + C.card + '" width="120" style="background-color:' + C.card + ' !important;' + border +
        'padding:15px 16px 15px 0;color:' + C.muted + ' !important;font:700 11px/1.35 ' + SANS + ';' +
        'letter-spacing:.13em;text-transform:uppercase;vertical-align:top;">' + r[0] + '</td>' +
      '<td bgcolor="' + C.card + '" style="background-color:' + C.card + ' !important;' + border +
        'padding:13px 0;color:' + C.ink + ' !important;font:400 17px/1.45 ' + SANS + ';">' + value + '</td>' +
    '</tr>';
  }).join('');

  var panel =
    '<tr><td bgcolor="' + C.panel + '" style="background-color:' + C.panel + ' !important;' +
      'border-left:3px solid ' + C.brand + ';border-radius:' + RPILL + ';padding:20px 22px;">' +
      '<div style="color:' + C.muted + ' !important;font:700 11px/1.2 ' + SANS + ';letter-spacing:.13em;' +
        'text-transform:uppercase;padding-bottom:10px;">Poruka</div>' +
      '<div style="color:' + C.body + ' !important;font:400 16px/1.65 ' + SANS + ';white-space:pre-wrap;">' +
        esc_(d.poruka || 'Poruka nije upisana.') + '</div>' +
    '</td></tr>';

  var solid = function (href, label) {
    return '<td bgcolor="' + C.brandDark + '" style="background-color:' + C.brandDark + ' !important;' +
      'border-radius:' + RPILL + ';padding:15px 30px;">' +
      '<a href="' + href + '" style="color:' + C.onBrand + ' !important;text-decoration:none;' +
      'font:700 13px/1 ' + SANS + ';letter-spacing:.1em;text-transform:uppercase;">' + label + '</a></td>';
  };
  var ghost = function (href, label) {
    return '<td bgcolor="' + C.card + '" style="background-color:' + C.card + ' !important;' +
      'border:1px solid ' + C.line + ';border-radius:' + RPILL + ';padding:14px 28px;">' +
      '<a href="' + href + '" style="color:' + C.ink + ' !important;text-decoration:none;' +
      'font:700 13px/1 ' + SANS + ';letter-spacing:.1em;text-transform:uppercase;">' + label + '</a></td>';
  };
  var mailHref = 'mailto:' + esc_(d.email) + '?subject=' +
    encodeURIComponent('Odgovor na vaš upit — M Designe');

  /* Natpisi bez imena. Srpski traži akuzativ ("pozovi Marka", ne "Marko"),
     a promena po padežima za proizvoljno ime nije pouzdana, pa ime ostaje
     u zaglavlju mejla gde stoji u nominativu. */
  var buttons = '';
  if (zove && pise) {
    buttons = solid(tel, 'Pozovi') +
      '<td width="10" style="width:10px;">&nbsp;</td>' + ghost(mailHref, 'Odgovori mejlom');
  } else if (zove) {
    buttons = solid(tel, 'Pozovi');
  } else if (pise) {
    buttons = solid(mailHref, 'Odgovori mejlom');
  }

  // Bez upotrebljivog kontakta red se izostavlja, da ne stoji prazna traka.
  var actions = buttons
    ? '<tr><td class="pad" bgcolor="' + C.card + '" style="background-color:' + C.card + ' !important;padding:28px 40px 38px;">' +
      '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' + buttons + '</tr></table>' +
      '</td></tr>'
    : '<tr><td bgcolor="' + C.card + '" style="background-color:' + C.card + ' !important;height:34px;font-size:0;line-height:0;">&nbsp;</td></tr>';

  return '' +
'<!DOCTYPE html><html><head><meta charset="utf-8">' +
'<meta name="viewport" content="width=device-width,initial-scale=1">' +
'<meta name="color-scheme" content="light dark">' +
'<meta name="supported-color-schemes" content="light dark">' +
'<style>:root{color-scheme:light dark;supported-color-schemes:light dark;}' +
'@media (max-width:600px){.pad{padding-left:24px !important;padding-right:24px !important;}' +
'.hd{font-size:26px !important;}}</style></head>' +
'<body style="margin:0;padding:0;background-color:' + C.page + ' !important;" bgcolor="' + C.page + '">' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ' +
  'bgcolor="' + C.page + '" style="background-color:' + C.page + ' !important;">' +
'<tr><td align="center" style="padding:32px 12px 44px;">' +

  '<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ' +
    'style="width:100%;max-width:600px;">' +

  '<tr><td style="padding:0;">' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ' +
    'bgcolor="' + C.card + '" style="background-color:' + C.card + ' !important;' +
    'border:1px solid ' + C.line + ';border-radius:' + RADIUS + ';">' +

    '<tr><td class="pad" bgcolor="' + C.card + '" style="background-color:' + C.card + ' !important;' +
      'border-top:4px solid ' + C.brand + ';border-radius:' + RADIUS + ' ' + RADIUS + ' 0 0;padding:34px 40px 28px;">' +
      '<div style="color:' + C.brand + ' !important;font:700 11px/1.2 ' + SANS + ';letter-spacing:.2em;' +
        'text-transform:uppercase;">' + esc_(BRAND) + '</div>' +
      '<div class="hd" style="color:' + C.ink + ' !important;font:700 32px/1.15 ' + SANS + ';' +
        'letter-spacing:-.01em;padding-top:14px;">Novi upit</div>' +
      '<div style="color:' + C.muted + ' !important;font:400 15px/1.5 ' + SANS + ';padding-top:10px;">' +
        esc_(ime) + (d.kategorija ? ' &middot; ' + esc_(d.kategorija) : '') + '</div>' +
    '</td></tr>' +

    (rows ? '<tr><td class="pad" bgcolor="' + C.card + '" style="background-color:' + C.card + ' !important;padding:0 40px;">' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ' +
        'bgcolor="' + C.card + '" style="background-color:' + C.card + ' !important;' +
        'border-top:1px solid ' + C.line + ';">' + rows + '</table>' +
    '</td></tr>' : '') +

    '<tr><td class="pad" bgcolor="' + C.card + '" style="background-color:' + C.card + ' !important;padding:26px 40px 0;">' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' + panel + '</table>' +
    '</td></tr>' +

    actions +

  '</table></td></tr>' +

    '<tr><td class="pad" bgcolor="' + C.page + '" style="background-color:' + C.page + ' !important;padding:20px 40px 0;">' +
      '<div style="color:' + C.muted + ' !important;font:700 11px/1.7 ' + SANS + ';letter-spacing:.12em;' +
        'text-transform:uppercase;word-break:break-word;overflow-wrap:break-word;">Obrazac na sajtu' +
        (d.strana ? ' &nbsp;&middot;&nbsp; ' + esc_(d.strana) : '') + '</div>' +
      (SHEET_URL ? '<div style="padding-top:8px;"><a href="' + SHEET_URL + '" ' +
        'style="color:' + C.muted + ' !important;font:400 12px/1.7 ' + SANS + ';' +
        'text-decoration:underline;">Otvori tabelu sa svim upitima</a></div>' : '') +
    '</td></tr>' +

  '</table>' +
  '<!--[if mso]></td></tr></table><![endif]-->' +
'</td></tr></table></body></html>';
}

/* ================= POMOĆNE ================= */

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function esc_(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
