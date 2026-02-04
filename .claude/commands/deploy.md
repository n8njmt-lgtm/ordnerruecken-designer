# Deploy zu Vercel

Dieser Skill baut die App und deployed sie automatisch zu Vercel.

## Ausführung

Führe die folgenden Schritte aus:

1. **Build erstellen**: Führe `npm run build` aus, um die Produktions-Version zu erstellen.

2. **Vercel-Output vorbereiten**:
   - Erstelle das Verzeichnis `.vercel/output/static` falls nicht vorhanden
   - Kopiere alle Dateien aus `dist/` nach `.vercel/output/static/`
   - Erstelle die Datei `.vercel/output/config.json` mit dem Inhalt `{"version": 3}`

3. **Deployment ausführen**: Führe `npx vercel deploy --prebuilt --prod --yes` aus.

4. **Ergebnis mitteilen**: Zeige dem Benutzer die finale URL an.

## Wichtig

- Bei Build-Fehlern: Zeige die Fehlermeldung und stoppe.
- Die App wird unter https://ordnerruecken-designer.vercel.app deployed.
- Die `.vercel/output/` Dateien sind temporär und werden nicht committed.

## Beispiel-Befehle

```bash
# Alles in einem Befehl:
npm run build && \
mkdir -p .vercel/output/static && \
cp -r dist/* .vercel/output/static/ && \
echo '{"version": 3}' > .vercel/output/config.json && \
npx vercel deploy --prebuilt --prod --yes
```
