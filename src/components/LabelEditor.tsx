import { useState } from 'react';
import type { Label, TextSection, Divider, Rotation } from '../types';
import { LABEL_FORMATS, AVAILABLE_FONTS } from '../types';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  RotateCw,
  RotateCcw,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

// Klappbare Sektion
const CollapsibleSection: React.FC<{
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-1 hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-700 text-sm">{title}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
};

// Rotation Helper
const rotateClockwise = (current: Rotation): Rotation => {
  const rotations: Rotation[] = [0, 90, 180, 270];
  const idx = rotations.indexOf(current);
  return rotations[(idx + 1) % 4];
};

const rotateCounterClockwise = (current: Rotation): Rotation => {
  const rotations: Rotation[] = [0, 90, 180, 270];
  const idx = rotations.indexOf(current);
  return rotations[(idx + 3) % 4];
};

interface LabelEditorProps {
  label: Label;
  onUpdate: (label: Label) => void;
}

// Hilfsfunktion für Tooltip
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <div className="relative group">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
      {text}
    </div>
  </div>
);

// Schriftauswahl-Dropdown
const FontSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    style={{ fontFamily: value }}
  >
    {AVAILABLE_FONTS.map((font) => (
      <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
        {font.name}
      </option>
    ))}
  </select>
);

