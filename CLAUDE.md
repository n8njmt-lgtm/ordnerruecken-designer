# Ordnerrücken-Designer - Projekt Kontext

> ⚠️ **WICHTIG:** Diese Datei wird bei jeder Änderung automatisch aktualisiert!

## Projektübersicht
Web-Anwendung zum Erstellen und Drucken von Ordnerrücken-Etiketten für **Avery Zweckform C32267** (54 × 190 mm, 5 Etiketten pro A4-Blatt).

**Auftraggeber:** Ralf (JMTronic)
**Tech-Stack:** React 18 + TypeScript + Vite + Tailwind CSS v4
**Status:** ✅ Fertig (alle Features implementiert)

---

## 🚀 App starten (für Benutzer)

### Starten:
**Doppelklick** auf `Ordnerruecken-Designer.command`
- Startet Server im Hintergrund
- Öffnet Browser automatisch
- Terminal schließt sich automatisch

### Beenden:
**Doppelklick** auf `Ordnerruecken-Designer-Stoppen.command`
- Beendet den Server im Hintergrund

### Manuell (Terminal):
```bash
cd ~/Documents/github/Claude_CoWork_Projekt/ordnerruecken-designer
npm run dev
# Browser: http://localhost:5173/
```

---

## Hauptfunktionen

### 1. Etikettenbearbeitung
- **Kopfzeile & Textbereich** mit individueller Formatierung
- **Schriftarten:** Inter, Roboto, Arial, Times New Roman, etc.
- **Textausrichtung:** Links, Zentriert, Rechts
- **Textorientierung:** Horizontal/Vertikal
- **Rotation:** 0°, 90°, 180°, 270° für alle Elemente

### 2. Trennlinie
- **Sichtbarkeit:** Ein/Aus
- **Stil:** Durchgezogen, Gestrichelt, Gepunktet
- **Stärke:** 1-10px
- **Höhe:** 10-100% (vertikale Ausdehnung)
- **Horizontale Position:** 10-90% (Header-Anteil, mit Slider + Eingabefeld)
- **Vertikale Position:** 0-100% (Position innerhalb des Bereichs)
- **Rotation:** 0°, 90°, 180°, 270°

### 3. Symbole/Icons
- Finanz- & Währungssymbole (€, $, £, ¥, ₿)
- Buchhaltungssymbole (∑, ±, ÷, ×)
- Dokument-Icons (📁, 📄, 📊)
- Geschäftssymbole (✓, ✗, ★, →)
- Position: Links, Mitte, Rechts
- Größe und Farbe anpassbar

### 4. Vorlagen-System
6 vordefinierte Vorlagen:
- Leer, Klassisch, Geschäftlich, Farbig, Minimal, Archiv

### 5. Projekt-Management
- **JSON Export/Import** für Projekte
- **LocalStorage** Unterstützung
- Projektname, Erstellungsdatum, Version

### 6. Multi-Seiten-Druck
- Bis zu 100 Etiketten (20 Seiten)
- Automatische Seitenumbrüche
- Druckränder anpassbar
- Testdruck mit Messlinien

---

## UI/UX Features

### Layout
- **Querformat** als Standard-Ansicht (90° rotiert)
- **Dunklerer Hintergrund** (slate-400 bis slate-500 Gradient)
- **Weiße Arbeitsbereiche** mit Schatten
- **A4-Vorschau** mit Scale 1.0 im Querformat

### Sidebar (Rechts)
Moderne Tab-basierte Sidebar mit 3 Tabs:
1. **Design** (Palette-Icon) - Etikett bearbeiten
2. **Symbol** (Sparkles-Icon) - Symbol/Bild hinzufügen
3. **Drucken** (Printer-Icon) - Druckeinstellungen

### Toolbar (Oben)
- JMTronic Logo + "Powered by JMTronic/Ai" (JM und Ai in Rot)
- Vorlagen-Button
- + Etikett Button
- Duplizieren/Löschen Buttons
- Projekt speichern/laden

### Interaktionen
- **Klick auf leeres A4-Blatt** erstellt automatisch ein Etikett
- **Etiketten-Sortierung** mit Hoch/Runter-Buttons
- **Hoch/Querformat-Toggle**

---

## Dateistruktur

