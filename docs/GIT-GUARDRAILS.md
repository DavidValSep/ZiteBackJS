# Guardrails Git: evitar commits/push accidentales

Este documento explica cómo activar protecciones locales para:
- Exigir confirmación explícita en los mensajes de commit.
- Bloquear push directo a `main` salvo excepción puntual.

No ejecuta nada automáticamente. Tú decides cuándo activar.

---

## 1) Activar hooks nativos (sin dependencias)

Los hooks están versionados en `.githooks/`. Para que Git los use:

```powershell
# Dentro del repo (ejecuta cuando quieras)
git config core.hooksPath .githooks
```

Revertir a comportamiento por defecto:
```powershell
git config --unset core.hooksPath
```

---

## 2) ¿Qué hacen estos hooks?

- `.githooks/commit-msg` (revisa el mensaje del commit)
  - Bloquea el commit si el mensaje NO contiene `[ok]` o `[human]` (case-insensitive).
  - Objetivo: evitar commits automáticos o accidentales. Debe existir una señal explícita.
  - Ejemplos válidos:
    - `[ok] chore: limpia .gitignore`
    - `feat: playlists [human]`

- `.githooks/pre-push` (se ejecuta antes del push)
  - Bloquea push directo a `main` o `master` por defecto.
  - Permite push a ramas de trabajo (feature/*) y tags.
  - Para una excepción puntual:
    - PowerShell (una vez):
      ```powershell
      $env:ALLOW_MAIN_PUSH="1"; git push origin main; Remove-Item Env:ALLOW_MAIN_PUSH
      ```

---

## 3) Flujo recomendado de trabajo

1. Crea rama de trabajo:
   ```powershell
   git checkout -b feature/tu-cambio
   ```
2. Commit con token explícito:
   ```powershell
   git commit -m "[ok] feat: agrega X"
   ```
3. Push de tu rama y PR:
   ```powershell
   git push -u origin feature/tu-cambio
   # Abre Pull Request a main
   ```
4. Merge (idealmente con regla de rama protegida en GitHub).

---

## 4) Alternativa con Husky (si prefieres)

Si deseas usar Husky (requiere Node.js):

```powershell
npm install -D husky
npm pkg set scripts.prepare="husky install"
npm run prepare
npx husky add .husky/commit-msg "node -e \"process.exit(!/\\[(ok|human)\\]/i.test(require('fs').readFileSync(process.argv[2], 'utf8')))\" %1"
npx husky add .husky/pre-push "sh .githooks/pre-push"
```

Notas:
- Mantén la misma política: `[ok]`/`[human]` en commit.
- Reutilizamos el `pre-push` ya creado para bloquear `main`.

---

## 5) Checklist y troubleshooting

- ¿No se aplican los hooks?
  - Verifica `git config core.hooksPath` → debe ser `.githooks`.
  - Checa permisos de ejecución (Git for Windows ejecuta sh por defecto).
- ¿Commit bloqueado?
  - Añade `[ok]` en el título o cuerpo del mensaje.
- ¿Push a main bloqueado?
  - Empuja una rama y abre PR, o usa `ALLOW_MAIN_PUSH=1` para una excepción.
- ¿Quiero desactivar temporalmente?
  - `git config --unset core.hooksPath`

---

## 6) Reglas de rama protegida en GitHub (complemento recomendado)

En GitHub → Settings → Branches → Add rule (main):
- Require a pull request before merging
- Require approvals (1+)
- Block force pushes
- Block deletions
- (Opcional) Require status checks

Estas reglas evitan que incluso con credenciales alguien empuje directo a `main`.
