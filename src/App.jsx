import React, { useState } from 'react';
import './styles.css';

const numberFormat = new Intl.NumberFormat('es-MX');
const percentFormat = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const totalDeaths = 2061;

const roles = [
  { name: 'Conductores', count: 895, color: '#b6483c' },
  { name: 'Pasajeros', count: 525, color: '#d28c37' },
  { name: 'Peatones', count: 521, color: '#398071' },
  { name: 'Ciclistas', count: 88, color: '#718b9a' },
  { name: 'Otros', count: 32, color: '#a2a69e' }
];

const accidentTypes = [
  { name: 'Atropellamiento', count: 523 },
  { name: 'Colisión con vehículo automotor', count: 465 },
  { name: 'Volcadura', count: 344 },
  { name: 'Colisión con objeto fijo', count: 240 },
  { name: 'Colisión con motocicleta', count: 226 },
  { name: 'Salida del camino', count: 89 },
  { name: 'Colisión con ciclista', count: 85 },
  { name: 'Caída de pasajero', count: 43 }
];

const months = [
  { name: 'Ene', count: 181 }, { name: 'Feb', count: 167 }, { name: 'Mar', count: 171 },
  { name: 'Abr', count: 178 }, { name: 'May', count: 168 }, { name: 'Jun', count: 172 },
  { name: 'Jul', count: 151 }, { name: 'Ago', count: 200 }, { name: 'Sep', count: 133 },
  { name: 'Oct', count: 163 }, { name: 'Nov', count: 215 }, { name: 'Dic', count: 162 }
];

const weekdays = [
  { name: 'Lunes', count: 277 }, { name: 'Martes', count: 208 }, { name: 'Miércoles', count: 236 },
  { name: 'Jueves', count: 215 }, { name: 'Viernes', count: 272 }, { name: 'Sábado', count: 351 },
  { name: 'Domingo', count: 488 }, { name: 'Sin especificar', count: 14 }
];

const periods = [
  { name: 'Madrugada · 00–05', count: 459 }, { name: 'Mañana · 06–11', count: 451 },
  { name: 'Tarde · 12–17', count: 470 }, { name: 'Noche · 18–23', count: 646 },
  { name: 'Sin hora válida', count: 35 }
];

function SectionTitle({ number, children }) {
  return (
    <div className="section-title">
      <span className="section-number">{number}</span>
      <h2>{children}</h2>
    </div>
  );
}

function VictimProfile() {
  return (
    <div className="profile-chart" aria-label="Personas fallecidas por tipo de usuario vial">
      {roles.map((role) => {
        const share = role.count / totalDeaths * 100;
        return (
          <div className="profile-row" key={role.name}>
            <span className="profile-name">{role.name}</span>
            <div className="profile-track" aria-hidden="true">
              <span className="profile-fill" style={{ width: `${share}%`, backgroundColor: role.color }} />
            </div>
            <span className="profile-value">{numberFormat.format(role.count)}</span>
            <span className="profile-share">{percentFormat.format(share)}%</span>
          </div>
        );
      })}
    </div>
  );
}

function AccidentTypeChart() {
  return (
    <div className="type-chart" aria-label="Personas fallecidas por tipo de accidente">
      {accidentTypes.map((type) => {
        const share = type.count / totalDeaths * 100;
        return (
          <div className="type-row" key={type.name}>
            <div className="type-heading">
              <span>{type.name}</span>
              <strong>{numberFormat.format(type.count)}</strong>
            </div>
            <div className="type-track" aria-hidden="true">
              <span style={{ width: `${type.count / accidentTypes[0].count * 100}%` }} />
            </div>
            <span className="type-share">{percentFormat.format(share)}% del total de fallecimientos</span>
          </div>
        );
      })}
    </div>
  );
}

