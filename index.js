const http = require('node:http');

const data = {
	total: 180066,
	deaths: 2061,
	injuries: 51132,
	severity: [
		{ label: 'Sólo daños', count: 141837, color: '#2f806c' },
		{ label: 'No fatal', count: 36432, color: '#e0a13a' },
		{ label: 'Fatal', count: 1797, color: '#cb5948' }
	],
	months: [
		['Ene', 14051], ['Feb', 14027], ['Mar', 15530], ['Abr', 14346],
		['May', 15768], ['Jun', 15178], ['Jul', 14919], ['Ago', 14974],
		['Sep', 14600], ['Oct', 15475], ['Nov', 15284], ['Dic', 15914]
	].map(([label, count]) => ({ label, count })),
	weekdays: [
		['Lun', 24485], ['Mar', 24138], ['Mié', 23583], ['Jue', 24757],
		['Vie', 26447], ['Sáb', 28773], ['Dom', 25765]
	].map(([label, count]) => ({ label, count })),
	hours: [6806, 3553, 3974, 2990, 2876, 2313, 4478, 6540, 10524, 7545, 9323, 7669, 9761, 8672, 12049, 9571, 11069, 8613, 10442, 9028, 9498, 7073, 7184, 5052],
	types: [
		{ label: 'Colisión con vehículo automotor', count: 123066 },
		{ label: 'Colisión con objeto fijo', count: 21155 },
		{ label: 'Colisión con motocicleta', count: 14900 }
	],
	victims: [
		{ label: 'Conductores', deaths: 895, injuries: 22345 },
		{ label: 'Pasajeros', deaths: 525, injuries: 18654 },
		{ label: 'Peatones', deaths: 521, injuries: 7911 },
		{ label: 'Ciclistas', deaths: 88, injuries: 2052 },
		{ label: 'Otros', deaths: 32, injuries: 170 }
	],
	alcohol: [
		{ label: 'Sin registro', count: 80375, color: '#929a91' },
		{ label: 'No', count: 88998, color: '#2f806c' },
		{ label: 'Sí', count: 10693, color: '#cb5948' }
	],
	driverCause: 172358
};

