const http = require('node:http');

const stats = {
  deaths: 2061,
  fatalRecords: 1797,
  oneDeathRecords: 1616,
  multipleDeathRecords: 181,
  roles: [
    { name: 'Conductores', count: 895 },
    { name: 'Pasajeros', count: 525 },
    { name: 'Peatones', count: 521 },
    { name: 'Ciclistas', count: 88 },
    { name: 'Otros', count: 32 }
  ],
  types: [
    { name: 'Colisión con peatón (atropellamiento)', count: 523 },
    { name: 'Colisión con vehículo automotor', count: 465 },
    { name: 'Volcadura', count: 344 },
    { name: 'Colisión con objeto fijo', count: 240 },
    { name: 'Colisión con motocicleta', count: 226 },
    { name: 'Salida del camino', count: 89 },
    { name: 'Colisión con ciclista', count: 85 },
    { name: 'Caída de pasajero', count: 43 },
    { name: 'Otro', count: 24 },
    { name: 'Colisión con animal', count: 13 },
    { name: 'Colisión con ferrocarril', count: 5 },
    { name: 'Incendio', count: 4 }
  ],
  months: [
    ['Ene', 181], ['Feb', 167], ['Mar', 171], ['Abr', 178], ['May', 168], ['Jun', 172],
    ['Jul', 151], ['Ago', 200], ['Sep', 133], ['Oct', 163], ['Nov', 215], ['Dic', 162]
  ].map(([name, count]) => ({ name, count })),
  weekdays: [
    { name: 'Lunes', count: 277 }, { name: 'Martes', count: 208 }, { name: 'Miércoles', count: 236 },
    { name: 'Jueves', count: 215 }, { name: 'Viernes', count: 272 }, { name: 'Sábado', count: 351 },
    { name: 'Domingo', count: 488 }, { name: 'Sin día', count: 14 }
  ],
  periods: [
    { name: 'Madrugada · 00–05', count: 459 }, { name: 'Mañana · 06–11', count: 451 },
    { name: 'Tarde · 12–17', count: 470 }, { name: 'Noche · 18–23', count: 646 },
    { name: 'Sin hora', count: 35 }
  ]
};