function MonthChart({ selected, onSelect }) {
  const maxCount = Math.max(...months.map((month) => month.count));
  return (
    <div className="month-chart" role="group" aria-label="Seleccionar un mes para consultar fallecimientos">
      {months.map((month) => (
        <button
          aria-label={`${month.name}: ${numberFormat.format(month.count)} personas fallecidas`}
          aria-pressed={selected.name === month.name}
          className={`month-column${selected.name === month.name ? ' is-selected' : ''}`}
          key={month.name}
          onClick={() => onSelect(month)}
          type="button"
        >
          <span className="month-count">{month.count}</span>
          <span className="month-track" aria-hidden="true">
            <span className="month-bar" style={{ height: `${month.count / maxCount * 100}%` }} />
          </span>
          <span className="month-name">{month.name}</span>
        </button>
      ))}
    </div>
  );
}

function CountBars({ data, max, className = '' }) {
  return (
    <div className={`count-bars ${className}`}>
      {data.map((item) => (
        <div className="count-row" key={item.name}>
          <span className="count-label">{item.name}</span>
          <div className="count-track" aria-hidden="true">
            <span style={{ width: `${item.count / max * 100}%` }} />
          </div>
          <strong className="count-value">{numberFormat.format(item.count)}</strong>
        </div>
      ))}
    </div>
  );
}

const questionViews = {
  resumen: {
    label: 'Resumen',
    title: 'Las cifras que dimensionan el problema',
    intro: 'Una respuesta rápida a las preguntas sobre volumen, calendario y tipos de accidente.',
    questions: [
      ['¿Cuántos accidentes hubo y qué tan graves fueron?', '180,066 registros: 78.8% solo daños, 20.2% con heridos y 1.0% fatales (1,797). Murieron 2,061 personas y 51,132 resultaron heridas.', 'Dimensionar el problema y tener una línea base para medir si baja.'],
      ['¿Cuándo ocurren más accidentes?', 'El sábado es el día con más registros (28,773) y la hora pico es a las 14:00 (12,049). Entre meses cambia poco: de 14,027 a 15,914.', 'Repartir agentes y turnos según la demanda de cada día y hora.'],
      ['¿Qué tipos de accidente son más comunes y cuáles más letales?', 'La colisión con vehículo automotor es el 68.3% de los registros, pero solo el 0.30% es fatal. El atropellamiento (6.71%) y la volcadura (6.56%) son los más letales.', 'Priorizar cruces peatonales y control de velocidad, no solo donde hay más choques.']
    ]
  },
  severidad: {
    label: 'Severidad',
    title: 'Dónde cambia la gravedad',
    intro: 'Las proporciones comparan registros fatales dentro de cada grupo. Son asociaciones descriptivas, no pruebas de causalidad.',
    questions: [
      ['¿Cuándo son más graves?', 'De 0 a 5 h, el 1.76% de los accidentes son fatales, contra 0.69% de 12 a 17 h. El domingo llega a 1.61%, contra 0.74% el martes.', 'Organizar operativos de noche y en domingo, y más ambulancias en esas horas.'],
      ['¿El alcohol o la falta de cinturón se asocian con accidentes fatales?', 'Con aliento alcohólico, el 1.25% de los accidentes son fatales; sin él, el 0.62%. Sin cinturón, el 0.94%; con cinturón, el 0.28%.', 'Diseñar campañas de alcohol y cinturón con cifras propias, sin confundir asociación con causa.'],
      ['¿Cambia la gravedad con la edad del conductor responsable?', 'Con responsables menores de 18 años, el 1.48% de los accidentes son fatales; de 18 a 59 años, entre 0.74% y 0.80%. Es la edad del conductor, no de las víctimas.', 'Orientar la educación vial y los requisitos de licencia para conductores jóvenes.'],
      ['¿Qué tan completo es el registro?', 'El alcohol se ignora en el 44.6% de los registros y el cinturón en el 68.6%. La causa dice «Conductor» en el 95.7%.', 'Saber qué campos mejorar y qué comparaciones son confiables.']
    ]
  },
  victimas: {
    label: 'Víctimas',
    title: 'Quiénes mueren y cuándo',
    intro: 'Aquí se cuentan personas fallecidas, no accidentes. Esa diferencia cambia la lectura de las prioridades.',
    questions: [
      ['¿Quiénes mueren y quiénes se lesionan?', 'De los 2,061 muertos, 895 eran conductores, 525 pasajeros y 521 peatones. Los peatones son el 25.3% de los muertos, pero solo el 15.5% de los heridos.', 'Proteger primero a los peatones con cruces, banquetas e iluminación.'],
      ['¿Cuántas personas mueren en cada accidente fatal?', '1,616 accidentes fatales dejaron un muerto y 181 dejaron varios: 1.15 en promedio.', 'Prever atención para varias víctimas y no confundir accidentes con personas al reportar.'],
      ['¿Qué tipos de accidente dejan más muertos?', 'Atropellamiento (523), colisión con vehículo automotor (465) y volcadura (344) suman el 64.6% de los muertos.', 'Enfocar la prevención en los accidentes donde más se pierden vidas.'],
      ['¿Cuándo mueren más personas?', 'En domingo (488, contra 351 el sábado), de 18 a 23 h (646) y en noviembre (215; septiembre tuvo 133).', 'Crear un calendario de prevención para los días y horas con más muertes.']
    ]
  }
};

