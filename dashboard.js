const http = require('node:http');

const stats = {
  total: 180066,
  types: [
    { name: 'Atropellamiento', count: 7333, fatal: 492 },
    { name: 'Volcadura', count: 4191, fatal: 275 },
    { name: 'Colisión con ciclista', count: 2941, fatal: 83 },
    { name: 'Caída de pasajero', count: 1659, fatal: 43 },
    { name: 'Colisión con motocicleta', count: 14900, fatal: 209 },
    { name: 'Colisión con objeto fijo', count: 21155, fatal: 207 },
    { name: 'Colisión con vehículo automotor', count: 123066, fatal: 372 }
  ],
  periods: [
    { name: 'Madrugada · 00–05', count: 22512, fatal: 397 },
    { name: 'Mañana · 06–11', count: 46079, fatal: 388 },
    { name: 'Tarde · 12–17', count: 59735, fatal: 412 },
    { name: 'Noche · 18–23', count: 48277, fatal: 566 }
  ],
  weekdays: [
    { name: 'Lunes', count: 24485, fatal: 250 },
    { name: 'Martes', count: 24138, fatal: 178 },
    { name: 'Miércoles', count: 23583, fatal: 204 },
    { name: 'Jueves', count: 24757, fatal: 201 },
    { name: 'Viernes', count: 26447, fatal: 240 },
    { name: 'Sábado', count: 28773, fatal: 296 },
    { name: 'Domingo', count: 25765, fatal: 414 }
  ],
  alcohol: [
    { name: 'Sí', count: 10693, fatal: 134 },
    { name: 'No', count: 88998, fatal: 556 },
    { name: 'Se ignora', count: 80375, fatal: 1107 }
  ],
  belt: [
    { name: 'Sí', count: 25978, fatal: 74 },
    { name: 'No', count: 30482, fatal: 287 },
    { name: 'Se ignora', count: 123606, fatal: 1436 }
  ],
  ages: [
    { name: 'Menor de 18', count: 2844, fatal: 42 },
    { name: '18–29', count: 61784, fatal: 458 },
    { name: '30–44', count: 50737, fatal: 407 },
    { name: '45–59', count: 25106, fatal: 199 },
    { name: '60+', count: 25352, fatal: 312 },
    { name: 'Sin edad válida', count: 14243, fatal: 379 }
  ]
};

