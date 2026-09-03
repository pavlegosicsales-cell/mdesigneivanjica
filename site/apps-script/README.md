# Apps Script backend za wizard formu

`Code.gs` upisuje svaki upit sa `kontakt.html` u Google tabelu i šalje jedno
obaveštenje mejlom Marku. Vidi puno uputstvo za postavljanje u poruci gde je
ovaj fajl predat (ili pitaj Claude ponovo — postupak je uvek isti, ispod je
skraćena verzija).

## Stanje: povezano i testirano (03.09.2026)

Skripta je deploy-ovana, `ENDPOINT` u `site/js/main.js` je popunjen, a test
upit je potvrđeno stigao i na mejl i u tabelu.

Tabela je napravljena preko naloga `pavlegosic.sales@gmail.com`, obaveštenja
za sada idu na `pavlegosic9@gmail.com` (`NOTIFY_TO`).

## Ako treba ponovo postaviti

1. Google tabela > **Extensions > Apps Script**, nalepi `Code.gs`.
2. **Deploy > New deployment > Web app**. Execute as: **Me**. Who has
   access: **Anyone** (ne "Anyone with Google account", inače sajt dobija 404).
3. Kopiraj `/exec` URL u `ENDPOINT` na vrhu `site/js/main.js`, pa `node build.js`.
4. Prvi put obavezno pogledaj **Executions** panel u editoru posle test upita:
   tamo se vidi da li je skripta stvarno odradila ili je pala.

## Prelazak na Marka

Kad je sve potvrđeno: `NOTIFY_TO = 'mdesigneivanjica@gmail.com'`, pa
**Deploy > Manage deployments > uredi postojeći > New version** (samo čuvanje
skripte ne ažurira živi URL — mora nova verzija).

## Ograničenje

Sajt šalje `mode:'no-cors'`, pa front-end ne može da pročita odgovor —
poruka "Upit je poslat" se prikazuje bez obzira da li je slanje stvarno
uspelo. Ako ikad zatreba pouzdana potvrda, rešenje je JSONP.