const openQuestions = [
  ['¿Cambian las cifras al quitar las 4,634 filas idénticas en todas sus columnas?', 'Las 45 columnas', 'Saber si los totales y picos vienen de capturas dobles.'],
  ['¿Son más letales los accidentes en zona suburbana que en la urbana?', 'URBANA, SUBURBANA, CLASACC', 'Decidir si invertir en caminos suburbanos o cruces urbanos.'],
  ['¿Qué tan letales son los accidentes con moto, y cambia de noche?', 'MOTOCICLET, ID_HORA, CLASACC', 'Orientar campañas de casco y operativos para motociclistas.'],
  ['¿Qué combinaciones pesan más, como alcohol con volcadura?', 'TIPACCID, ALIENTO, ID_HORA, CLASACC', 'Enfocar operativos donde se juntan dos condiciones.'],
  ['¿En qué horas de cada día se concentran los accidentes fatales?', 'ID_HORA, DIASEMANA, CLASACC', 'Definir horarios precisos para operativos con un mapa de calor.'],
  ['¿En cuántos accidentes huye el responsable y en qué tipos?', 'SEXO («Se fugó»), TIPACCID', 'Reforzar la investigación de conductores que huyen.'],
  ['¿Qué pares de vehículos son más letales?', 'Las 13 columnas de vehículos CAPAROD', 'Regular el transporte público y de carga.'],
  ['¿Los accidentes en calles sin pavimentar son más graves?', 'URBANA, SUBURBANA, CLASACC', 'Decidir qué calles pavimentar o dar mantenimiento primero.']
];

function QuestionCard({ question, answer, use }) {
  return (
    <article className="question-card">
      <p className="question">{question}</p>
      <p className="answer">{answer}</p>
      <p className="question-use"><span>Sirve para</span>{use}</p>
    </article>
  );
}

function QuestionsView({ view }) {
  const content = questionViews[view];
  return (
    <main className="questions-page wrap">
      <div className="questions-heading">
        <p className="eyebrow">Preguntas y utilidad · accidentes de tránsito 2015</p>
        <h1>{content.title}</h1>
        <p className="questions-intro">{content.intro}</p>
      </div>
      <section className="question-grid" aria-label={`Preguntas respondidas en ${content.label}`}>
        {content.questions.map(([question, answer, use]) => <QuestionCard key={question} question={question} answer={answer} use={use} />)}
      </section>
      {view === 'severidad' && <p className="method-note"><strong>Lectura responsable.</strong> Los campos ignorados limitan las comparaciones. Las tasas son proporciones de registros, no riesgo individual.</p>}
      {view === 'victimas' && <p className="method-note"><strong>Nota de conteo.</strong> Un accidente puede tener más de una persona fallecida; por eso 1,797 registros fatales producen 2,061 muertes.</p>}
    </main>
  );
}