const styles = `
  :root { color-scheme: light; --ink:#1e2925; --muted:#6c7770; --paper:#fff; --line:#e1e6df; --canvas:#f3f5f1; --red:#ca4f3d; --orange:#e4a032; --green:#257866; --gray:#8d9890; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--canvas); color:var(--ink); font-family:'Trebuchet MS','Gill Sans',sans-serif; font-size:14px; line-height:1.45; }
  a,button { font:inherit; }
  .masthead { background:#253b34; color:#f9fbf8; }
  .wrap { width:min(1220px,calc(100% - 48px)); margin:auto; }
  header { padding:28px 0 30px; }
  .topline { display:flex; justify-content:space-between; align-items:center; gap:16px; }
  .eyebrow { margin:0; color:#a9c9b9; font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; }
  .file-tag { border:1px solid #62766e; padding:7px 10px; color:#d4e0d8; font-size:10px; }
  h1 { max-width:760px; margin:25px 0 8px; font:500 38px/1.08 Georgia,'Palatino Linotype',serif; }
  .intro { max-width:700px; margin:0; color:#d1dad4; font-size:13px; }
  main { padding:24px 0 42px; }
  .signal-row { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; margin-bottom:16px; }
  .signal { padding:15px 17px; border:1px solid var(--line); border-left:3px solid var(--red); background:var(--paper); }
  .signal:nth-child(2) { border-left-color:var(--orange); }
  .signal:nth-child(3) { border-left-color:var(--gray); }
  .signal:nth-child(4) { border-left-color:var(--green); }
  .signal-label { display:block; color:var(--muted); font-size:11px; }
  .signal-value { display:block; margin-top:7px; font-size:27px; font-weight:700; font-variant-numeric:tabular-nums; line-height:1; }
  .signal-note { display:block; margin-top:7px; color:var(--muted); font-size:10px; }
  .layout { display:grid; grid-template-columns:repeat(12,minmax(0,1fr)); gap:14px; }
  .panel { min-width:0; padding:18px; border:1px solid var(--line); background:var(--paper); }
  .col-8 { grid-column:span 8; } .col-7 { grid-column:span 7; } .col-6 { grid-column:span 6; } .col-5 { grid-column:span 5; } .col-4 { grid-column:span 4; }
  .panel-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:17px; }
  h2 { margin:0; font-size:15px; }
  .sub { margin:4px 0 0; color:var(--muted); font-size:11px; }
  .unit { color:var(--muted); font-size:10px; white-space:nowrap; }
  .toggle { display:inline-flex; gap:3px; padding:3px; border:1px solid var(--line); background:#f4f6f2; }
  .toggle button { padding:5px 8px; border:0; background:transparent; color:var(--muted); cursor:pointer; font-size:10px; }
  .toggle button[aria-pressed="true"] { background:var(--ink); color:white; }
  .type-list,.rows { display:grid; gap:13px; }
  .type-top { display:flex; justify-content:space-between; align-items:baseline; gap:12px; margin-bottom:5px; font-size:11px; }
  .type-name { min-width:0; }
  .type-value { flex:0 0 auto; font-weight:700; font-variant-numeric:tabular-nums; }
  .track { height:9px; background:#edf0eb; }
  .fill { height:100%; min-width:2px; background:var(--red); transition:width .2s ease; }
  .type-meta { margin-top:4px; color:var(--muted); font-size:10px; }
  .row { display:grid; grid-template-columns:135px minmax(50px,1fr) auto; align-items:center; gap:10px; }
  .row-name { color:#46534b; font-size:11px; }
  .row-value { color:var(--ink); font-size:11px; font-variant-numeric:tabular-nums; text-align:right; }
  .row.is-highlight .fill { background:var(--orange); }
  .ratio-label { display:flex; justify-content:space-between; gap:10px; margin-bottom:5px; color:var(--muted); font-size:10px; }
  .duo { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
  .mini-panel { min-width:0; padding:15px; border:1px solid var(--line); background:#fbfcfa; }
  .mini-panel h3 { margin:0 0 14px; font-size:12px; }
  .mini-rows { display:grid; gap:13px; }
  .mini-row { display:grid; grid-template-columns:70px minmax(35px,1fr) auto; align-items:center; gap:7px; }
  .mini-row .row-name { font-size:10px; }
  .mini-row .row-value { font-size:10px; }
  .mini-row .track { height:7px; }
  .mini-row.unknown .fill { background:var(--gray); }
  .mini-row.positive .fill { background:var(--red); }
  .mini-row.negative .fill { background:var(--green); }
  .age-list { display:grid; gap:13px; }
  .age-row { display:grid; grid-template-columns:100px minmax(35px,1fr) 43px; align-items:center; gap:9px; }
  .age-row .row-name,.age-row .row-value { font-size:10px; }
  .age-row .fill { background:var(--orange); }
  .note { margin:15px 0 0; padding:11px 12px; border-left:3px solid var(--orange); background:#fbf6e9; color:#5f553f; font-size:10px; }
  .legend { display:flex; flex-wrap:wrap; gap:12px; margin-top:14px; color:var(--muted); font-size:10px; }
  .legend b { color:var(--ink); }
  .caveat { margin-top:15px; padding:15px 17px; border:1px solid #d9dfd8; background:#e9eee8; color:#56625a; font-size:11px; }
  .caveat strong { color:var(--ink); }
  footer { padding:20px 0 26px; color:var(--muted); font-size:10px; }
  button:focus-visible { outline:2px solid var(--orange); outline-offset:2px; }
  @media(max-width:900px) { .col-8,.col-7,.col-5,.col-4 { grid-column:span 6; } .col-8,.col-7 { grid-column:span 12; } }
  @media(max-width:620px) {
    .wrap { width:calc(100% - 28px); } header { padding:22px 0 24px; } h1 { margin-top:22px; font-size:31px; }
    .topline { align-items:flex-start; flex-direction:column; } .signal-row { grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
    .signal { padding:13px; } .signal-value { font-size:24px; } .col-8,.col-7,.col-6,.col-5,.col-4 { grid-column:span 12; }
    .panel { padding:15px 13px; } .duo { grid-template-columns:1fr; } .row { grid-template-columns:105px minmax(40px,1fr) auto; gap:7px; }
    .age-row { grid-template-columns:85px minmax(35px,1fr) 39px; gap:7px; } .panel-head { flex-wrap:wrap; }
  }
  @media(prefers-reduced-motion:reduce) { *,*::before,*::after { scroll-behavior:auto!important; transition:none!important; } }
`;

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#253b34">
  <title>Severidad | Accidentes 2015</title>
  <style>${styles}</style>