const styles = `
  :root { color-scheme:light; --ink:#262825; --muted:#70736d; --paper:#fff; --canvas:#f4f3ef; --line:#e4e2dc; --red:#a84338; --coral:#cf624e; --gold:#d5a344; --teal:#4b8172; --gray:#9b9b92; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--canvas); color:var(--ink); font:14px/1.45 'Trebuchet MS','Gill Sans',sans-serif; }
  .wrap { width:min(1200px,calc(100% - 48px)); margin:0 auto; }
  .masthead { background:#322a28; color:#fffaf5; border-bottom:5px solid var(--coral); }
  header { padding:29px 0 31px; }
  .eyebrow { margin:0; color:#e7b5a5; font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; }
  h1 { margin:21px 0 8px; font:500 38px/1.1 Georgia,'Palatino Linotype',serif; }
  .intro { max-width:720px; margin:0; color:#ded8d3; font-size:13px; }
  main { padding:23px 0 42px; }
  .overview { display:grid; grid-template-columns:1.5fr repeat(3,1fr); gap:12px; margin-bottom:15px; }
  .metric { min-height:108px; padding:16px 17px; border:1px solid var(--line); border-top:3px solid var(--red); background:var(--paper); }
  .metric:first-child { border-top-color:var(--coral); }
  .metric:nth-child(3) { border-top-color:var(--gold); }
  .metric:nth-child(4) { border-top-color:var(--teal); }
  .metric-label { display:block; color:var(--muted); font-size:11px; }
  .metric-value { display:block; margin-top:8px; font-size:29px; font-weight:700; font-variant-numeric:tabular-nums; line-height:1; }
  .metric:first-child .metric-value { font-size:34px; }
  .metric-note { display:block; margin-top:7px; color:var(--muted); font-size:10px; }
  .grid { display:grid; grid-template-columns:repeat(12,minmax(0,1fr)); gap:14px; }
  .panel { min-width:0; padding:18px; border:1px solid var(--line); background:var(--paper); }
  .span-8 { grid-column:span 8; } .span-7 { grid-column:span 7; } .span-6 { grid-column:span 6; } .span-5 { grid-column:span 5; } .span-4 { grid-column:span 4; }
  .panel-head { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:16px; }
  h2 { margin:0; font-size:15px; }
  .sub { margin:4px 0 0; color:var(--muted); font-size:11px; }
  .bars { display:grid; gap:12px; }
  .bar-row { display:grid; grid-template-columns:minmax(92px,155px) minmax(30px,1fr) auto; align-items:center; gap:10px; }
  .bar-label { color:#4e514b; font-size:11px; }
  .track { height:9px; background:#efeee9; }
  .fill { height:100%; min-width:2px; background:var(--red); transition:width .16s ease; }
  .bar-row:nth-child(2n) .fill { background:var(--coral); }
  .bar-value { font-size:11px; font-weight:700; font-variant-numeric:tabular-nums; text-align:right; }
  .bar-note { margin-top:3px; color:var(--muted); font-size:10px; }
  .victim-row { display:grid; grid-template-columns:minmax(90px,130px) minmax(30px,1fr) auto; align-items:center; gap:10px; }
  .victim-row:first-child .fill { background:var(--red); }
  .victim-row:nth-child(2) .fill { background:var(--coral); }
  .victim-row:nth-child(3) .fill { background:var(--gold); }
  .victim-row:nth-child(4) .fill { background:var(--teal); }
  .victim-row:nth-child(5) .fill { background:#84958a; }
  .victim-label { font-size:11px; }
  .victim-share { color:var(--muted); font-size:10px; }
  .month-chart { display:grid; grid-template-columns:repeat(12,minmax(25px,1fr)); align-items:end; gap:7px; min-height:166px; padding:8px 3px 0; border-bottom:1px solid var(--line); }
  .month-button { display:flex; min-width:0; height:152px; flex-direction:column; align-items:center; justify-content:flex-end; gap:5px; padding:0; border:0; background:transparent; color:var(--muted); cursor:pointer; }
  .month-bar-track { display:flex; width:min(100%,31px); height:112px; align-items:flex-end; }
  .month-bar { display:block; width:100%; min-height:3px; background:#c89787; }
  .month-button:hover .month-bar,.month-button:focus-visible .month-bar,.month-button.selected .month-bar { background:var(--red); }
  .month-value { font-size:9px; font-variant-numeric:tabular-nums; }
  .month-label { padding-bottom:7px; font-size:10px; }
  .month-insight { margin:11px 0 0; color:var(--muted); font-size:11px; }
  .month-insight strong { color:var(--ink); }
  .note { margin:14px 0 0; padding:10px 12px; border-left:3px solid var(--gold); background:#faf5e9; color:#5e543f; font-size:10px; }
  .caveat { margin-top:15px; padding:14px 16px; border:1px solid #dfdcd3; background:#eeece6; color:#5e5c55; font-size:11px; }
  .caveat strong { color:var(--ink); }
  footer { padding:18px 0 28px; color:var(--muted); font-size:10px; }
  button:focus-visible { outline:2px solid var(--red); outline-offset:3px; }
  @media(max-width:900px) { .span-8,.span-7,.span-5,.span-4 { grid-column:span 6; } .span-8,.span-7 { grid-column:span 12; } }
  @media(max-width:620px) {
    .wrap { width:calc(100% - 28px); } header { padding:23px 0 25px; } h1 { font-size:31px; }
    .overview { grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; } .metric { min-height:97px; padding:13px; }
    .metric-value,.metric:first-child .metric-value { font-size:25px; } .span-8,.span-7,.span-6,.span-5,.span-4 { grid-column:span 12; }
    .panel { padding:15px 13px; } .month-chart { grid-template-columns:repeat(12,34px); gap:5px; overflow-x:auto; }
    .month-button { width:34px; } .bar-row { grid-template-columns:98px minmax(30px,1fr) auto; gap:7px; }
    .victim-row { grid-template-columns:92px minmax(30px,1fr) auto; gap:7px; }
  }
  @media(prefers-reduced-motion:reduce) { *,*::before,*::after { scroll-behavior:auto!important; transition:none!important; } }
`;

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#322a28">
  <title>Víctimas fatales | Accidentes 2015</title>
  <style>${styles}</style>
