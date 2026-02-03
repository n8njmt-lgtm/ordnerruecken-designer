// Avery Zweckform Etikettenformate
export type LabelFormat = 'standard';

export interface LabelDimensions {
  width: number;  // in mm (Ordnerrückenbreite)
  height: number; // in mm (Etikettenlänge)
  name: string;
  model: string;
  labelsPerSheet: number;
  folderWidth: string;
}

// Avery Zweckform C32267 - Ordner-Einsteck-Schilder
export const LABEL_FORMATS: Record<LabelFormat, LabelDimensions> = {
  standard: {
    width: 54,
    height: 190,
    name: 'Avery C32267',
    model: 'C32267',
    labelsPerSheet: 5,
    folderWidth: '5,5 cm'
  }
};

// A4 Maße
export const A4_WIDTH = 210; // mm
export const A4_HEIGHT = 297; // mm

// Textausrichtung
export type TextAlign = 'left' | 'center' | 'right';

// Textorientierung
export type TextOrientation = 'horizontal' | 'vertical';

// Rotationswinkel
export type Rotation = 0 | 90 | 180 | 270;

// Textbereich-Typ
export interface TextSection {
  text: string;
  fontFamily: string;
  fontSize: number;       // in pt
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  color: string;
  textAlign: TextAlign;
  orientation: TextOrientation;
  rotation: Rotation;     // Drehung in Grad
}

// Trennlinie
export interface Divider {
  visible: boolean;
  color: string;
  thickness: number;      // in px
  height: number;         // in % (0-100)
  verticalPosition: number; // in % (0=oben, 50=mitte, 100=unten) - vertikale Ausrichtung
  horizontalPosition: number; // in % (10-90) - Position entlang der Etikettenlänge (Header-Anteil)
  style: 'solid' | 'dashed' | 'dotted';
  marginTop: number;      // in mm
  marginBottom: number;   // in mm
  rotation: Rotation;     // Drehung in Grad
}

// Symbol/Icon für Etiketten
export interface LabelIcon {
  type: 'symbol' | 'image';
  value: string; // Unicode-Symbol oder Base64-Image
  size: number;  // in pt
  color: string;
  position: 'left' | 'center' | 'right';
  rotation: Rotation;
}

// Einzelnes Etikett
export interface Label {
  id: string;
  format: LabelFormat;
  header: TextSection;
  divider: Divider;
  body: TextSection;
  backgroundColor: string;
  icon?: LabelIcon;
}

// Druckränder
export interface PrintMargins {
  top: number;    // in mm
  right: number;  // in mm
  bottom: number; // in mm
  left: number;   // in mm
}

// App-State
export interface AppState {
  labels: Label[];
  selectedLabelId: string | null;
  printMargins: PrintMargins;
  showPrintPreview: boolean;
}

// Verfügbare Schriftarten
export const AVAILABLE_FONTS = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Source Sans 3', value: 'Source Sans 3' },
  { name: 'Nunito', value: 'Nunito' },
  { name: 'Raleway', value: 'Raleway' },
  { name: 'PT Sans', value: 'PT Sans' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
];

// Verfügbare Symbole - Finanz & Buchhaltung
export interface SymbolCategory {
  name: string;
  symbols: { symbol: string; name: string }[];
}

