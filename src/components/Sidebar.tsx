import { useState } from 'react';
import type { Label, PrintMargins, LabelIcon } from '../types';
import { LabelEditor } from './LabelEditor';
import { PrintSettings } from './PrintSettings';
import { SymbolPicker } from './SymbolPicker';
import {
  Palette,
  Printer,
  X,
  Layers,
  Sparkles
} from 'lucide-react';

type TabType = 'editor' | 'symbol' | 'print' | null;

interface SidebarProps {
  selectedLabel: Label | null;
  onUpdateLabel: (label: Label) => void;
  printMargins: PrintMargins;
  onMarginsChange: (margins: PrintMargins) => void;
  onPrint: () => void;
  onTestPrint: () => void;
  labelsCount: number;
}

// Helper für Icon-Update
const updateLabelIcon = (label: Label, icon: LabelIcon | undefined, onUpdate: (label: Label) => void) => {
  onUpdate({ ...label, icon });
};

interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
  badge?: number;
}

const TabButton: React.FC<TabButtonProps> = ({
  icon,
  label,
  isActive,
  onClick,
  disabled,
  badge
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      relative flex flex-col items-center justify-center p-3 w-full
      transition-all duration-200 border-l-4
      ${isActive
        ? 'bg-blue-50 border-l-blue-500 text-blue-600'
        : disabled
          ? 'text-gray-300 border-l-transparent cursor-not-allowed'
          : 'text-gray-500 border-l-transparent hover:bg-gray-100 hover:text-gray-700'
      }
    `}
    title={label}
  >
    <div className="w-7 h-7 flex items-center justify-center">
      {icon}
    </div>
    <span className="text-[10px] mt-1 font-medium">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="absolute top-1 right-1 w-5 h-5 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
        {badge}
      </span>
    )}
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({
  selectedLabel,
  onUpdateLabel,
  printMargins,
  onMarginsChange,
  onPrint,
  onTestPrint,
  labelsCount,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('editor');

  const handleTabClick = (tab: TabType) => {
    if (activeTab === tab) {
      setActiveTab(null); // Schließen wenn bereits aktiv
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="flex h-full">
      {/* Tab-Leiste (Icons) */}
      <div className="w-16 bg-white/80 backdrop-blur border-l border-gray-200 flex flex-col shadow-lg">
        <TabButton
          icon={<Palette className="w-6 h-6" />}
          label="Design"
          isActive={activeTab === 'editor'}
          onClick={() => handleTabClick('editor')}
          disabled={!selectedLabel}
        />

        <TabButton
          icon={<Sparkles className="w-6 h-6" />}
          label="Symbol"
          isActive={activeTab === 'symbol'}
          onClick={() => handleTabClick('symbol')}
          disabled={!selectedLabel}
        />

        <TabButton
          icon={<Printer className="w-6 h-6" />}
          label="Drucken"
          isActive={activeTab === 'print'}
          onClick={() => handleTabClick('print')}
          badge={labelsCount}
        />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Info unten */}
        <div className="p-2 border-t border-gray-200 text-center">
          <div className="text-[10px] text-gray-400">
            {labelsCount} Etiketten
          </div>
        </div>
      </div>

      {/* Content Panel */}
      {activeTab && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              {activeTab === 'editor' && (
                <>
                  <Palette className="w-5 h-5 text-blue-500" />
                  Etikett bearbeiten
                </>
              )}
              {activeTab === 'symbol' && (
                <>
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  Symbol / Bild
                </>
              )}
              {activeTab === 'print' && (
                <>
                  <Printer className="w-5 h-5 text-blue-500" />
                  Druckeinstellungen
                </>
              )}
            </h2>
            <button
              onClick={() => setActiveTab(null)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Schließen"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'editor' && selectedLabel && (
              <LabelEditor label={selectedLabel} onUpdate={onUpdateLabel} />
            )}

            {activeTab === 'editor' && !selectedLabel && (
              <div className="h-full flex items-center justify-center text-gray-400 p-6 text-center">
                <div>
                  <Layers className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-sm font-medium">Kein Etikett ausgewählt</p>
                  <p className="text-xs mt-2 text-gray-400">
                    Klicke auf ein Etikett in der Vorschau oder füge ein neues hinzu
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'symbol' && selectedLabel && (
              <div className="p-4">
                <SymbolPicker
                  icon={selectedLabel.icon}
                  onChange={(icon) => updateLabelIcon(selectedLabel, icon, onUpdateLabel)}
                />
              </div>
            )}

            {activeTab === 'symbol' && !selectedLabel && (
              <div className="h-full flex items-center justify-center text-gray-400 p-6 text-center">
                <div>
                  <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-sm font-medium">Kein Etikett ausgewählt</p>
                  <p className="text-xs mt-2 text-gray-400">
                    Wähle ein Etikett um ein Symbol hinzuzufügen
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'print' && (
              <div className="p-4">
                <PrintSettings
                  margins={printMargins}
                  onMarginsChange={onMarginsChange}
                  onPrint={onPrint}
                  onTestPrint={onTestPrint}
                  labelsCount={labelsCount}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
