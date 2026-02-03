import type { Label, PrintMargins } from '../types';
import { LABEL_FORMATS, A4_WIDTH, A4_HEIGHT } from '../types';
import { LabelPreview } from './LabelPreview';

interface A4PreviewProps {
  labels: Label[];
  selectedLabelId: string | null;
  onLabelSelect: (id: string) => void;
  printMargins: PrintMargins;
  scale?: number;
  isPrintMode?: boolean;
  onAddLabel?: () => void;
}

export const A4Preview: React.FC<A4PreviewProps> = ({
  labels,
  selectedLabelId,
  onLabelSelect,
  printMargins,
  scale = 0.4,
  isPrintMode = false,
  onAddLabel,
}) => {
  // mm zu px Umrechnung (96 DPI)
  const mmToPx = 3.78;

  // A4 Größe in px
  const a4Width = A4_WIDTH * mmToPx * scale;
  const a4Height = A4_HEIGHT * mmToPx * scale;

  // Verfügbarer Bereich nach Abzug der Ränder
  const availableWidth = A4_WIDTH - printMargins.left - printMargins.right;
  const availableHeight = A4_HEIGHT - printMargins.top - printMargins.bottom;

  // Avery C32267: 5 Etiketten vertikal gestapelt, horizontal zentriert
  const dims = LABEL_FORMATS.standard;
  const labelWidth = dims.width;   // 54mm
  const labelHeight = dims.height; // 190mm - wird horizontal auf dem Blatt platziert

  // Für Ordner-Einsteck-Schilder: Etiketten liegen quer auf dem Blatt
  // Effektive Maße auf dem A4: 190mm breit × 54mm hoch
  const effectiveWidth = labelHeight;  // 190mm
  const effectiveHeight = labelWidth;  // 54mm

  // Berechne vertikalen Abstand zwischen Etiketten
  const totalLabelHeight = 5 * effectiveHeight; // 5 × 54mm = 270mm
  const remainingSpace = A4_HEIGHT - totalLabelHeight - printMargins.top - printMargins.bottom;
  const verticalGap = remainingSpace / 4; // Abstand zwischen 5 Etiketten (4 Lücken)

  // Horizontale Zentrierung
  const horizontalOffset = (A4_WIDTH - effectiveWidth) / 2;

  // Berechne Layout für 5 Etiketten vertikal
  const calculateLayout = () => {
    if (labels.length === 0) return [];

    const positions: { label: Label; x: number; y: number }[] = [];

    labels.forEach((label, index) => {
      const x = Math.max(printMargins.left, horizontalOffset);
      const y = printMargins.top + index * (effectiveHeight + verticalGap);

      positions.push({ label, x, y });
    });

    return positions;
  };

  const layout = calculateLayout();

  // Für Druck: Originalgröße verwenden
  if (isPrintMode) {
    return (
      <div
        className="print-sheet"
        style={{
          width: `${A4_WIDTH}mm`,
          height: `${A4_HEIGHT}mm`,
          position: 'relative',
          backgroundColor: 'white',
        }}
      >
        {layout.map(({ label, x, y }) => (
          <div
            key={label.id}
            className="label-content"
            style={{
              position: 'absolute',
              left: `${x}mm`,
              top: `${y}mm`,
              width: `${effectiveWidth}mm`,
              height: `${effectiveHeight}mm`,
            }}
          >
            <PrintLabel label={label} />
          </div>
        ))}
      </div>
    );
  }

  // Vorschau-Modus
  return (
    <div className="flex flex-col items-center">
      {/* A4 Seitenrahmen */}
      <div
        className="bg-white shadow-2xl relative ring-1 ring-gray-200"
        style={{
          width: `${a4Width}px`,
          height: `${a4Height}px`,
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Druckbereich-Markierung */}
        <div
          className="absolute border border-dashed border-gray-300"
          style={{
            left: `${printMargins.left * mmToPx * scale}px`,
            top: `${printMargins.top * mmToPx * scale}px`,
            width: `${availableWidth * mmToPx * scale}px`,
            height: `${availableHeight * mmToPx * scale}px`,
          }}
        />

        {/* Etiketten */}
        {layout.map(({ label, x, y }) => (
          <div
            key={label.id}
            className="absolute"
            style={{
              left: `${x * mmToPx * scale}px`,
              top: `${y * mmToPx * scale}px`,
            }}
          >
            <LabelPreview
              label={label}
              isSelected={label.id === selectedLabelId}
              onClick={() => onLabelSelect(label.id)}
              scale={scale}
            />
          </div>
        ))}

        {/* Leere Seite Hinweis - klickbar zum Erstellen */}
        {labels.length === 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
            onClick={onAddLabel}
          >
            <div className="text-center" style={{ transform: 'rotate(-90deg)' }}>
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm font-medium">Klicke hier um ein Etikett zu erstellen</p>
            </div>
          </div>
        )}
      </div>

      {/* Maßangaben */}
      <div className="mt-2 text-xs text-gray-500">
        A4: {A4_WIDTH} × {A4_HEIGHT} mm | Druckbereich: {availableWidth.toFixed(0)} × {availableHeight.toFixed(0)} mm
      </div>
    </div>
  );
};

// Druck-Version eines Etiketts (ohne interaktive Elemente)
const PrintLabel: React.FC<{ label: Label }> = ({ label }) => {
  const renderTextSection = (section: typeof label.header | typeof label.body) => {
    const isVertical = section.orientation === 'vertical';

    return (
      <div
        style={{
          fontFamily: section.fontFamily,
          fontSize: `${section.fontSize}pt`,
          fontWeight: section.fontWeight,
          fontStyle: section.fontStyle,
          color: section.color,
          textAlign: section.textAlign,
          writingMode: isVertical ? 'vertical-rl' : 'horizontal-tb',
          textOrientation: isVertical ? 'mixed' : undefined,
          transform: isVertical ? 'rotate(180deg)' : undefined,
          display: 'flex',
          alignItems: 'center',
          justifyContent: section.textAlign === 'center' ? 'center' :
                          section.textAlign === 'right' ? 'flex-end' : 'flex-start',
          width: '100%',
          height: '100%',
          padding: '2mm',
          overflow: 'hidden',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
      >
        {section.text}
      </div>
    );
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: label.backgroundColor,
        border: '0.5pt solid #ccc',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      {/* Header (links) - dynamisch basierend auf horizontalPosition */}
      <div style={{
        flex: `0 0 ${label.divider.horizontalPosition || 40}%`,
        overflow: 'hidden',
        borderRight: label.divider.visible
          ? `${label.divider.thickness}px ${label.divider.style} ${label.divider.color}`
          : 'none'
      }}>
        {renderTextSection(label.header)}
      </div>

      {/* Body (rechts) */}
      <div style={{ flex: '1', overflow: 'hidden' }}>
        {renderTextSection(label.body)}
      </div>
    </div>
  );
};

export default A4Preview;
