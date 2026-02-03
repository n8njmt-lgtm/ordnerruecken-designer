import type { Template } from '../types';
import { TEMPLATES } from '../types';
import { Layout, X } from 'lucide-react';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: Template) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Layout className="w-5 h-5" />
            Vorlage auswählen
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onSelect(template);
                  onClose();
                }}
                className="group p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all text-left"
              >
                {/* Preview */}
                <div
                  className="w-full h-20 rounded-lg mb-3 flex items-center justify-center border border-gray-100"
                  style={{ backgroundColor: template.preview }}
                >
                  <span className="text-xs font-medium" style={{
                    color: template.preview === '#ffffff' || template.preview === '#f8fafc' || template.preview === '#f3f4f6' || template.preview === '#f5f5f4' || template.preview === '#f0f9ff' || template.preview === '#f9fafb'
                      ? '#374151'
                      : '#ffffff'
                  }}>
                    {template.label.header.text || 'Aa'}
                  </span>
                </div>

                {/* Info */}
                <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                  {template.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Klicke auf eine Vorlage um ein neues Etikett zu erstellen
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
