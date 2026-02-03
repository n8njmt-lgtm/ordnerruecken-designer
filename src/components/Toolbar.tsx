import { Plus, Trash2, Copy, FolderOpen, Layout, Save } from 'lucide-react';
import { LABEL_FORMATS } from '../types';

// Logo Komponente - JMTronic Logo
const JMTronicLogo: React.FC = () => (
  <div className="flex items-center gap-2">
    <img
      src="/Logo_JM.png"
      alt="JMTronic Logo"
      className="w-8 h-8 object-contain"
    />
    <div className="text-xs text-gray-500">
      Powered by <span className="font-semibold text-red-600">JM</span><span className="font-semibold text-gray-700">Tronic/</span><span className="font-semibold text-red-600 italic">Ai</span>
    </div>
  </div>
);

interface ToolbarProps {
  onAddLabel: () => void;
  onDeleteLabel: () => void;
  onDuplicateLabel: () => void;
  onOpenTemplates: () => void;
  onOpenProjectManager: () => void;
  hasSelectedLabel: boolean;
  labelsCount: number;
  maxLabels: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onAddLabel,
  onDeleteLabel,
  onDuplicateLabel,
  onOpenTemplates,
  onOpenProjectManager,
  hasSelectedLabel,
  labelsCount,
  maxLabels,
}) => {
  const dims = LABEL_FORMATS.standard;
  const canAddMore = labelsCount < maxLabels;

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-md">
      {/* Linke Seite: Logo und Titel */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-800">Ordnerrücken-Designer</h1>
            <p className="text-xs text-gray-500">Avery Zweckform {dims.model} · {dims.width} × {dims.height} mm</p>
          </div>
        </div>
        <div className="w-px h-8 bg-gray-300" />
        <JMTronicLogo />
      </div>

      {/* Mitte: Aktionen */}
      <div className="flex items-center gap-2">
        {/* Vorlagen */}
        <button
          onClick={onOpenTemplates}
          disabled={!canAddMore}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
            canAddMore
              ? 'text-purple-700 hover:bg-purple-50 border border-purple-300'
              : 'text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
          title="Vorlage auswählen"
        >
          <Layout className="w-4 h-4" />
          Vorlagen
        </button>

        {/* Etikett hinzufügen */}
        <button
          onClick={onAddLabel}
          disabled={!canAddMore}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            canAddMore
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          title={canAddMore ? 'Neues Etikett hinzufügen' : `Maximal ${maxLabels} Etiketten pro Seite`}
        >
          <Plus className="w-4 h-4" />
          Etikett
        </button>

        {/* Duplizieren */}
        <button
          onClick={onDuplicateLabel}
          disabled={!hasSelectedLabel || !canAddMore}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
            hasSelectedLabel && canAddMore
              ? 'text-gray-700 hover:bg-gray-100 border border-gray-300'
              : 'text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
          title="Ausgewähltes Etikett duplizieren"
        >
          <Copy className="w-4 h-4" />
        </button>

        {/* Löschen */}
        <button
          onClick={onDeleteLabel}
          disabled={!hasSelectedLabel}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
            hasSelectedLabel
              ? 'text-red-600 hover:bg-red-50 border border-red-200'
              : 'text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
          title="Ausgewähltes Etikett löschen"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Projekt speichern/laden */}
        <button
          onClick={onOpenProjectManager}
          className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 border border-gray-300 transition-colors"
          title="Projekt speichern/laden"
        >
          <Save className="w-4 h-4" />
          Projekt
        </button>
      </div>

      {/* Rechte Seite: Statistik */}
      <div className="text-sm text-gray-500">
        {labelsCount} / {maxLabels} Etiketten
      </div>
    </div>
  );
};

export default Toolbar;