```
ordnerruecken-designer/
├── Ordnerruecken-Designer.command          # 🚀 Doppelklick zum Starten!
├── Ordnerruecken-Designer-Stoppen.command  # 🛑 Doppelklick zum Beenden!
├── CLAUDE.md                               # Diese Kontext-Datei
├── .claude/
│   └── commands/
│       └── deploy.md                       # 🚀 /deploy Skill für Vercel
├── public/
│   └── Logo_JM.png                         # JMTronic Logo
├── src/
│   ├── components/
│   │   ├── A4Preview.tsx                   # A4-Blatt Vorschau
│   │   ├── LabelEditor.tsx                 # Etikett-Editor (Sidebar)
│   │   ├── LabelPreview.tsx                # Einzelnes Etikett
│   │   ├── PrintSettings.tsx               # Druckeinstellungen
│   │   ├── ProjectManager.tsx              # Speichern/Laden
│   │   ├── Sidebar.tsx                     # Tab-basierte Sidebar
│   │   ├── SymbolPicker.tsx                # Symbol-Auswahl
│   │   ├── TemplateSelector.tsx            # Vorlagen-Modal
│   │   └── Toolbar.tsx                     # Haupt-Toolbar
│   ├── types/
│   │   └── index.ts                        # TypeScript Definitionen
│   ├── App.tsx                             # Hauptkomponente
│   ├── index.css                           # Tailwind + Print Styles
│   └── main.tsx                            # Entry Point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Wichtige Type-Definitionen

```typescript
// Etikett-Maße
LABEL_FORMATS.standard = {
  width: 54,      // mm (Ordnerrückenbreite)
  height: 190,    // mm (Etikettenlänge)
  labelsPerSheet: 5
}

// Trennlinie
interface Divider {
  visible: boolean;
  color: string;
  thickness: number;         // 1-10 px
  height: number;            // 10-100 %
  verticalPosition: number;  // 0-100 %
  horizontalPosition: number; // 10-90 % (Header-Anteil)
  style: 'solid' | 'dashed' | 'dotted';
  rotation: 0 | 90 | 180 | 270;
}

// Textbereich
interface TextSection {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  color: string;
  textAlign: 'left' | 'center' | 'right';
  orientation: 'horizontal' | 'vertical';
  rotation: 0 | 90 | 180 | 270;
}
```

---

## Bekannte Besonderheiten

1. **Etiketten-Ausrichtung:** Etiketten liegen quer auf dem A4-Blatt (190mm breit × 54mm hoch effektiv)
2. **Querformat-Anzeige:** A4-Vorschau wird um 90° im Uhrzeigersinn rotiert für bessere Bearbeitung
3. **Print-CSS:** Separate Styles für @media print, verhindert leere zweite Seite

---

## Deployment

**Live-URL:** https://ordnerruecken-designer.vercel.app

### Automatisches Deployment mit Skill

```
/deploy
```

Dieser Skill führt automatisch Build und Deployment zu Vercel durch.

### Manuelles Deployment

```bash
npm run build && \
mkdir -p .vercel/output/static && \
cp -r dist/* .vercel/output/static/ && \
echo '{"version": 3}' > .vercel/output/config.json && \
npx vercel deploy --prebuilt --prod --yes
```

---

## Entwicklung (für Entwickler)

```bash
# Starten
npm run dev

# Build
npm run build

# TypeScript Check
npx tsc -b
```

---

## Changelog

### Februar 2026 - Version 1.0 (Initial Release)
- ✅ Grundfunktionen: Etiketten erstellen, bearbeiten, drucken
- ✅ Vorlagen-System mit 6 Templates
- ✅ Symbol-Editor mit Finanz-Symbolen
- ✅ Projekt speichern/laden (JSON)
- ✅ Multi-Seiten-Druck
- ✅ 90°-Rotation für alle Elemente
- ✅ Moderne Tab-Sidebar
- ✅ Querformat als Standard
- ✅ Horizontale Trennlinien-Position mit Eingabefeld
- ✅ Modernes Design (dunkler Hintergrund)
- ✅ Klick auf leeres Blatt erstellt Etikett
- ✅ JMTronic Branding
- ✅ Start-Skript für Mac (Doppelklick)

### Februar 2026 - Version 1.1
- ✅ Mehrzeilige Texteingabe für Kopfzeile und Textbereich (Enter für Zeilenumbruch)
- ✅ Vercel Deployment eingerichtet (https://ordnerruecken-designer.vercel.app)
- ✅ `/deploy` Skill für automatisches Deployment

### Bugfixes
- 🐛 Fix: Horizontale Trennlinien-Position wird jetzt auch beim Drucken korrekt angewendet (PrintLabel Komponente)

---

## Kontakt
- **Benutzer:** Ralf
- **Email:** n8njmt@gmail.com
- **Firma:** JMTronic

---

*Letzte Aktualisierung: Februar 2026*
