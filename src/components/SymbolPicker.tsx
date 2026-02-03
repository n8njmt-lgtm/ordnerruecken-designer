import { useState, useRef } from 'react';
import type { LabelIcon, Rotation } from '../types';
import { SYMBOL_CATEGORIES, DEFAULT_LABEL_ICON } from '../types';
import { X, Image, RotateCw, RotateCcw, Trash2 } from 'lucide-react';

interface SymbolPickerProps {
  icon?: LabelIcon;
  onChange: (icon: LabelIcon | undefined) => void;
}

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

export const SymbolPicker: React.FC<SymbolPickerProps> = ({ icon, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentIcon = icon || DEFAULT_LABEL_ICON;

  const handleSymbolSelect = (symbol: string) => {
    onChange({
      ...currentIcon,
      type: 'symbol',
      value: symbol,
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Max 500KB
    if (file.size > 500 * 1024) {
      alert('Bild zu groß! Maximal 500KB erlaubt.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onChange({
        ...currentIcon,
        type: 'image',
        value: base64,
      });
    };
    reader.readAsDataURL(file);

    // Reset
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange(undefined);
  };

  const updateIcon = <K extends keyof LabelIcon>(key: K, value: LabelIcon[K]) => {
    onChange({ ...currentIcon, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-700 text-sm">Symbol / Bild</h4>
        {icon?.value && (
          <button
            onClick={handleRemove}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Entfernen
          </button>
        )}
      </div>

      {/* Aktuelles Symbol/Bild anzeigen */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          {icon?.value ? (
            icon.type === 'symbol' ? (
              <span
                style={{
                  fontSize: `${Math.min(icon.size, 32)}pt`,
                  color: icon.color,
                  transform: icon.rotation !== 0 ? `rotate(${icon.rotation}deg)` : undefined,
                }}
              >
                {icon.value}
              </span>
            ) : (
              <img
                src={icon.value}
                alt="Icon"
                className="w-12 h-12 object-contain"
                style={{
                  transform: icon.rotation !== 0 ? `rotate(${icon.rotation}deg)` : undefined,
                }}
              />
            )
          ) : (
            <span className="text-gray-400 text-xs text-center">Symbol<br/>wählen</span>
          )}
        </button>

        {icon?.value && (
          <div className="flex-1 space-y-2">
            {/* Größe */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-12">Größe</label>
              <input
                type="range"
                min={12}
                max={48}
                value={icon.size}
                onChange={(e) => updateIcon('size', Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-xs text-gray-500 w-8">{icon.size}pt</span>
            </div>

            {/* Farbe (nur für Symbole) */}
            {icon.type === 'symbol' && (
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 w-12">Farbe</label>
                <input
                  type="color"
                  value={icon.color}
                  onChange={(e) => updateIcon('color', e.target.value)}
                  className="w-8 h-6 rounded cursor-pointer border border-gray-300"
                />
              </div>
            )}

            {/* Position */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-12">Position</label>
              <select
                value={icon.position}
                onChange={(e) => updateIcon('position', e.target.value as LabelIcon['position'])}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
              >
                <option value="left">Links</option>
                <option value="center">Mitte</option>
                <option value="right">Rechts</option>
              </select>
            </div>

            {/* Rotation */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-12">Drehen</label>
              <button
                onClick={() => updateIcon('rotation', rotateCounterClockwise(icon.rotation))}
                className="p-1 rounded border border-gray-300 hover:bg-gray-100"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              <span className="text-xs text-gray-500 w-6 text-center">{icon.rotation}°</span>
              <button
                onClick={() => updateIcon('rotation', rotateClockwise(icon.rotation))}
                className="p-1 rounded border border-gray-300 hover:bg-gray-100"
              >
                <RotateCw className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Symbol-Picker Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Symbol auswählen</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Bild hochladen */}
            <div className="p-4 border-b border-gray-200">
              <label className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <Image className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">Eigenes Bild hochladen (max. 500KB)</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Kategorie-Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {SYMBOL_CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(idx)}
                  className={`px-4 py-2 text-sm whitespace-nowrap ${
                    activeCategory === idx
                      ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Symbol-Grid */}
            <div className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-6 gap-2">
                {SYMBOL_CATEGORIES[activeCategory].symbols.map(({ symbol, name }) => (
                  <button
                    key={symbol}
                    onClick={() => {
                      handleSymbolSelect(symbol);
                      setIsOpen(false);
                    }}
                    className="w-12 h-12 flex items-center justify-center text-2xl border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    title={name}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymbolPicker;
