import type { PrintMargins } from '../types';
import { DEFAULT_PRINT_MARGINS } from '../types';
import { Settings, RotateCcw, Printer, FileText } from 'lucide-react';

interface PrintSettingsProps {
  margins: PrintMargins;
  onMarginsChange: (margins: PrintMargins) => void;
  onPrint: () => void;
  onTestPrint: () => void;
  labelsCount: number;
}

export const PrintSettings: React.FC<PrintSettingsProps> = ({
  margins,
  onMarginsChange,
  onPrint,
  onTestPrint,
  labelsCount,
}) => {
  const updateMargin = (key: keyof PrintMargins, value: number) => {
    onMarginsChange({ ...margins, [key]: Math.max(0, Math.min(50, value)) });
  };

  const resetMargins = () => {
    onMarginsChange({ ...DEFAULT_PRINT_MARGINS });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Druckeinstellungen
        </h3>
        <button
          onClick={resetMargins}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          title="Ränder zurücksetzen"
        >
          <RotateCcw className="w-3 h-3" />
          Zurücksetzen
        </button>
      </div>

      {/* Margin Inputs */}
      <div className="space-y-3">
        <p className="text-xs text-gray-500">Druckränder (in mm)</p>

        {/* Visuelle Darstellung der Ränder */}
        <div className="relative bg-gray-100 rounded-lg p-4">
          {/* Oben */}
          <div className="flex justify-center mb-2">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-12">Oben</label>
              <input
                type="number"
                value={margins.top}
                onChange={(e) => updateMargin('top', Number(e.target.value))}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                min={0}
                max={50}
              />
            </div>
          </div>

          {/* Links und Rechts */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-12">Links</label>
              <input
                type="number"
                value={margins.left}
                onChange={(e) => updateMargin('left', Number(e.target.value))}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                min={0}
                max={50}
              />
            </div>

            {/* A4 Vorschau */}
            <div className="w-12 h-16 bg-white border border-gray-300 rounded shadow-inner flex items-center justify-center">
              <span className="text-[8px] text-gray-400">A4</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={margins.right}
                onChange={(e) => updateMargin('right', Number(e.target.value))}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                min={0}
                max={50}
              />
              <label className="text-xs text-gray-500 w-12">Rechts</label>
            </div>
          </div>

          {/* Unten */}
          <div className="flex justify-center mt-2">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-12">Unten</label>
              <input
                type="number"
                value={margins.bottom}
                onChange={(e) => updateMargin('bottom', Number(e.target.value))}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                min={0}
                max={50}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Slider für schnelle Anpassung */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Alle Ränder gleichmäßig</label>
        <input
          type="range"
          min={0}
          max={30}
          value={margins.top}
          onChange={(e) => {
            const val = Number(e.target.value);
            onMarginsChange({ top: val, right: val, bottom: val, left: val });
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0 mm</span>
          <span>30 mm</span>
        </div>
      </div>

      {/* Druck-Buttons */}
      <div className="space-y-2 pt-2 border-t border-gray-200">
        <button
          onClick={onPrint}
          disabled={labelsCount === 0}
          className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
            labelsCount === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Printer className="w-5 h-5" />
          Drucken ({labelsCount} {labelsCount === 1 ? 'Etikett' : 'Etiketten'})
        </button>

        <button
          onClick={onTestPrint}
          className="w-full py-2 px-4 rounded-lg font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Testdruck (Messlinien)
        </button>
      </div>

      {/* Hinweis */}
      <p className="text-xs text-gray-400 text-center">
        Tipp: Führe einen Testdruck durch, um die optimalen Ränder für deinen Drucker zu ermitteln.
      </p>
    </div>
  );
};

export default PrintSettings;
