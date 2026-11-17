# Mi Agenda con Neon

Estructura del repo:

```
index.html        la agenda (se sincroniza con /api/state)
api/state.js      función serverless que habla con Neon
package.json      dependencia @neondatabase/serverless
```

## Pasos para publicarla

1. Sube estos tres archivos a la raíz de tu repo de GitHub (`index.html`, `package.json` y la carpeta `api/`).
2. En vercel.com: **Add New → Project** e importa el repo.
3. Antes de desplegar, en **Environment Variables** añade:
   - `DATABASE_URL`: la cadena de conexión de Neon (proyecto `agenda`, botón *Connect* en la consola de Neon).
   - `AGENDA_TOKEN`: una clave inventada por ti, larga (por ejemplo 20+ caracteres). Es la contraseña de tu agenda.
4. Despliega. La primera vez que abras la web te pedirá esa clave; el navegador la recuerda.

La primera sincronización sube a Neon lo que ya tengas en ese navegador. Después, cada cambio se guarda en el navegador y en Neon.

## Notas

- Sin la clave nadie puede leer ni escribir tus datos.
- Si abres `index.html` como archivo, o no hay conexión, sigue funcionando en modo local.
- Conflictos: gana siempre la versión más reciente.
- No subas nunca `DATABASE_URL` ni `AGENDA_TOKEN` al repo: van solo en Vercel.
