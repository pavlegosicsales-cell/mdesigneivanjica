# M Designe Ivanjica — sajt

Statički sajt. Nema baze, nema WordPressa. Stranice modela i kategorija se
generišu iz jednog JSON fajla, pa su brze i vidljive na Google-u, a sadržaj se
menja bez diranja HTML-a.

## Pregled uživo

```
cd site
npx http-server -p 8790 -c-1
```
Otvori `http://localhost:8790`

## Kako se menja sadržaj

Sve što se menja u svakodnevnom radu je u **`data/modeli.json`**:

- cene modela
- dimenzije i specifikacije
- opisi i namena
- doplate
- pitanja i odgovori (FAQ)
- telefon, email, linkovi na mreže

Posle svake izmene pokreni:

```
node build.js
```

Regenerišu se sve stranice kategorija, sve stranice modela, `sitemap.xml` i
`robots.txt`. Ništa se ne radi ručno.

### Dodavanje novog modela

U `data/modeli.json`, u niz `modeli`, dodaj objekat po ugledu na postojeći.
Obavezna polja: `slug`, `naziv`, `kategorija`, `podnaslov`, `slika`, `specs`,
`raspored`, `cene`. `slug` postaje adresa stranice (`model/<slug>.html`).

### Izmena teksta koji nije u JSON-u

Sadržaj početne strane je u `index.html`. Ostale statične strane
(Modeli, O nama, Galerija, Kontakt, Privatnost) su u **`pages.js`**, pa se
i one regenerišu komandom `node build.js`.

Zaglavlje, podnožje i lebdeća dugmad su definisani na jednom mestu, u
`build.js`. Menjaš ih tamo i to se odrazi na svih 52 strane.

## Struktura

```
site/
├── index.html            početna (ručno pisana)
├── modeli.html           raskrsnica ka 6 kategorija   } generisano
├── galerija.html                                      } iz
├── o-nama.html                                        } pages.js
├── kontakt.html          wizard forma                 }
├── privatnost.html                                    }
├── modeli/<kategorija>.html    6 strana   } generisano iz
├── model/<slug>.html          40 strana   } modeli.json
├── css/styles.css        ceo dizajn sistem
├── js/main.js            navigacija, FAQ, animacije, wizard forma
├── data/modeli.json      IZVOR ISTINE za sadržaj
├── build.js              generator + zaglavlje/podnožje
├── pages.js              sadržaj statičnih strana
├── images/               brend, objekti, ikone
├── katalozi/             3 PDF kataloga za preuzimanje
├── sitemap.xml           generisano
└── robots.txt            generisano
```

## Šta još treba uraditi

1. **Kontakt forma ne šalje nigde.** U `js/main.js`, konstanta `ENDPOINT` je
   prazna. Popuniti je URL-om Google Apps Script web aplikacije
   (Skill 03, Form Backend Setup). Dok je prazna, forma prikazuje potvrdu i
   ispisuje podatke u konzolu brauzera, ali mejl ne stiže.
2. **Google Analytics, Search Console i Meta Pixel** nisu ubačeni. Čeka se
   pristup nalozima.
3. **Fotografije izvedenih projekata.** Sekcija na `galerija.html` je pripremljena,
   ali fotografije nisu stigle. Trenutno stoji objašnjenje i link na Instagram.
4. **Nacrti osnova po modelima.** Stranice modela imaju mesto za njih, ali za sada
   stoji tekstualni opis rasporeda.
5. **Neproverene odluke.** Vidi `../project/context.md`, sekcija konflikata:
   koje cene važe, da li ostaju tipovi A/B/C i šta sa garancijom.

## Provere koje su prošle

- 1809 internih linkova, nijedan mrtav
- 52 strane, svaka ima tačno jedan `<h1>`
- svi naslovi ispod 60 znakova, svi opisi ispod 160
- sve slike imaju `alt`
- `lang="sr"` svuda
- nema em-dasheva