export const SYMBOL_CATEGORIES: SymbolCategory[] = [
  {
    name: 'Finanzen & Währung',
    symbols: [
      { symbol: '€', name: 'Euro' },
      { symbol: '$', name: 'Dollar' },
      { symbol: '£', name: 'Pfund' },
      { symbol: '¥', name: 'Yen' },
      { symbol: '₣', name: 'Franken' },
      { symbol: '₿', name: 'Bitcoin' },
      { symbol: '¢', name: 'Cent' },
      { symbol: '‰', name: 'Promille' },
      { symbol: '%', name: 'Prozent' },
    ],
  },
  {
    name: 'Buchhaltung',
    symbols: [
      { symbol: '∑', name: 'Summe' },
      { symbol: '±', name: 'Plus/Minus' },
      { symbol: '÷', name: 'Division' },
      { symbol: '×', name: 'Multiplikation' },
      { symbol: '=', name: 'Gleich' },
      { symbol: '≠', name: 'Ungleich' },
      { symbol: '≤', name: 'Kleiner gleich' },
      { symbol: '≥', name: 'Größer gleich' },
      { symbol: '#', name: 'Nummer' },
      { symbol: '№', name: 'Numero' },
    ],
  },
  {
    name: 'Dokumente & Ordner',
    symbols: [
      { symbol: '📁', name: 'Ordner' },
      { symbol: '📂', name: 'Ordner offen' },
      { symbol: '📄', name: 'Dokument' },
      { symbol: '📋', name: 'Klemmbrett' },
      { symbol: '📑', name: 'Registerkarten' },
      { symbol: '📊', name: 'Diagramm' },
      { symbol: '📈', name: 'Aufwärtstrend' },
      { symbol: '📉', name: 'Abwärtstrend' },
      { symbol: '🗂️', name: 'Karteikasten' },
      { symbol: '🗃️', name: 'Karteikarten' },
    ],
  },
  {
    name: 'Geschäftlich',
    symbols: [
      { symbol: '✓', name: 'Häkchen' },
      { symbol: '✗', name: 'Kreuz' },
      { symbol: '★', name: 'Stern' },
      { symbol: '●', name: 'Punkt' },
      { symbol: '■', name: 'Quadrat' },
      { symbol: '▲', name: 'Dreieck' },
      { symbol: '◆', name: 'Raute' },
      { symbol: '→', name: 'Pfeil rechts' },
      { symbol: '←', name: 'Pfeil links' },
      { symbol: '↑', name: 'Pfeil hoch' },
      { symbol: '↓', name: 'Pfeil runter' },
      { symbol: '⚡', name: 'Blitz' },
    ],
  },
  {
    name: 'Kalender & Zeit',
    symbols: [
      { symbol: '📅', name: 'Kalender' },
      { symbol: '🗓️', name: 'Kalenderblatt' },
      { symbol: '⏰', name: 'Wecker' },
      { symbol: '⌛', name: 'Sanduhr' },
      { symbol: '📆', name: 'Abreißkalender' },
    ],
  },
  {
    name: 'Sonstiges',
    symbols: [
      { symbol: '⚠️', name: 'Warnung' },
      { symbol: '❗', name: 'Wichtig' },
      { symbol: '❓', name: 'Frage' },
      { symbol: '💡', name: 'Idee' },
      { symbol: '🔒', name: 'Schloss' },
      { symbol: '🔑', name: 'Schlüssel' },
      { symbol: '📌', name: 'Pinnnadel' },
      { symbol: '🏠', name: 'Haus' },
      { symbol: '🏢', name: 'Gebäude' },
      { symbol: '👤', name: 'Person' },
      { symbol: '👥', name: 'Personen' },
      { symbol: '✉️', name: 'Brief' },
    ],
  },
];

// Default Icon
export const DEFAULT_LABEL_ICON: LabelIcon = {
  type: 'symbol',
  value: '',
  size: 24,
  color: '#000000',
  position: 'center',
  rotation: 0,
};

// Default-Werte
export const DEFAULT_TEXT_SECTION: TextSection = {
  text: '',
  fontFamily: 'Inter',
  fontSize: 14,
  fontWeight: 'normal',
  fontStyle: 'normal',
  color: '#000000',
  textAlign: 'center',
  orientation: 'vertical',
  rotation: 0,
};

export const DEFAULT_DIVIDER: Divider = {
  visible: true,
  color: '#000000',
  thickness: 1,
  height: 100,
  verticalPosition: 50,
  horizontalPosition: 40, // 40% für Header, 60% für Body
  style: 'solid',
  marginTop: 3,
  marginBottom: 3,
  rotation: 0,
};

export const DEFAULT_PRINT_MARGINS: PrintMargins = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
};

