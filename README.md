# Accidentes de tránsito 2015

Tres dashboards locales para explorar estadísticas del archivo `Accidentes_cifra2015.xlsx`.

## Blog React

Requiere Node.js 20.19 o posterior.

```sh
npm install
npm run dev
```

El blog queda en `http://localhost:5173`. Para compilar la versión de producción, ejecuta `npm run build`.

### Docker

Construye la imagen y arranca el blog de producción con:

```sh
docker compose up --build -d
```

Abre `http://localhost:8080`. Para detenerlo, ejecuta `docker compose down`. Compose contiene el blog React; los tres dashboards Node siguen ejecutándose de forma independiente.

## Dashboards Node

Los tres dashboards independientes siguen disponibles sin dependencias adicionales:

## Ejecutar

Inicia cada tablero en una terminal distinta:

```sh
node dashboards/index.js
node dashboards/dashboard.js
node dashboards/victimas.js
```

- `http://localhost:3000`: resumen general
- `http://localhost:3001`: cruces de severidad
- `http://localhost:3002`: perfil de víctimas fatales

## Datos

El libro contiene 180.066 registros. Las visualizaciones muestran agregados calculados del archivo; no vuelven a leer el Excel al iniciar. Las proporciones representan registros clasificados como fatales sobre los registros del grupo, no riesgo individual ni causalidad. Los campos ignorados o sin dato se señalan en los tableros.