</head>
<body>
  <div class="masthead"><div class="wrap"><header>
    <div class="topline"><p class="eyebrow">Observatorio vial · lectura de severidad</p><span class="file-tag">CIFRAS DEFINITIVAS / 2015</span></div>
    <h1>El volumen no cuenta toda la historia.</h1>
    <p class="intro">Cruces entre tipo de accidente, hora, edad y condiciones registradas. Las tasas muestran qué proporción de registros de cada grupo fue clasificada como fatal.</p>
  </header></div></div>
  <main class="wrap">
    <section class="signal-row" aria-label="Hallazgos clave">
      <article class="signal"><span class="signal-label">Atropellamiento · fatalidad registrada</span><strong class="signal-value">6,71%</strong><span class="signal-note">492 de 7.333 registros</span></article>
      <article class="signal"><span class="signal-label">Madrugada · fatalidad registrada</span><strong class="signal-value">1,76%</strong><span class="signal-note">la proporción más alta por franja</span></article>
      <article class="signal"><span class="signal-label">Alcohol sin información</span><strong class="signal-value">44,6%</strong><span class="signal-note">80.375 de 180.066 registros</span></article>
      <article class="signal"><span class="signal-label">Domingo · registros fatales</span><strong class="signal-value">414</strong><span class="signal-note">1,61% de los registros dominicales</span></article>
    </section>

    <div class="layout">
      <section class="panel col-7" aria-labelledby="types-title">
        <div class="panel-head">
          <div><h2 id="types-title">La gravedad cambia según el tipo</h2><p class="sub">Comparación entre las principales categorías</p></div>
          <div class="toggle" role="group" aria-label="Ordenar tipos de accidente">
            <button type="button" data-mode="rate" aria-pressed="true">Proporción fatal</button>
            <button type="button" data-mode="volume" aria-pressed="false">Volumen</button>
          </div>
        </div>
        <div class="type-list" id="typeList"></div>
        <p class="note">Atropellamientos y volcaduras muestran las proporciones más altas entre estas categorías. La colisión con vehículo automotor tiene el mayor volumen, pero una proporción fatal menor.</p>
      </section>

      <section class="panel col-5" aria-labelledby="time-title">
        <div class="panel-head"><div><h2 id="time-title">La madrugada concentra mayor proporción fatal</h2><p class="sub">Registros fatales dentro de cada franja</p></div></div>
        <div class="rows" id="periodList"></div>
        <div class="legend"><span>La barra compara <b>proporciones</b>, no el número total de accidentes.</span><span>3.463 registros sin hora válida se excluyen.</span></div>
      </section>

      <section class="panel col-6" aria-labelledby="factors-title">
        <div class="panel-head"><div><h2 id="factors-title">Lo que se anotó sobre alcohol y cinturón</h2><p class="sub">Porcentaje de registros clasificados como fatales en cada respuesta</p></div></div>
        <div class="duo">
          <div class="mini-panel"><h3>Alcohol</h3><div class="mini-rows" id="alcoholList"></div></div>
          <div class="mini-panel"><h3>Cinturón</h3><div class="mini-rows" id="beltList"></div></div>
        </div>
        <p class="note">Los grupos “Se ignora” son numerosos. Estas comparaciones son descriptivas: no demuestran que una respuesta haya causado el resultado.</p>
      </section>

      <section class="panel col-6" aria-labelledby="weekday-title">
        <div class="panel-head"><div><h2 id="weekday-title">Domingo: menos registros que sábado, mayor proporción fatal</h2><p class="sub">Proporción fatal dentro de los registros de cada día</p></div></div>
        <div class="rows" id="weekdayList"></div>
        <p class="sub" style="margin-top:12px">2.118 registros sin día especificado no se muestran.</p>
      </section>

      <section class="panel col-6" aria-labelledby="age-title">
        <div class="panel-head"><div><h2 id="age-title">Edad registrada y gravedad</h2><p class="sub">Proporción fatal por grupo de edad</p></div></div>
        <div class="age-list" id="ageList"></div>
        <p class="note">La edad válida cubre 165.823 registros. “Sin edad válida” no es un grupo etario comparable.</p>
      </section>

      <section class="panel col-6" aria-labelledby="denominator-title">
        <div class="panel-head"><div><h2 id="denominator-title">El denominador importa</h2><p class="sub">Misma cifra, preguntas distintas</p></div></div>
        <p class="sub" style="font-size:13px;line-height:1.7;color:#394740">En colisiones con vehículo automotor hubo <strong>372 registros fatales</strong>, el mayor conteo entre los tipos mostrados. En atropellamientos hubo <strong>492</strong>, aunque su volumen total fue mucho menor. El conteo describe carga; la proporción compara la composición de cada categoría.</p>
        <div class="legend"><span><b>Conteo</b> = cantidad de registros fatales</span><span><b>Proporción</b> = fatales ÷ registros del grupo</span></div>
      </section>
    </div>
    <aside class="caveat"><strong>Nota metodológica.</strong> Se considera fatal un registro cuya clasificación es “Fatal”. Las proporciones se calculan sobre registros, no sobre personas ni exposición al tránsito. Hay valores ignorados en alcohol, cinturón y edad; no se deben interpretar las asociaciones como causalidad ni como riesgo individual.</aside>
  </main>
  <footer class="wrap">Fuente: Accidentes_cifra2015.xlsx · agregado de 180.066 registros.</footer>
  <script>
    const DATA = ${JSON.stringify(stats)};
    const fmt = new Intl.NumberFormat('es-MX');
    const pct = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const rate = (item) => item.fatal / item.count * 100;
    const node = (tag, className, text) => {
      const result = document.createElement(tag);
      if (className) result.className = className;
      if (text !== undefined) result.textContent = text;
      return result;
    };

    const typeRoot = document.getElementById('typeList');
    function renderTypes(mode) {
      typeRoot.replaceChildren();
      const values = DATA.types.slice().sort((a, b) => mode === 'rate' ? rate(b) - rate(a) : b.count - a.count);
      values.forEach((item) => {
        const row = node('div', 'type-item');
        const top = node('div', 'type-top');
        const proportion = rate(item);
        top.append(node('span', 'type-name', item.name), node('strong', 'type-value', mode === 'rate' ? pct.format(proportion) + '%' : fmt.format(item.count)));
        const track = node('div', 'track');
        const fill = node('div', 'fill');
        fill.style.width = (mode === 'rate' ? proportion / 7 * 100 : item.count / 123066 * 100) + '%';
        track.append(fill);
        row.append(top, track, node('div', 'type-meta', fmt.format(item.fatal) + ' registros fatales de ' + fmt.format(item.count) + ' · ' + pct.format(proportion) + '%'));
        typeRoot.append(row);
      });
      document.querySelectorAll('[data-mode]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
    }
    document.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => renderTypes(button.dataset.mode)));
    renderTypes('rate');

    function renderRates(rootId, values, maxRate, highlightName) {
      const root = document.getElementById(rootId);
      values.forEach((item) => {
        const value = rate(item);
        const row = node('div', 'row' + (item.name === highlightName ? ' is-highlight' : ''));
        const label = node('span', 'row-name', item.name);
        const track = node('div', 'track');
        const fill = node('div', 'fill');
        fill.style.width = (value / maxRate * 100) + '%';
        track.append(fill);
        row.append(label, track, node('span', 'row-value', pct.format(value) + '%'));
        row.title = fmt.format(item.fatal) + ' registros fatales de ' + fmt.format(item.count);
        root.append(row);
      });
    }
    renderRates('periodList', DATA.periods, 2, 'Madrugada · 00–05');
    renderRates('weekdayList', DATA.weekdays, 1.8, 'Domingo');
    renderRates('ageList', DATA.ages, 3, '');

    function renderFactors(rootId, values) {
      const root = document.getElementById(rootId);
      values.forEach((item) => {
        const classes = item.name === 'Se ignora' ? 'mini-row unknown' : item.name === 'Sí' ? 'mini-row positive' : 'mini-row negative';
        const row = node('div', classes);
        const label = node('span', 'row-name', item.name);
        const track = node('div', 'track');
        const fill = node('div', 'fill');
        fill.style.width = (rate(item) / 1.5 * 100) + '%';
        track.append(fill);
        row.append(label, track, node('span', 'row-value', pct.format(rate(item)) + '%'));
        row.title = fmt.format(item.fatal) + ' fatales de ' + fmt.format(item.count) + ' registros';
        root.append(row);
      });
    }
    renderFactors('alcoholList', DATA.alcohol);
    renderFactors('beltList', DATA.belt);
  </script>
</body>
</html>`;

const port = Number(process.env.PORT) || 3001;
const server = http.createServer((request, response) => {
  if (request.method !== 'GET' || (request.url !== '/' && request.url !== '/index.html')) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('No encontrado');
    return;
  }

  response.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  response.end(html);
});

server.listen(port, '127.0.0.1', () => {
  console.log('Segundo tablero disponible en http://localhost:' + port);
});