</head>
<body>
  <div class="masthead"><div class="wrap"><header>
    <p class="eyebrow">Observatorio vial · tercera vista</p>
    <h1>Una mirada a las víctimas fatales</h1>
    <p class="intro">2.061 personas fallecidas, descritas por tipo de usuario, clase de accidente y momento. Esta vista cuenta personas; no confunde víctimas con accidentes.</p>
  </header></div></div>
  <main class="wrap">
    <section class="overview" aria-label="Resumen de víctimas fatales">
      <article class="metric"><span class="metric-label">Personas fallecidas</span><strong class="metric-value">2.061</strong><span class="metric-note">suma de las categorías de víctimas fatales</span></article>
      <article class="metric"><span class="metric-label">Registros fatales</span><strong class="metric-value">1.797</strong><span class="metric-note">clasificados como “Fatal”</span></article>
      <article class="metric"><span class="metric-label">Con una víctima</span><strong class="metric-value">1.616</strong><span class="metric-note">registros fatales</span></article>
      <article class="metric"><span class="metric-label">Con varias víctimas</span><strong class="metric-value">181</strong><span class="metric-note">10,1% de los registros fatales</span></article>
    </section>
    <div class="grid">
      <section class="panel span-6" aria-labelledby="roles-title">
        <div class="panel-head"><div><h2 id="roles-title">¿Quiénes fueron las víctimas?</h2><p class="sub">Personas fallecidas por tipo de usuario vial</p></div></div>
        <div class="bars" id="roleChart"></div>
        <p class="note">Conductores, pasajeros y peatones concentran 1.941 fallecimientos, el 94,2% del total.</p>
      </section>
      <section class="panel span-6" aria-labelledby="type-title">
        <div class="panel-head"><div><h2 id="type-title">Fallecimientos por tipo de accidente</h2><p class="sub">Conteo de personas, no de registros</p></div></div>
        <div class="bars" id="typeChart"></div>
      </section>
      <section class="panel span-8" aria-labelledby="month-title">
        <div class="panel-head"><div><h2 id="month-title">Cómo se distribuyeron durante el año</h2><p class="sub">Víctimas fatales por mes</p></div><span class="sub">personas</span></div>
        <div class="month-chart" id="monthChart" role="group" aria-label="Selecciona un mes para ver el conteo"></div>
        <p class="month-insight" id="monthInsight" aria-live="polite"></p>
      </section>
      <section class="panel span-4" aria-labelledby="period-title">
        <div class="panel-head"><div><h2 id="period-title">Hora del accidente</h2><p class="sub">Víctimas por franja horaria</p></div></div>
        <div class="bars" id="periodChart"></div>
        <p class="note">La noche reúne el mayor conteo; 35 fallecimientos no tienen hora válida.</p>
      </section>
      <section class="panel span-7" aria-labelledby="day-title">
        <div class="panel-head"><div><h2 id="day-title">Más víctimas fatales en domingo</h2><p class="sub">Personas fallecidas por día de la semana</p></div></div>
        <div class="bars" id="dayChart"></div>
        <p class="note">488 fallecimientos ocurrieron en domingo, frente a 351 en sábado. El día no se especifica en 14 casos.</p>
      </section>
      <section class="panel span-5" aria-labelledby="multiple-title">
        <div class="panel-head"><div><h2 id="multiple-title">Más de una vida perdida</h2><p class="sub">Distribución de los 1.797 registros fatales</p></div></div>
        <div class="track" style="height:15px"><div class="fill" style="width:89.9%;background:var(--red)"></div></div>
        <div class="bar-note" style="display:flex;justify-content:space-between;margin-top:10px"><span>1 víctima · <strong>1.616</strong></span><span>Varias · <strong>181</strong></span></div>
        <p class="note">En promedio hubo 1,15 personas fallecidas por registro fatal.</p>
      </section>
    </div>
    <aside class="caveat"><strong>Límite de los datos.</strong> El archivo permite desglosar fallecimientos por conductor, pasajero, peatón, ciclista y otros, además del contexto del accidente. No incluye edad individual de cada víctima; por eso esta vista no atribuye el campo de edad del registro a las personas fallecidas.</aside>
  </main>
  <footer class="wrap">Fuente: Accidentes_cifra2015.xlsx · cifras definitivas · agregados de 180.066 registros.</footer>
  <script>
    const DATA = ${JSON.stringify(stats)};
    const fmt = new Intl.NumberFormat('es-MX');
    const pct = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
    const make = (tag, className, text) => {
      const item = document.createElement(tag);
      if (className) item.className = className;
      if (text !== undefined) item.textContent = text;
      return item;
    };
    function renderBars(rootId, values, max, mode) {
      const root = document.getElementById(rootId);
      values.forEach((entry) => {
        const row = make('div', mode === 'role' ? 'victim-row' : 'bar-row');
        const label = make('span', mode === 'role' ? 'victim-label' : 'bar-label', entry.name);
        const track = make('div', 'track');
        const fill = make('div', 'fill');
        const width = entry.count / max * 100;
        fill.style.width = width + '%';
        track.append(fill);
        let value;
        if (mode === 'role') {
          value = make('span', 'bar-value', fmt.format(entry.count) + ' · ' + pct.format(entry.count / DATA.deaths * 100) + '%');
        } else {
          value = make('span', 'bar-value', fmt.format(entry.count));
        }
        row.append(label, track, value);
        root.append(row);
      });
    }
    renderBars('roleChart', DATA.roles, DATA.deaths, 'role');
    renderBars('typeChart', DATA.types, DATA.types[0].count, 'type');
    renderBars('periodChart', DATA.periods, DATA.periods[0].count, 'type');
    renderBars('dayChart', DATA.weekdays, DATA.weekdays[6].count, 'type');

    const monthRoot = document.getElementById('monthChart');
    const maxMonth = Math.max.apply(null, DATA.months.map((month) => month.count));
    const insight = document.getElementById('monthInsight');
    function selectMonth(month, button) {
      monthRoot.querySelectorAll('.month-button').forEach((item) => item.classList.remove('selected'));
      button.classList.add('selected');
      insight.replaceChildren(document.createTextNode(month.name + ': '));
      const strong = make('strong', '', fmt.format(month.count) + ' personas fallecidas');
      insight.append(strong);
    }
    DATA.months.forEach((month) => {
      const button = make('button', 'month-button' + (month.name === 'Nov' ? ' selected' : ''));
      button.type = 'button';
      button.setAttribute('aria-label', month.name + ': ' + fmt.format(month.count) + ' personas fallecidas');
      const value = make('span', 'month-value', String(month.count));
      const track = make('span', 'month-bar-track');
      const bar = make('span', 'month-bar');
      bar.style.height = (month.count / maxMonth * 100) + '%';
      track.append(bar);
      const label = make('span', 'month-label', month.name);
      button.append(value, track, label);
      button.addEventListener('click', () => selectMonth(month, button));
      monthRoot.append(button);
      if (month.name === 'Nov') selectMonth(month, button);
    });
  </script>
</body>
</html>`;

const port = Number(process.env.PORT) || 3002;
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
  console.log('Vista de víctimas fatales disponible en http://localhost:' + port);
});