// Textbereich-Editor
const TextSectionEditor: React.FC<{
  title: string;
  section: TextSection;
  onChange: (section: TextSection) => void;
}> = ({ title, section, onChange }) => {
  const updateField = <K extends keyof TextSection>(key: K, value: TextSection[K]) => {
    onChange({ ...section, [key]: value });
  };

  return (
    <div className="space-y-2">
      {/* Texteingabe - mehrzeilig mit Zeilenumbruch-Unterstützung */}
      <div>
        <textarea
          value={section.text}
          onChange={(e) => updateField('text', e.target.value)}
          placeholder={title === 'Kopfzeile' ? 'Ordnertitel eingeben...\n(Zeilenumbruch mit Enter)' : 'Zusatztext eingeben...\n(Zeilenumbruch mit Enter)'}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[60px]"
          rows={3}
        />
      </div>

      {/* Schriftart */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Schriftart</label>
        <FontSelect value={section.fontFamily} onChange={(v) => updateField('fontFamily', v)} />
      </div>

      {/* Schriftgröße und Farbe */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Größe (pt)</label>
          <input
            type="number"
            value={section.fontSize}
            onChange={(e) => updateField('fontSize', Number(e.target.value))}
            min={6}
            max={72}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Farbe</label>
          <div className="relative">
            <input
              type="color"
              value={section.color}
              onChange={(e) => updateField('color', e.target.value)}
              className="w-full h-[38px] rounded-lg cursor-pointer border border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Formatierung */}
      <div className="flex gap-1">
        <Tooltip text="Fett">
          <button
            onClick={() => updateField('fontWeight', section.fontWeight === 'bold' ? 'normal' : 'bold')}
            className={`p-2 rounded-lg border ${
              section.fontWeight === 'bold'
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            <Bold className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip text="Kursiv">
          <button
            onClick={() => updateField('fontStyle', section.fontStyle === 'italic' ? 'normal' : 'italic')}
            className={`p-2 rounded-lg border ${
              section.fontStyle === 'italic'
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            <Italic className="w-4 h-4" />
          </button>
        </Tooltip>

        <div className="w-px bg-gray-300 mx-1" />

        <Tooltip text="Linksbündig">
          <button
            onClick={() => updateField('textAlign', 'left')}
            className={`p-2 rounded-lg border ${
              section.textAlign === 'left'
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            <AlignLeft className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip text="Zentriert">
          <button
            onClick={() => updateField('textAlign', 'center')}
            className={`p-2 rounded-lg border ${
              section.textAlign === 'center'
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            <AlignCenter className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip text="Rechtsbündig">
          <button
            onClick={() => updateField('textAlign', 'right')}
            className={`p-2 rounded-lg border ${
              section.textAlign === 'right'
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </Tooltip>

        <div className="w-px bg-gray-300 mx-1" />

        <Tooltip text={section.orientation === 'vertical' ? 'Horizontal drehen' : 'Vertikal drehen'}>
          <button
            onClick={() => updateField('orientation', section.orientation === 'vertical' ? 'horizontal' : 'vertical')}
            className={`p-2 rounded-lg border ${
              section.orientation === 'vertical'
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </Tooltip>

        <div className="w-px bg-gray-300 mx-1" />

        <Tooltip text={`Gegen Uhrzeiger (-90°)`}>
          <button
            onClick={() => updateField('rotation', rotateCounterClockwise(section.rotation))}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip text={`Im Uhrzeiger (+90°)`}>
          <button
            onClick={() => updateField('rotation', rotateClockwise(section.rotation))}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </Tooltip>

        {section.rotation !== 0 && (
          <span className="text-xs text-gray-500 ml-1">{section.rotation}°</span>
        )}
      </div>
    </div>
  );
};

// Trennlinien-Editor
const DividerEditor: React.FC<{
  divider: Divider;
  onChange: (divider: Divider) => void;
}> = ({ divider, onChange }) => {
  const updateField = <K extends keyof Divider>(key: K, value: Divider[K]) => {
    onChange({ ...divider, [key]: value });
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={divider.visible}
          onChange={(e) => updateField('visible', e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">Trennlinie anzeigen</span>
      </label>

      {divider.visible && (
        <>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Stil</label>
              <select
                value={divider.style}
                onChange={(e) => updateField('style', e.target.value as Divider['style'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="solid">Durchgezogen</option>
                <option value="dashed">Gestrichelt</option>
                <option value="dotted">Gepunktet</option>
              </select>
            </div>
            <div className="w-20">
              <label className="block text-xs text-gray-500 mb-1">Stärke</label>
              <input
                type="number"
                value={divider.thickness}
                onChange={(e) => updateField('thickness', Number(e.target.value))}
                min={1}
                max={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Horizontale Position (entlang der Etikettenlänge) */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Position auf Etikett (Header-Anteil)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                value={divider.horizontalPosition}
                onChange={(e) => updateField('horizontalPosition', Number(e.target.value))}
                min={10}
                max={90}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={divider.horizontalPosition}
                  onChange={(e) => {
                    const val = Math.min(90, Math.max(10, Number(e.target.value)));
                    updateField('horizontalPosition', val);
                  }}
                  min={10}
                  max={90}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-xs text-gray-500">%</span>
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>← Header größer</span>
              <span>Body größer →</span>
            </div>
          </div>

          {/* Höhe der Trennlinie */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Höhe: {divider.height}%</label>
              <input
                type="range"
                value={divider.height}
                onChange={(e) => updateField('height', Number(e.target.value))}
                min={10}
                max={100}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Vertikal: {divider.verticalPosition}%</label>
              <input
                type="range"
                value={divider.verticalPosition}
                onChange={(e) => updateField('verticalPosition', Number(e.target.value))}
                min={0}
                max={100}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Farbe</label>
              <input
                type="color"
                value={divider.color}
                onChange={(e) => updateField('color', e.target.value)}
                className="w-full h-[38px] rounded-lg cursor-pointer border border-gray-300"
              />
            </div>
            <div className="w-24">
              <label className="block text-xs text-gray-500 mb-1">Drehung</label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateField('rotation', rotateCounterClockwise(divider.rotation))}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                  title="Gegen Uhrzeiger"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-600 w-8 text-center">{divider.rotation}°</span>
                <button
                  onClick={() => updateField('rotation', rotateClockwise(divider.rotation))}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                  title="Im Uhrzeiger"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Hauptkomponente
export const LabelEditor: React.FC<LabelEditorProps> = ({ label, onUpdate }) => {
  const updateHeader = (header: TextSection) => onUpdate({ ...label, header });
  const updateBody = (body: TextSection) => onUpdate({ ...label, body });
  const updateDivider = (divider: Divider) => onUpdate({ ...label, divider });

  return (
    <div className="h-full overflow-y-auto p-3">
      {/* Format-Info - immer sichtbar */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="font-medium text-xs text-blue-800">Avery Zweckform {LABEL_FORMATS.standard.model}</div>
            <div className="text-[10px] text-blue-600">
              {LABEL_FORMATS.standard.width} × {LABEL_FORMATS.standard.height} mm
            </div>
          </div>
        </div>
      </div>

      {/* Hintergrundfarbe - kompakt */}
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
        <label className="text-xs font-medium text-gray-700">Hintergrund:</label>
        <input
          type="color"
          value={label.backgroundColor}
          onChange={(e) => onUpdate({ ...label, backgroundColor: e.target.value })}
          className="w-8 h-6 rounded cursor-pointer border border-gray-300"
        />
        <input
          type="text"
          value={label.backgroundColor}
          onChange={(e) => onUpdate({ ...label, backgroundColor: e.target.value })}
          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
          placeholder="#ffffff"
        />
      </div>

      {/* Klappbare Sektionen */}
      <CollapsibleSection title="📝 Kopfzeile" defaultOpen={true}>
        <TextSectionEditor
          title="Kopfzeile"
          section={label.header}
          onChange={updateHeader}
        />
      </CollapsibleSection>

      <CollapsibleSection title="➖ Trennlinie" defaultOpen={false}>
        <DividerEditor divider={label.divider} onChange={updateDivider} />
      </CollapsibleSection>

      <CollapsibleSection title="📄 Textbereich" defaultOpen={true}>
        <TextSectionEditor
          title="Textbereich"
          section={label.body}
          onChange={updateBody}
        />
      </CollapsibleSection>
    </div>
  );
};

export default LabelEditor;
