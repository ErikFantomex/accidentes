# Accidentes de tránsito 2015

Dos dashboards locales para explorar estadísticas del archivo `Accidentes_cifra2015.xlsx`.

## Requisitos

- Node.js 18 o posterior
- No requiere dependencias externas

## Ejecutar

Inicia cada tablero en una terminal distinta:

```sh
node index.js
node dashboard.js
```

Abre `http://localhost:3000` para el resumen general y `http://localhost:3001` para los cruces de severidad.

## Datos

El libro contiene 180.066 registros. Las visualizaciones muestran agregados calculados del archivo; no vuelven a leer el Excel al iniciar. Las proporciones representan registros clasificados como fatales sobre los registros del grupo, no riesgo individual ni causalidad. Los campos ignorados o sin dato se señalan en los tableros.