function OpenQuestionsView() {
  return (
    <main className="questions-page wrap">
      <div className="questions-heading">
        <p className="eyebrow">Alcances · preguntas para profundizar</p>
        <h1>Lo que todavía se puede investigar</h1>
        <p className="questions-intro">Estas preguntas se pueden resolver con el mismo archivo, pero requieren cruces adicionales. Aquí quedan formuladas con sus columnas y utilidad.</p>
      </div>
      <section className="open-question-list" aria-label="Preguntas pendientes de análisis">
        {openQuestions.map(([question, columns, use], index) => (
          <article className="open-question" key={question}>
            <span className="open-number">{String(index + 1).padStart(2, '0')}</span>
            <div><h2>{question}</h2><p><strong>Columnas:</strong> {columns}</p><p className="question-use"><span>Serviría para</span>{use}</p></div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default function App() {
  const [selectedMonth, setSelectedMonth] = useState(months[10]);
  const [activeView, setActiveView] = useState('resumen');
  const topThreeShare = (523 + 465 + 344) / totalDeaths * 100;
  const keyUsersShare = (895 + 525 + 521) / totalDeaths * 100;

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="Bitácora Vial, inicio">
          <span className="wordmark-symbol">B</span>
          <span>Bitácora Vial<span className="wordmark-dot">.</span></span>
        </a>
        <nav className="site-nav" aria-label="Navegación de vistas">
          {Object.entries(questionViews).map(([key, view]) => <button key={key} type="button" className={activeView === key ? 'is-active' : ''} aria-pressed={activeView === key} onClick={() => setActiveView(key)}>{view.label}</button>)}
          <button type="button" className={activeView === 'blog' ? 'is-active' : ''} aria-pressed={activeView === 'blog'} onClick={() => setActiveView('blog')}>Blog</button>
          <button type="button" className={activeView === 'alcances' ? 'is-active' : ''} aria-pressed={activeView === 'alcances'} onClick={() => setActiveView('alcances')}>Alcances</button>
        </nav>
        <span className="edition">ARCHIVO 2015</span>
      </header>

      {activeView === 'alcances' ? <OpenQuestionsView /> : activeView !== 'blog' ? <QuestionsView view={activeView} /> : <main id="inicio">
        <section className="hero wrap">
          <div className="hero-copy">
            <p className="eyebrow">Una lectura de los registros viales</p>
            <h1>2.061 personas. 1.797 accidentes fatales.</h1>
            <p className="hero-deck">Contar los accidentes no es lo mismo que contar a quienes murieron. Al mirar las víctimas una por una, la estadística muestra otra escala de la pérdida.</p>
            <div className="byline">
              <span className="byline-mark">DATOS · 2015</span>
              <span>Lectura del archivo de cifras definitivas</span>
            </div>
            <a className="read-link" href="#cifra">Leer la historia <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-visual" aria-label="De 1.797 registros fatales resultaron 2.061 personas fallecidas">
            <div className="hero-visual-top"><span>PERSONAS FALLECIDAS</span><span>01 / 05</span></div>
            <strong className="hero-total">2.061</strong>
            <span className="hero-vs">en 1.797 registros fatales</span>
            <div className="hero-stack" aria-hidden="true">
              {roles.map((role) => <span key={role.name} style={{ width: `${role.count / totalDeaths * 100}%`, backgroundColor: role.color }} />)}
            </div>
            <div className="hero-legend">
              {roles.slice(0, 3).map((role) => (
                <span key={role.name}><i style={{ backgroundColor: role.color }} />{role.name} <b>{numberFormat.format(role.count)}</b></span>
              ))}
            </div>
            <span className="hero-caption">Cada segmento representa una persona fallecida.</span>
          </div>
        </section>

        <div className="story-layout wrap">
          <aside className="story-rail" aria-label="Índice del artículo">
            <span className="rail-label">EN ESTA HISTORIA</span>
            <a href="#cifra">01 <span>La diferencia</span></a>
            <a href="#personas">02 <span>Quiénes</span></a>
            <a href="#escenarios">03 <span>Los escenarios</span></a>
            <a href="#momentos">04 <span>El calendario</span></a>
            <a href="#limites">05 <span>Lo que falta</span></a>
            <span className="rail-source">180.066 registros<br />Cifras definitivas</span>
          </aside>

          <article className="story">
            <section className="story-section" id="cifra">
              <SectionTitle number="01">Una diferencia que importa</SectionTitle>
              <p className="lead">En 2015 se registraron <strong>1.797 accidentes fatales</strong>. En esos hechos murieron <strong>2.061 personas</strong>: 264 más que el número de registros.</p>
              <p>La distancia aparece porque algunos accidentes tuvieron más de una víctima fatal. En 1.616 registros hubo una persona fallecida; en 181, más de una. El promedio fue de 1,15 personas por registro fatal.</p>
              <div className="multiple-viz" aria-label="1.616 registros con una víctima fatal y 181 con varias">
                <div className="multiple-track"><span /></div>
                <div className="multiple-legend">
                  <span><i className="single-dot" />Una víctima <b>1.616</b> <small>89,9%</small></span>
                  <span><i className="multi-dot" />Varias víctimas <b>181</b> <small>10,1%</small></span>
                </div>
              </div>
            </section>

            <section className="story-section" id="personas">
              <SectionTitle number="02">La mayoría eran conductores, pasajeros o peatones</SectionTitle>
              <p>Los conductores representan el grupo más numeroso: <strong>895 personas</strong>. Pasajeros y peatones suman 1.046 más. Juntos, estos tres grupos reúnen el {percentFormat.format(keyUsersShare)}% de las víctimas fatales.</p>
              <VictimProfile />
              <p className="chart-caption">Conteos y proporción sobre las 2.061 personas fallecidas.</p>
            </section>

            <section className="story-section" id="escenarios">
              <SectionTitle number="03">Los atropellamientos encabezan los escenarios</SectionTitle>
              <p>El atropellamiento concentra <strong>523 fallecimientos</strong>, seguido por colisiones con vehículos automotores y volcaduras. Los tres primeros tipos suman el {percentFormat.format(topThreeShare)}% de las muertes registradas.</p>
              <AccidentTypeChart />
              <p className="chart-caption">Personas fallecidas agrupadas por tipo de accidente. Las categorías describen registros; no indican por sí mismas la causa.</p>
            </section>

            <section className="story-section" id="momentos">
              <SectionTitle number="04">Noviembre y los domingos, los mayores conteos</SectionTitle>
              <p>Noviembre fue el mes con más fallecimientos registrados (215); septiembre, el de menos (133). Al seleccionar un mes se muestra su conteo. Son cantidades absolutas: sin exposición al tránsito no equivalen a una tasa de riesgo.</p>
              <MonthChart selected={selectedMonth} onSelect={setSelectedMonth} />
              <p className="selection-readout" aria-live="polite"><span>{selectedMonth.name}</span><strong>{numberFormat.format(selectedMonth.count)}</strong> personas fallecidas</p>
              <div className="time-grid">
                <div>
                  <h3>Por día de la semana</h3>
                  <CountBars data={weekdays} max={488} className="weekday-bars" />
                  <p className="chart-caption">Domingo: 488. Día sin especificar: 14.</p>
                </div>
                <div>
                  <h3>Por franja horaria</h3>
                  <CountBars data={periods} max={646} className="period-bars" />
                  <p className="chart-caption">Noche: 646. Hora sin dato: 35.</p>
                </div>
              </div>
            </section>

            <section className="story-section final-section" id="limites">
              <SectionTitle number="05">Lo que el archivo no puede contar</SectionTitle>
              <p>La base permite distinguir fallecimientos por tipo de usuario y relacionarlos con el contexto del accidente, pero no asigna una edad individual a cada víctima. El campo de edad del registro no permite construir un perfil etario de las personas fallecidas.</p>
              <p>Tampoco conocemos aquí cuántas personas estuvieron expuestas al tránsito en cada momento o lugar. Por eso, esta historia describe <strong>conteos registrados</strong>; no identifica causas ni calcula el riesgo individual.</p>
              <div className="source-note"><span>FUENTE</span><p>Accidentes_cifra2015.xlsx · Cifras definitivas · 180.066 registros · Año 2015.</p></div>
            </section>
          </article>
        </div>
      </main>}

      <footer className="site-footer"><div className="wrap"><span>Bitácora Vial · Una lectura del archivo de 2015</span><a href="#inicio">Volver arriba ↑</a></div></footer>
    </div>
  );
}