const page = `<!doctype html>
<html lang="es">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="theme-color" content="#f3f4ef">
	<title>Accidentes de tránsito | Cifras 2015</title>
	<style>
		:root {
			color-scheme: light;
			--ink: #202b27;
			--muted: #707a73;
			--line: #e3e7e0;
			--paper: #ffffff;
			--canvas: #f3f4ef;
			--green: #2f806c;
			--green-dark: #205746;
			--coral: #cb5948;
			--gold: #e0a13a;
			--gray: #929a91;
		}
		* { box-sizing: border-box; }
		body {
			margin: 0;
			background: var(--canvas);
			color: var(--ink);
			font-family: 'Trebuchet MS', 'Gill Sans', sans-serif;
			font-size: 14px;
			line-height: 1.45;
		}
		button, a { font: inherit; }
		.top-band {
			background-color: #e9eee7;
			background-image: linear-gradient(90deg, rgba(47,128,108,.07) 1px, transparent 1px), linear-gradient(rgba(47,128,108,.07) 1px, transparent 1px);
			background-size: 24px 24px;
			border-bottom: 1px solid #dce4dc;
		}
		.wrap { width: min(1240px, calc(100% - 48px)); margin: 0 auto; }
		header { padding: 28px 0 24px; }
		.header-row { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }
		.eyebrow { margin: 0 0 7px; color: var(--green-dark); font-size: 11px; font-weight: 700; letter-spacing: 1.3px; text-transform: uppercase; }
		h1 { margin: 0; font-family: Georgia, 'Palatino Linotype', serif; font-size: 34px; font-weight: 500; line-height: 1.1; }
		.subtitle { margin: 8px 0 0; color: #59665e; font-size: 14px; }
		.source-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 11px; border: 1px solid #cbd8ce; background: rgba(255,255,255,.68); color: var(--green-dark); font-size: 12px; font-weight: 700; white-space: nowrap; }
		.source-badge::before { width: 7px; height: 7px; border-radius: 50%; background: var(--green); content: ''; }
		nav { display: flex; gap: 22px; padding-top: 22px; }
		nav a { color: #536159; font-size: 12px; font-weight: 700; text-decoration: none; }
		nav a:hover, nav a:focus-visible { color: var(--green-dark); text-decoration: underline; }
		main { padding: 22px 0 48px; }
		.section-label { margin: 0 0 12px; color: var(--muted); font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
		.kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 18px; }
		.kpi { min-height: 112px; padding: 17px 18px; border: 1px solid var(--line); border-top: 3px solid var(--green); background: var(--paper); }
		.kpi:nth-child(2) { border-top-color: var(--coral); }
		.kpi:nth-child(3) { border-top-color: var(--gold); }
		.kpi:nth-child(4) { border-top-color: #78877e; }
		.kpi-label { display: block; color: var(--muted); font-size: 12px; }
		.kpi-value { display: block; margin-top: 8px; font-size: 29px; font-weight: 700; letter-spacing: 0; line-height: 1; font-variant-numeric: tabular-nums; }
		.kpi-note { display: block; margin-top: 7px; color: var(--muted); font-size: 11px; }
		.grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 14px; }
		.panel { min-width: 0; padding: 18px; border: 1px solid var(--line); background: var(--paper); }
		.span-8 { grid-column: span 8; }
		.span-7 { grid-column: span 7; }
		.span-6 { grid-column: span 6; }
		.span-5 { grid-column: span 5; }
		.span-4 { grid-column: span 4; }
		.panel-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 17px; }
		h2 { margin: 0; font-size: 15px; font-weight: 700; }
		.panel-subtitle { margin: 4px 0 0; color: var(--muted); font-size: 11px; }
		.unit { color: var(--muted); font-size: 10px; white-space: nowrap; }
		.month-chart { display: grid; grid-template-columns: repeat(12, minmax(30px, 1fr)); align-items: end; gap: 8px; min-height: 190px; padding: 12px 4px 0; border-bottom: 1px solid var(--line); overflow-x: auto; }
		.month-column { display: flex; min-width: 30px; height: 168px; flex-direction: column; align-items: center; justify-content: flex-end; gap: 6px; padding: 0; border: 0; background: none; color: var(--muted); cursor: pointer; }
		.month-value { font-size: 9px; font-variant-numeric: tabular-nums; }
		.month-track { display: flex; width: min(100%, 34px); height: 123px; align-items: flex-end; }
		.month-bar { display: block; width: 100%; min-height: 4px; background: #a9c9bb; transition: background .16s ease, filter .16s ease; }
		.month-column:hover .month-bar, .month-column:focus-visible .month-bar, .month-column.is-peak .month-bar { background: var(--green); }
		.month-label { padding-bottom: 8px; font-size: 10px; }
		.chart-note { display: flex; justify-content: space-between; gap: 12px; margin-top: 12px; color: var(--muted); font-size: 11px; }
		.chart-note strong { color: var(--ink); }
		.rows { display: grid; gap: 12px; }
		.bar-row { display: grid; grid-template-columns: minmax(75px, 105px) 1fr auto; align-items: center; gap: 10px; }
		.bar-label { color: #46534b; font-size: 11px; }
		.bar-track { height: 9px; background: #edf0eb; }
		.bar-fill { height: 100%; background: var(--green); }
		.bar-count { color: var(--ink); font-size: 11px; font-variant-numeric: tabular-nums; text-align: right; }
		.weekday-row.is-peak .bar-fill { background: var(--coral); }
		.legend { display: flex; flex-wrap: wrap; gap: 10px 16px; margin-top: 15px; }
		.legend-item { display: inline-flex; align-items: center; gap: 6px; color: #59645d; font-size: 10px; }
		.legend-dot { width: 8px; height: 8px; flex: 0 0 8px; border-radius: 50%; }
		.stacked-track { display: flex; width: 100%; height: 17px; overflow: hidden; background: #edf0eb; }
		.stacked-track span { display: block; height: 100%; }
		.severity-list { display: grid; gap: 12px; margin-top: 18px; }
		.severity-item { display: grid; grid-template-columns: 10px 1fr auto; align-items: center; gap: 9px; font-size: 12px; }
		.severity-item .number { font-weight: 700; font-variant-numeric: tabular-nums; }
		.hour-chart { display: grid; grid-template-columns: repeat(24, minmax(12px, 1fr)); align-items: end; gap: 4px; height: 132px; padding: 10px 0 0; border-bottom: 1px solid var(--line); overflow-x: auto; }
		.hour-column { display: flex; min-width: 12px; height: 110px; flex-direction: column; align-items: center; justify-content: flex-end; gap: 5px; color: var(--muted); font-size: 9px; }
		.hour-bar { width: 100%; min-height: 2px; background: #e7bd72; }
		.hour-column.is-peak .hour-bar { background: var(--coral); }
		.victim-table { display: grid; gap: 13px; }
		.victim-head, .victim-row { display: grid; grid-template-columns: minmax(78px, .8fr) minmax(100px, 1.4fr) minmax(100px, 1.4fr); align-items: center; gap: 12px; }
		.victim-head { padding-bottom: 8px; border-bottom: 1px solid var(--line); color: var(--muted); font-size: 10px; }
		.victim-head span:nth-child(n+2) { text-align: right; }
		.victim-name { font-size: 11px; }
		.victim-cell { display: grid; grid-template-columns: minmax(20px, 1fr) auto; align-items: center; gap: 7px; }
		.victim-cell .bar-track { height: 6px; }
		.victim-cell.deaths .bar-fill { background: var(--coral); }
		.victim-cell.injuries .bar-fill { background: var(--gold); }
		.victim-value { min-width: 42px; color: var(--ink); font-size: 10px; font-variant-numeric: tabular-nums; text-align: right; }
		.callout { margin-top: 15px; padding: 11px 12px; border-left: 3px solid var(--gold); background: #fbf6eb; color: #5e513a; font-size: 11px; }
		.type-list { display: grid; gap: 16px; }
		.type-item { display: grid; gap: 6px; }
		.type-topline { display: flex; justify-content: space-between; gap: 12px; font-size: 11px; }
		.type-topline span:last-child { white-space: nowrap; font-weight: 700; font-variant-numeric: tabular-nums; }
		.type-item .bar-fill { background: #6b9f8c; }
		.type-item:first-child .bar-fill { background: var(--green); }
		.alcohol-list { display: grid; gap: 13px; }
		.alcohol-row { display: grid; grid-template-columns: 85px 1fr auto; align-items: center; gap: 10px; }
		.alcohol-row .bar-fill { background: var(--gray); }
		.alcohol-row.is-no .bar-fill { background: var(--green); }
		.alcohol-row.is-yes .bar-fill { background: var(--coral); }
		.alcohol-note { margin: 15px 0 0; color: var(--muted); font-size: 11px; }
		.footer-note { margin-top: 16px; padding: 15px 17px; border: 1px solid #d9dfd8; background: #ecefe9; color: #58635b; font-size: 11px; }
		.footer-note strong { color: var(--ink); }
		footer { padding: 20px 0 30px; color: var(--muted); font-size: 10px; }
		button:focus-visible, a:focus-visible { outline: 2px solid var(--green-dark); outline-offset: 3px; }
		@media (max-width: 900px) {
			.span-8, .span-7, .span-6, .span-5, .span-4 { grid-column: span 6; }
			.span-8, .span-7 { grid-column: span 12; }
		}
		@media (max-width: 620px) {
			.wrap { width: min(100% - 28px, 500px); }
			header { padding-top: 22px; }
			.header-row { align-items: flex-start; flex-direction: column; gap: 14px; }
			h1 { font-size: 29px; }
			nav { gap: 16px; padding-top: 17px; overflow-x: auto; }
			.kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
			.kpi { min-height: 100px; padding: 13px; }
			.kpi-value { font-size: 25px; }
			.span-8, .span-7, .span-6, .span-5, .span-4 { grid-column: span 12; }
			.panel { padding: 15px 13px; }
			.month-chart { grid-template-columns: repeat(12, 38px); gap: 5px; }
			.month-column { width: 38px; }
			.bar-row { grid-template-columns: 84px 1fr auto; gap: 7px; }
			.victim-head, .victim-row { grid-template-columns: 70px minmax(75px, 1fr) minmax(75px, 1fr); gap: 7px; }
			.victim-cell { grid-template-columns: minmax(12px, 1fr) auto; gap: 5px; }
			.victim-value { min-width: 37px; font-size: 9px; }
			.hour-chart { grid-template-columns: repeat(24, 18px); gap: 5px; }
		}
		@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; } }
	</style>
</head>
<body>
	<div class="top-band">
		<div class="wrap">
			<header>
				<div class="header-row">
					<div>
						<p class="eyebrow">Observatorio vial · archivo anual</p>
						<h1>Accidentes de tránsito</h1>
						<p class="subtitle">Cifras definitivas · 2015</p>
					</div>
					<div class="source-badge">180 mil registros analizados</div>
				</div>
				<nav aria-label="Secciones del tablero">
					<a href="#panorama">Panorama</a>
					<a href="#tiempo">Cuándo ocurren</a>
					<a href="#personas">Personas afectadas</a>
					<a href="#contexto">Contexto del registro</a>
				</nav>
			</header>
		</div>
	</div>
	<main class="wrap">
		<section id="panorama" aria-labelledby="overview-label">
			<p class="section-label" id="overview-label">Resumen ejecutivo</p>
			<div class="kpis">
				<article class="kpi"><span class="kpi-label">Registros</span><strong class="kpi-value" data-number="total">180.066</strong><span class="kpi-note">en el conjunto analizado</span></article>
				<article class="kpi"><span class="kpi-label">Personas fallecidas</span><strong class="kpi-value" data-number="deaths">2.061</strong><span class="kpi-note">suma de víctimas reportadas</span></article>
				<article class="kpi"><span class="kpi-label">Personas heridas</span><strong class="kpi-value" data-number="injuries">51.132</strong><span class="kpi-note">suma de víctimas reportadas</span></article>
				<article class="kpi"><span class="kpi-label">Registros fatales</span><strong class="kpi-value" id="fatalShare">1,0%</strong><span class="kpi-note">del total de registros</span></article>
			</div>
		</section>

		<div class="grid">
			<section class="panel span-8" id="tiempo" aria-labelledby="month-title">
				<div class="panel-head"><div><h2 id="month-title">El año, mes a mes</h2><p class="panel-subtitle">Distribución de registros por mes</p></div><span class="unit">registros</span></div>
				<div class="month-chart" id="monthChart" role="img" aria-label="Registros por mes"></div>
				<div class="chart-note"><span id="monthInsight">Diciembre registra el mayor volumen.</span><span>Máximo mensual: <strong>15.914</strong></span></div>
			</section>

			<section class="panel span-4" aria-labelledby="severity-title">
				<div class="panel-head"><div><h2 id="severity-title">Gravedad registrada</h2><p class="panel-subtitle">Clasificación de los accidentes</p></div></div>
				<div class="stacked-track" id="severityChart" role="img" aria-label="Proporción de registros por gravedad"></div>
				<div class="severity-list" id="severityList"></div>
				<p class="callout">Un registro fatal puede incluir más de una persona fallecida.</p>
			</section>

			<section class="panel span-7" aria-labelledby="weekday-title">
				<div class="panel-head"><div><h2 id="weekday-title">Más actividad el fin de semana</h2><p class="panel-subtitle">Registros por día de la semana</p></div><span class="unit">registros</span></div>
				<div class="rows" id="weekdayChart"></div>
			</section>

			<section class="panel span-5" aria-labelledby="hour-title">
				<div class="panel-head"><div><h2 id="hour-title">Ritmo durante el día</h2><p class="panel-subtitle">Registros por hora de ocurrencia</p></div><span class="unit">00–23 h</span></div>
				<div class="hour-chart" id="hourChart" role="img" aria-label="Registros por hora"></div>
				<div class="chart-note"><span>Pico: <strong>14:00</strong></span><span>12.049 registros</span></div>
			</section>

			<section class="panel span-7" id="personas" aria-labelledby="victims-title">
				<div class="panel-head"><div><h2 id="victims-title">Quiénes resultan afectados</h2><p class="panel-subtitle">Fallecidos y heridos por tipo de usuario</p></div></div>
				<div class="victim-table" id="victimChart"></div>
				<div class="legend"><span class="legend-item"><i class="legend-dot" style="background:var(--coral)"></i>Fallecidos</span><span class="legend-item"><i class="legend-dot" style="background:var(--gold)"></i>Heridos</span></div>
			</section>

			<section class="panel span-5" aria-labelledby="type-title">
				<div class="panel-head"><div><h2 id="type-title">Tipos de accidente más frecuentes</h2><p class="panel-subtitle">Principales categorías del archivo</p></div></div>
				<div class="type-list" id="typeChart"></div>
			</section>

			<section class="panel span-6" id="contexto" aria-labelledby="alcohol-title">
				<div class="panel-head"><div><h2 id="alcohol-title">Registro de alcohol</h2><p class="panel-subtitle">Estado consignado en el archivo</p></div></div>
				<div class="alcohol-list" id="alcoholChart"></div>
				<p class="alcohol-note">En el 44,6% de los registros este dato se ignora; no debe leerse como ausencia de alcohol.</p>
			</section>

			<section class="panel span-6" aria-labelledby="cause-title">
				<div class="panel-head"><div><h2 id="cause-title">Categoría de causa reportada</h2><p class="panel-subtitle">Valor consignado en el campo CAUSAACCI</p></div></div>
				<div class="kpi" style="border-top-color:var(--green);padding:18px 16px;min-height:0">
					<span class="kpi-label">Conductor</span>
					<strong class="kpi-value" id="driverCause">172.358</strong>
					<span class="kpi-note" id="driverShare">95,7% de los registros</span>
				</div>
				<p class="alcohol-note">Es una categoría del campo de causa; por sí sola no explica las circunstancias de cada accidente.</p>
			</section>
		</div>
		<aside class="footer-note"><strong>Lectura responsable.</strong> Las cifras describen los registros del archivo. Los campos sin información pueden sesgar comparaciones; para comparar riesgo entre municipios se necesitaría añadir población o volumen de tránsito.</aside>
	</main>
	<footer class="wrap">Fuente: Accidentes_cifra2015.xlsx · cifras definitivas · visualización elaborada a partir del resumen del archivo.</footer>
	<script>
		const DATA = ${JSON.stringify(data)};
		const numberFormat = new Intl.NumberFormat('es-MX');
		const percentFormat = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
		const fmt = (value) => numberFormat.format(value);
		const el = (tag, className, text) => {
			const node = document.createElement(tag);
			if (className) node.className = className;
			if (text !== undefined) node.textContent = text;
			return node;
		};

		document.querySelector('[data-number="total"]').textContent = fmt(DATA.total);
		document.querySelector('[data-number="deaths"]').textContent = fmt(DATA.deaths);
		document.querySelector('[data-number="injuries"]').textContent = fmt(DATA.injuries);
		document.getElementById('fatalShare').textContent = percentFormat.format(DATA.severity[2].count / DATA.total * 100) + '%';
		document.getElementById('driverCause').textContent = fmt(DATA.driverCause);
		document.getElementById('driverShare').textContent = percentFormat.format(DATA.driverCause / DATA.total * 100) + '% de los registros';

		const monthRoot = document.getElementById('monthChart');
		const maxMonth = Math.max.apply(null, DATA.months.map((item) => item.count));
		DATA.months.forEach((item) => {
			const column = el('button', 'month-column' + (item.count === maxMonth ? ' is-peak' : ''));
			column.type = 'button';
			column.title = item.label + ': ' + fmt(item.count) + ' registros';
			column.setAttribute('aria-label', column.title);
			const value = el('span', 'month-value', (item.count / 1000).toFixed(1).replace('.', ',') + 'k');
			const track = el('span', 'month-track');
			const bar = el('span', 'month-bar');
			bar.style.height = (item.count / maxMonth * 100) + '%';
			track.append(bar);
			const label = el('span', 'month-label', item.label);
			column.append(value, track, label);
			monthRoot.append(column);
		});

		const severityRoot = document.getElementById('severityChart');
		const severityList = document.getElementById('severityList');
		DATA.severity.forEach((item) => {
			const share = item.count / DATA.total * 100;
			const segment = el('span');
			segment.style.width = share + '%';
			segment.style.backgroundColor = item.color;
			segment.title = item.label + ': ' + fmt(item.count) + ' (' + percentFormat.format(share) + '%)';
			severityRoot.append(segment);
			const row = el('div', 'severity-item');
			const dot = el('i', 'legend-dot');
			dot.style.backgroundColor = item.color;
			const label = el('span', '', item.label + ' · ' + percentFormat.format(share) + '%');
			const count = el('span', 'number', fmt(item.count));
			row.append(dot, label, count);
			severityList.append(row);
		});

		const weekdayRoot = document.getElementById('weekdayChart');
		const maxWeekday = Math.max.apply(null, DATA.weekdays.map((item) => item.count));
		DATA.weekdays.forEach((item) => {
			const row = el('div', 'bar-row weekday-row' + (item.count === maxWeekday ? ' is-peak' : ''));
			const label = el('span', 'bar-label', item.label);
			const track = el('div', 'bar-track');
			const fill = el('div', 'bar-fill');
			fill.style.width = (item.count / maxWeekday * 100) + '%';
			track.append(fill);
			row.append(label, track, el('span', 'bar-count', fmt(item.count)));
			weekdayRoot.append(row);
		});

		const hourRoot = document.getElementById('hourChart');
		const maxHour = Math.max.apply(null, DATA.hours);
		DATA.hours.forEach((count, hour) => {
			const column = el('div', 'hour-column' + (count === maxHour ? ' is-peak' : ''));
			column.title = String(hour).padStart(2, '0') + ':00 · ' + fmt(count) + ' registros';
			const bar = el('span', 'hour-bar');
			bar.style.height = (count / maxHour * 100) + '%';
			column.append(bar, el('span', '', String(hour).padStart(2, '0')));
			hourRoot.append(column);
		});

		const victimRoot = document.getElementById('victimChart');
		const victimHead = el('div', 'victim-head');
		victimHead.append(el('span', '', 'Usuario'), el('span', '', 'Fallecidos'), el('span', '', 'Heridos'));
		victimRoot.append(victimHead);
		DATA.victims.forEach((item) => {
			const row = el('div', 'victim-row');
			row.append(el('span', 'victim-name', item.label));
			[['deaths', item.deaths, DATA.deaths, 'deaths'], ['injuries', item.injuries, DATA.injuries, 'injuries']].forEach(([key, count, total, className]) => {
				const cell = el('div', 'victim-cell ' + className);
				const track = el('div', 'bar-track');
				const fill = el('div', 'bar-fill');
				fill.style.width = (count / total * 100) + '%';
				track.append(fill);
				cell.append(track, el('span', 'victim-value', fmt(count)));
				row.append(cell);
			});
			victimRoot.append(row);
		});

		const typeRoot = document.getElementById('typeChart');
		DATA.types.forEach((item) => {
			const row = el('div', 'type-item');
			const topline = el('div', 'type-topline');
			topline.append(el('span', '', item.label), el('span', '', fmt(item.count)));
			const track = el('div', 'bar-track');
			const fill = el('div', 'bar-fill');
			fill.style.width = (item.count / DATA.total * 100) + '%';
			track.append(fill);
			row.append(topline, track);
			typeRoot.append(row);
		});

		const alcoholRoot = document.getElementById('alcoholChart');
		DATA.alcohol.forEach((item) => {
			const slug = item.label === 'No' ? ' is-no' : item.label === 'Sí' ? ' is-yes' : '';
			const row = el('div', 'alcohol-row' + slug);
			const label = el('span', 'bar-label', item.label);
			const track = el('div', 'bar-track');
			const fill = el('div', 'bar-fill');
			fill.style.width = (item.count / DATA.total * 100) + '%';
			track.append(fill);
			row.append(label, track, el('span', 'bar-count', fmt(item.count)));
			alcoholRoot.append(row);
		});
	</script>
</body>
</html>`;

const port = Number(process.env.PORT) || 3000;
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
	response.end(page);
});

server.listen(port, '127.0.0.1', () => {
	console.log('Tablero disponible en http://localhost:' + port);
});