// Hilfsfunktion zum Erstellen eines neuen Etiketts
export function createNewLabel(format: LabelFormat = 'standard'): Label {
  return {
    id: crypto.randomUUID(),
    format,
    header: {
      ...DEFAULT_TEXT_SECTION,
      text: 'Titel',
      fontSize: 16,
      fontWeight: 'bold',
    },
    divider: { ...DEFAULT_DIVIDER },
    body: {
      ...DEFAULT_TEXT_SECTION,
      text: '2025',
      fontSize: 12,
    },
    backgroundColor: '#ffffff',
  };
}

// Projekt-Typ für Speichern/Laden
export interface Project {
  version: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  labels: Label[];
  printMargins: PrintMargins;
}

// Vorlage-Typ
export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string; // Farbe oder Icon
  label: Omit<Label, 'id'>;
}

// Vordefinierte Vorlagen
export const TEMPLATES: Template[] = [
  {
    id: 'blank',
    name: 'Leer',
    description: 'Leeres Etikett ohne Inhalt',
    preview: '#ffffff',
    label: {
      format: 'standard',
      header: { ...DEFAULT_TEXT_SECTION, text: '', fontSize: 16, fontWeight: 'bold' },
      divider: { ...DEFAULT_DIVIDER, visible: false, horizontalPosition: 40 },
      body: { ...DEFAULT_TEXT_SECTION, text: '', fontSize: 12 },
      backgroundColor: '#ffffff',
    },
  },
  {
    id: 'classic',
    name: 'Klassisch',
    description: 'Titel und Jahr',
    preview: '#f8fafc',
    label: {
      format: 'standard',
      header: { ...DEFAULT_TEXT_SECTION, text: 'Ordner', fontSize: 18, fontWeight: 'bold' },
      divider: { ...DEFAULT_DIVIDER, visible: true, horizontalPosition: 40 },
      body: { ...DEFAULT_TEXT_SECTION, text: '2025', fontSize: 14 },
      backgroundColor: '#ffffff',
    },
  },
  {
    id: 'business',
    name: 'Geschäftlich',
    description: 'Professionelles Design',
    preview: '#1e40af',
    label: {
      format: 'standard',
      header: { ...DEFAULT_TEXT_SECTION, text: 'Firma GmbH', fontSize: 14, fontWeight: 'bold', color: '#1e40af' },
      divider: { ...DEFAULT_DIVIDER, visible: true, color: '#1e40af', thickness: 2, horizontalPosition: 35 },
      body: { ...DEFAULT_TEXT_SECTION, text: 'Buchhaltung\n2025', fontSize: 12, color: '#374151' },
      backgroundColor: '#f0f9ff',
    },
  },
  {
    id: 'colorful',
    name: 'Farbig',
    description: 'Auffälliges farbiges Design',
    preview: '#dc2626',
    label: {
      format: 'standard',
      header: { ...DEFAULT_TEXT_SECTION, text: 'WICHTIG', fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
      divider: { ...DEFAULT_DIVIDER, visible: false, horizontalPosition: 50 },
      body: { ...DEFAULT_TEXT_SECTION, text: 'Dokumente', fontSize: 12, color: '#ffffff' },
      backgroundColor: '#dc2626',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Schlichtes Design',
    preview: '#f3f4f6',
    label: {
      format: 'standard',
      header: { ...DEFAULT_TEXT_SECTION, text: '', fontSize: 14, fontWeight: 'normal' },
      divider: { ...DEFAULT_DIVIDER, visible: false, horizontalPosition: 30 },
      body: { ...DEFAULT_TEXT_SECTION, text: 'Notizen', fontSize: 16, fontWeight: 'normal', color: '#6b7280' },
      backgroundColor: '#f9fafb',
    },
  },
  {
    id: 'archive',
    name: 'Archiv',
    description: 'Für Archivordner',
    preview: '#78716c',
    label: {
      format: 'standard',
      header: { ...DEFAULT_TEXT_SECTION, text: 'ARCHIV', fontSize: 14, fontWeight: 'bold', color: '#44403c' },
      divider: { ...DEFAULT_DIVIDER, visible: true, color: '#a8a29e', style: 'dashed', horizontalPosition: 45 },
      body: { ...DEFAULT_TEXT_SECTION, text: 'Jahr\nKategorie', fontSize: 11, color: '#57534e' },
      backgroundColor: '#f5f5f4',
    },
  },
];
