/* ==========================================================================
   M DESIGNE IVANJICA
   ========================================================================== */

/* Endpoint forme. Prazan dok se ne pokrene Skill 03. */
const ENDPOINT = 'https://script.google.com/macros/s/AKfycbwe5pSKMFia4J0_SxgmI3FYYhx5fBoQw_aM5-7kLvSojccmQQXFZjYUV2GW9SB5Xw/exec';

(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------
     Navigacija
     --------------------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
    });
  }

  /* ---------------------------------------------------------------
     Navigacija menja boju nad tamnim sekcijama
     --------------------------------------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var DARK = '.sec--dark, .hero-pin, .lineup, .cta-full, .hero--page, .site-footer';
    var darkEls = Array.prototype.slice.call(document.querySelectorAll(DARK));

    function paintNav() {
      var bar = header.getBoundingClientRect();
      var probe = bar.top + bar.height / 2;
      var dark = false;
      for (var i = 0; i < darkEls.length; i++) {
        var r = darkEls[i].getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) { dark = true; break; }
      }
      header.classList.toggle('on-dark', dark);
    }
    paintNav();
    window.addEventListener('scroll', paintNav, { passive: true });
    window.addEventListener('resize', paintNav, { passive: true });
    window.addEventListener('load', paintNav);
  }

  /* ---------------------------------------------------------------
     HERO: video se odvija skrolom
     Video je prekodiran tako da je svaki kadar kljucni,
     pa je premotavanje trenutno i bez trzanja.
     --------------------------------------------------------------- */
  var pin = document.querySelector('.hero-pin');
  var vid = pin && pin.querySelector('video');

  if (pin && vid && !reduced) {
    vid.pause();

    var dur = 0, target = 0, curr = 0, running = false, primed = false;

    function onMeta() {
      if (vid.duration && isFinite(vid.duration)) { dur = vid.duration; loop(); }
    }
    vid.addEventListener('loadedmetadata', onMeta);
    if (vid.readyState >= 1) onMeta();

    function progress() {
      var travel = pin.offsetHeight - window.innerHeight;
      if (travel <= 0) return 0;
      var p = -pin.getBoundingClientRect().top / travel;
      return p < 0 ? 0 : p > 1 ? 1 : p;
    }

    function inView() {
      var r = pin.getBoundingClientRect();
      return r.bottom > -200 && r.top < window.innerHeight + 200;
    }

    /* Stalna petlja dok je hero u vidnom polju.
       Meko priblizavanje ka cilju daje utisak inercije. */
    function loop() {
      if (running) return;
      running = true;
      (function frame() {
        if (!inView()) { running = false; return; }

        var p = progress();
        target = p * dur;
        curr += (target - curr) * 0.15;

        if (Math.abs(target - curr) < 0.002) curr = target;

        if (dur && !vid.seeking) {
          try { vid.currentTime = curr; } catch (e) {}
        }

        pin.classList.toggle('is-past', p > 0.9);
        var cue = pin.querySelector('.hero__cue .track');
        if (cue) cue.style.setProperty('--p', String(p));

        requestAnimationFrame(frame);
      })();
    }

    window.addEventListener('scroll', function () { loop(); }, { passive: true });
    window.addEventListener('resize', function () { loop(); }, { passive: true });

    /* Neki brauzeri traze jednu interakciju pre nego sto dozvole seek */
    function prime() {
      if (primed) return;
      primed = true;
      var pr = vid.play();
      if (pr && pr.then) pr.then(function () { vid.pause(); loop(); }).catch(function () {});
    }
    window.addEventListener('pointerdown', prime, { once: true });
    window.addEventListener('touchstart', prime, { once: true, passive: true });
    window.addEventListener('keydown', prime, { once: true });
    loop();
  }

  /* ---------------------------------------------------------------
     LINEUP: kartice klize horizontalno dok se skroluje vertikalno
     --------------------------------------------------------------- */
  var lineup = document.querySelector('.lineup');
  if (lineup && !reduced) {
    var row = lineup.querySelector('.lineup__row');
    var sticky = lineup.querySelector('.lineup__sticky');

    function slide() {
      var travel = lineup.offsetHeight - window.innerHeight;
      if (travel <= 0 || !row) return;
      var p = -lineup.getBoundingClientRect().top / travel;
      p = p < 0 ? 0 : p > 1 ? 1 : p;

      var overflow = row.scrollWidth - sticky.clientWidth
                   + parseFloat(getComputedStyle(sticky).paddingLeft || 0);
      if (overflow < 0) overflow = 0;
      row.style.transform = 'translate3d(' + (-overflow * p) + 'px,0,0)';
    }
    window.addEventListener('scroll', slide, { passive: true });
    window.addEventListener('resize', slide, { passive: true });
    window.addEventListener('load', slide);
    slide();
  }

  /* ---------------------------------------------------------------
     Naslovi rec po rec
     --------------------------------------------------------------- */
  var BR = '⏎';   /* interna oznaka za prelom reda */

  document.querySelectorAll('[data-split]').forEach(function (el) {
    /* uspravna crta u tekstu znaci prelom reda */
    var lines = el.textContent.trim().split('|').map(function (x) { return x.trim(); });
    var words = [];
    lines.forEach(function (ln, li) {
      ln.split(/\s+/).forEach(function (w) { if (w) words.push(w); });
      if (li < lines.length - 1) words.push(BR);
    });

    el.textContent = '';
    words.forEach(function (w, i) {
      if (w === BR) { el.appendChild(document.createElement('br')); return; }
      var s = document.createElement('span');
      s.className = 'w';
      s.textContent = w;
      s.style.transitionDelay = (i * 0.045) + 's';
      el.appendChild(s);
      if (i < words.length - 1 && words[i + 1] !== BR) el.appendChild(document.createTextNode(' '));
    });
    el.classList.add('ap-split');
  });

  /* ---------------------------------------------------------------
     Tranzicija na promeni stranica
     Zatamnjenje pre odlaska, otkrivanje po dolasku.
     --------------------------------------------------------------- */
  var cover = document.querySelector('.pcover');

  if (cover && !reduced) {
    /* Dolazak: panel pokriva ekran i klizi navise, nova strana izlazi ispod. */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { cover.classList.add('is-lifting'); });
    });

    /* Odlazak: panel se postavi ispod ekrana pa naleti odozdo. */
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      if (/^(https?:|mailto:|tel:|viber:|#|javascript:)/.test(href)) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

      /* isti dokument, samo sidro */
      if (href.split('#')[0] === '' ) return;

      e.preventDefault();
      cover.classList.remove('is-lifting');
      cover.classList.add('is-below');

      requestAnimationFrame(function () {
        cover.classList.remove('is-below');
        cover.classList.add('is-rising');
        document.body.classList.add('is-leaving');
      });

      setTimeout(function () { window.location.href = href; }, 520);
    });

    /* Povratak dugmetom Nazad ne sme da ostavi pokriven ekran. */
    window.addEventListener('pageshow', function (ev) {
      if (ev.persisted) {
        document.body.classList.remove('is-leaving');
        cover.className = 'pcover is-lifting';
      }
    });
  } else if (cover) {
    cover.style.display = 'none';
  }

  /* ---------------------------------------------------------------
     Appear animacije
     --------------------------------------------------------------- */
  document.querySelectorAll('.cta-full, .closing').forEach(function (el) { el.classList.add('ap-block'); });

  var targets = document.querySelectorAll('.ap, .ap-split, .ap-block');
  if (targets.length) {
    if ('IntersectionObserver' in window && !reduced) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
      targets.forEach(function (el) { io.observe(el); });
    } else {
      targets.forEach(function (el) { el.classList.add('on'); });
    }
  }

  /* ---------------------------------------------------------------
     FAQ akordeon
     --------------------------------------------------------------- */
  document.querySelectorAll('.acc__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.nextElementSibling;
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.style.maxHeight = open ? '0px' : panel.scrollHeight + 'px';
    });
  });
  window.addEventListener('resize', function () {
    document.querySelectorAll('.acc__q[aria-expanded="true"]').forEach(function (b) {
      b.nextElementSibling.style.maxHeight = b.nextElementSibling.scrollHeight + 'px';
    });
  });

  /* ---------------------------------------------------------------
     Filteri
     --------------------------------------------------------------- */
  var filters = document.querySelectorAll('.filter-btn');
  if (filters.length) {
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.dataset.filter;
        filters.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        document.querySelectorAll('[data-cat]').forEach(function (it) {
          it.hidden = !(cat === 'sve' || it.dataset.cat === cat);
        });
      });
    });
  }


  /* ---------------------------------------------------------------
     FOOTER
     Wordmark se rasteze preko cele sirine (kao njihov fit-text).
     Slika i tekst dolaze iz sive u punu boju kad footer udje u kadar.
     --------------------------------------------------------------- */
  var mark = document.querySelector('.fmark__t');
  var ftr  = document.querySelector('.site-footer');

  if (mark) {
    var fbox = mark.parentElement;

    function fitMark() {
      mark.style.fontSize = '100px';
      var avail = fbox.clientWidth;
      var natural = mark.offsetWidth;
      if (natural > 0 && avail > 0) mark.style.fontSize = (100 * avail / natural) + 'px';
    }

    fitMark();
    window.addEventListener('load', fitMark);
    window.addEventListener('resize', fitMark);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitMark);
  }

  if (ftr) {
    if ('IntersectionObserver' in window && !reduced) {
      var fo = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { ftr.classList.add('on'); fo.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      fo.observe(ftr);
    } else {
      ftr.classList.add('on');
    }
  }

  /* ---------------------------------------------------------------
     KONFIGURATOR (wizard)
     --------------------------------------------------------------- */
  var wiz = document.querySelector('.wizard');
  if (!wiz) return;

  var form   = wiz.querySelector('form');
  var steps  = Array.prototype.slice.call(wiz.querySelectorAll('.wstep'));
  var bar    = document.querySelector('[data-prog-bar]');
  var lbl    = document.querySelector('[data-prog-label]');
  var bBack  = wiz.querySelector('[data-act="back"]');
  var bNext  = wiz.querySelector('[data-act="next"]');
  var bSend  = wiz.querySelector('[data-act="send"]');
  var done   = wiz.querySelector('.wdone');
  var sumBox = wiz.querySelector('[data-sum]');
  var cenaEl = wiz.querySelector('.wbox__v');

  var dots = Array.prototype.slice.call(wiz.querySelectorAll('.wchrome i'));

  /* Procena cene prati kategoriju, velicinu I paket, ne samo prvi korak.
     Podaci dolaze iz <script id="wiz-pricing"> koji upisuje contactpage.js:
     [{k: naziv kategorije, v: povrsina modela u m2 ili null, c: [[paket, iznos], ...]}, ...] */
  var PRICING = [];
  try {
    var pricingEl = document.getElementById('wiz-pricing');
    if (pricingEl) PRICING = JSON.parse(pricingEl.textContent);
  } catch (err) { PRICING = []; }

  /* [min, max, minStrogo] - "preko X" znaci strogo vece od X, da model od
     tacno X ne upadne i u "do X" i u "preko X" korpu */
  var SIZE_RANGES = {
    'do 16 m²':      [0, 16],
    'do 20 m²':      [0, 20],
    'do 30 m²':      [0, 30],
    '16 do 24 m²':   [16, 24],
    '20 do 30 m²':   [20, 30],
    '30 do 42 m²':   [30, 42],
    '30 do 60 m²':   [30, 60],
    '60 do 100 m²':  [60, 100],
    '100 do 150 m²': [100, 150],
    'preko 24 m²':   [24, Infinity, true],
    'preko 150 m²':  [150, Infinity, true]
  };

  /* igralista nemaju kvadraturu, dele se na privatna i komercijalna */
  var TIP_FILTERI = {
    'privatno dvorište':   'privatno',
    'komercijalni prostor': 'komercijalno'
  };

  function parseIznos_(s) {
    var n = String(s).replace(/[^\d]/g, '');
    return n ? parseInt(n, 10) : Infinity;
  }

  /* od svih paketa jednog modela, nadje onaj koji najbolje odgovara
     izabranom nivou izvodjenja (nazivi paketa se razlikuju po kategoriji,
     npr. montazne kuce imaju "Ključ u ruke Standard/Comfort/Premium") */
  function matchPaket_(cene, paketLabel) {
    if (!cene.length) return null;
    var sorted = cene.slice().sort(function (a, b) { return parseIznos_(a[1]) - parseIznos_(b[1]); });
    if (!paketLabel || paketLabel === 'treba mi savet') return sorted[0];
    var needle = paketLabel.toLowerCase();
    var matches = sorted.filter(function (c) { return c[0].toLowerCase().indexOf(needle) !== -1; });
    return matches.length ? matches[0] : sorted[0];
  }

  function estimatePrice_() {
    var kat = answers['Kategorija'];
    if (!kat) return null;
    var models = PRICING.filter(function (p) { return p.k === kat; });
    if (!models.length) return null;

    /* korak 2 je kvadratura (kuce), tip (igralista) ili obim projekta (resort) */
    var vel = odgovor2();
    var range = SIZE_RANGES[vel];
    var tip = TIP_FILTERI[vel];
    var uzi = [];
    if (range) uzi = models.filter(function (m) {
      if (m.v == null) return false;
      return (range[2] ? m.v > range[0] : m.v >= range[0]) && m.v <= range[1];
    });
    else if (tip) uzi = models.filter(function (m) { return m.t === tip; });
    var pool = uzi.length ? uzi : models;

    var best = null;
    pool.forEach(function (m) {
      var picked = matchPaket_(m.c, answers['Paket']);
      if (picked && (!best || parseIznos_(picked[1]) < parseIznos_(best[1]))) best = picked;
    });
    return best ? best[1] : null;
  }

  function updateCena() {
    if (!cenaEl) return;
    var est = estimatePrice_();
    cenaEl.textContent = est || (answers['Kategorija'] ? 'Na upit' : '—');
  }

  var current = 0;
  var answers = {};
  var pad = function (n) { return String(n).padStart(2, '0'); };

  /* Koraci 2 i 3 imaju po jednu .wopts grupu za svaku kategoriju. Prikazuje
     se samo grupa izabrane kategorije; ostale ostaju hidden. Zato se svuda
     gleda samo vidljiva grupa, ne sve opcije u koraku. */
  function vidljiveOpcije(st) {
    var out = [];
    st.querySelectorAll('.wopts').forEach(function (g) {
      if (g.hasAttribute('data-for') && g.hidden) return;
      g.querySelectorAll('.wopt').forEach(function (o) { out.push(o); });
    });
    return out;
  }

  /* korak 2 pita kvadraturu, namenu ili obim projekta, zavisno od kategorije */
  var KLJUCEVI_2 = ['Veličina', 'Namena', 'Obim projekta'];
  function odgovor2() {
    for (var i = 0; i < KLJUCEVI_2.length; i++) {
      if (answers[KLJUCEVI_2[i]]) return answers[KLJUCEVI_2[i]];
    }
    return '';
  }

  function applyKategorija() {
    var kat = answers['Kategorija'] || '';
    wiz.querySelectorAll('.wopts[data-for]').forEach(function (g) {
      var mine = g.getAttribute('data-for') === kat;
      g.hidden = !mine;
      if (!mine) {
        /* izbor iz druge kategorije ne sme da ostane zapamcen */
        g.querySelectorAll('.wopt').forEach(function (o) {
          o.classList.remove('is-selected');
          o.setAttribute('aria-pressed', 'false');
        });
        if (g.dataset.key) delete answers[g.dataset.key];
      }
    });
    /* naslov i podnaslov koraka 2 dolaze iz aktivne grupe */
    var akt = wiz.querySelector('.wopts[data-for="' + kat.replace(/"/g, '\\"') + '"][data-q]');
    var q = wiz.querySelector('[data-q-velicina]');
    var h = wiz.querySelector('[data-hint-velicina]');
    if (q && akt && akt.dataset.q) q.textContent = akt.dataset.q;
    if (h && akt && akt.dataset.hint) h.textContent = akt.dataset.hint;
  }

  /* korak je spreman za dalje samo kad je izabrana opcija (ako je ima) I
     popunjeno svako obavezno tekstualno polje (ako ga ima) u tom koraku */
  function stepReady(st) {
    var opts = vidljiveOpcije(st);
    var optOk = !opts.length || opts.some(function (o) { return o.classList.contains('is-selected'); });
    var req = st.querySelectorAll('input[data-required="true"]');
    var reqOk = true;
    req.forEach(function (i) { if (!i.value.trim()) reqOk = false; });
    return optOk && reqOk;
  }

  function render() {
    steps.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });

    if (bar) bar.style.width = (((current + 1) / steps.length) * 100) + '%';
    if (lbl) lbl.textContent = 'Korak ' + pad(current + 1) + ' // ' + pad(steps.length);
    if (dots.length) dots.forEach(function (d, i) { d.classList.toggle('is-on', i === current); });

    if (bBack) bBack.hidden = current === 0;

    var last = current === steps.length - 1;
    if (bNext) bNext.hidden = last;
    if (bSend) bSend.hidden = !last;

    if (bNext && !last) bNext.disabled = !stepReady(steps[current]);
    summary();
  }

  function summary() {
    if (!sumBox) return;
    sumBox.innerHTML = '';
    Object.keys(answers).forEach(function (k) {
      if (!answers[k]) return;
      var row = document.createElement('div');
      row.className = 'wsum__row';
      row.innerHTML = '<span class="wsum__k">' + k + '</span><span class="wsum__v"></span>';
      row.querySelector('.wsum__v').textContent = answers[k];
      sumBox.appendChild(row);
    });
  }

  wiz.querySelectorAll('.wopt').forEach(function (o) {
    o.addEventListener('click', function () {
      var st = o.closest('.wstep');
      st.querySelectorAll('.wopt').forEach(function (x) {
        x.classList.toggle('is-selected', x === o);
        x.setAttribute('aria-pressed', String(x === o));
      });
      /* .wopts sa svojim data-key (npr. "Rok") pobedi opsti kljuc koraka,
         da ne prepise vrednost iz tekstualnog polja u istom koraku */
      var wopts = o.closest('.wopts');
      var key = (wopts && wopts.dataset.key) || st.dataset.key || 'Izbor';
      answers[key] = o.dataset.value;

      /* promena kategorije menja opcije u koracima 2 i 3 */
      if (key === 'Kategorija') applyKategorija();

      /* cena prati kategoriju, velicinu i paket zajedno */
      updateCena();

      var ready = stepReady(st);
      if (bNext) bNext.disabled = !ready;

      var req = st.querySelector('input[data-required="true"]');
      if (!ready && req) {
        /* opcija je izabrana, ali obavezno polje u istom koraku je prazno:
           ne prelazi dalje, pokazi gresku i vrati fokus na polje */
        req.closest('.field').classList.add('has-error');
        req.focus();
      } else if (ready && steps.indexOf(st) !== steps.length - 1) {
        setTimeout(function () { if (current < steps.length - 1) { current++; render(); } }, 280);
      }
    });
  });

  wiz.querySelectorAll('.wstep input[data-required="true"]').forEach(function (i) {
    i.addEventListener('input', function () {
      var st = i.closest('.wstep');
      var key = i.dataset.key || 'Lokacija';
      var v = i.value.trim();
      if (v) {
        answers[key] = v;
        i.closest('.field').classList.remove('has-error');
      } else {
        delete answers[key];
      }
      if (bNext) bNext.disabled = !stepReady(st);
      summary();
    });
  });

  if (bNext) bNext.addEventListener('click', function () { if (current < steps.length - 1) { current++; render(); } });
  if (bBack) bBack.addEventListener('click', function () { if (current > 0) { current--; render(); } });

  function validate() {
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (i) {
      var f = i.closest('.field'), v = i.value.trim(), bad = !v;
      if (!bad && i.type === 'email') bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      if (!bad && i.type === 'tel') bad = v.replace(/[^0-9]/g, '').length < 6;
      f.classList.toggle('has-error', bad);
      if (bad && ok) i.focus();
      if (bad) ok = false;
    });
    return ok;
  }

  form.querySelectorAll('[required]').forEach(function (i) {
    i.addEventListener('blur', function () {
      if (i.value.trim()) i.closest('.field').classList.remove('has-error');
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    /* GET sa parametrima u adresi, ne POST telo: Apps Script Web App svaki
       POST preusmeri na sesijsku adresu i pretvori ga u GET, pa se e.postData
       gubi. GET je jedini pouzdan put do backend skripte. */
    var params = {
      kategorija: answers['Kategorija'] || '',
      velicina:   odgovor2(),
      paket:      answers['Paket'] || '',
      rok:        answers['Rok'] || '',
      lokacija:   answers['Lokacija'] || '',
      ime:        form.querySelector('[name="ime"]').value.trim(),
      telefon:    form.querySelector('[name="telefon"]').value.trim(),
      email:      form.querySelector('[name="email"]').value.trim(),
      poruka:     form.querySelector('[name="poruka"]').value.trim(),
      strana:     location.pathname,
      poslato:    new Date().toLocaleString('sr-RS')
    };

    bSend.disabled = true;
    var orig = bSend.textContent;
    bSend.textContent = 'Šaljem...';

    if (!ENDPOINT) { console.warn('ENDPOINT nije podesen. Upit:', params); finish(); return; }

    var qs = new URLSearchParams(params).toString();
    fetch(ENDPOINT + '?' + qs, { method: 'GET', mode: 'no-cors' })
      .then(finish).catch(function () {
        bSend.disabled = false;
        bSend.textContent = orig;
        alert('Slanje nije uspelo. Pozovite 060 366 5275 ili pišite na mdesigneivanjica@gmail.com.');
      });
  });

  function finish() {
    var left = wiz.querySelector('.wleft');
    var right = wiz.querySelector('.wright');
    var prog = document.querySelector('.wprog');
    if (left) left.hidden = true;
    if (right) right.hidden = true;
    if (prog) prog.hidden = true;
    if (done) done.classList.add('is-active');
    wiz.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* predizbor iz URL-a: ?model=tara-48&kategorija=a-frame */
  var params = new URLSearchParams(location.search);
  var pm = params.get('model'), pk = params.get('kategorija');
  if (pm || pk) {
    var first = steps[0], matched = false;
    first.querySelectorAll('.wopt').forEach(function (o) {
      var slug = (o.dataset.value || '').toLowerCase().replace(/\s+/g, '-');
      if (pk && slug.indexOf(pk.toLowerCase().split('-')[0]) === 0) {
        o.classList.add('is-selected');
        answers[first.dataset.key || 'Kategorija'] = o.dataset.value;
        matched = true;
      }
    });
    if (pm) answers['Model'] = pm.replace(/-/g, ' ').toUpperCase();
    if (matched || pm) current = 1;
    if (matched) updateCena();
  }

  applyKategorija();
  render();
})();
