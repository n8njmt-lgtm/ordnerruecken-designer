import { useRef } from 'react';
import type { Label, PrintMargins, Project } from '../types';
import { Save, FolderOpen, Download, Upload, X } from 'lucide-react';

interface ProjectManagerProps {
  isOpen: boolean;
  onClose: () => void;
  labels: Label[];
  printMargins: PrintMargins;
  onLoadProject: (labels: Label[], margins: PrintMargins) => void;
}

const PROJECT_VERSION = '1.0.0';

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  isOpen,
  onClose,
  labels,
  printMargins,
  onLoadProject,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Projekt speichern
  const handleSave = () => {
    const project: Project = {
      version: PROJECT_VERSION,
      name: `Ordneretiketten_${new Date().toISOString().split('T')[0]}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      labels,
      printMargins,
    };

    const json = JSON.stringify(project, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onClose();
  };

  // Projekt laden
  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const project: Project = JSON.parse(content);

        // Validierung
        if (!project.labels || !Array.isArray(project.labels)) {
          throw new Error('Ungültiges Projektformat');
        }

        // Labels mit fehlenden Rotation-Properties aktualisieren
        const updatedLabels = project.labels.map(label => ({
          ...label,
          header: { ...label.header, rotation: label.header.rotation ?? 0 },
          body: { ...label.body, rotation: label.body.rotation ?? 0 },
          divider: { ...label.divider, rotation: label.divider.rotation ?? 0 },
        }));

        onLoadProject(updatedLabels, project.printMargins || printMargins);
        onClose();
      } catch (error) {
        alert('Fehler beim Laden der Datei. Bitte überprüfe das Dateiformat.');
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // LocalStorage speichern
  const handleSaveLocal = () => {
    const project: Project = {
      version: PROJECT_VERSION,
      name: 'Autosave',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      labels,
      printMargins,
    };
    localStorage.setItem('ordnerruecken-designer-project', JSON.stringify(project));
    alert('Projekt im Browser gespeichert!');
  };

  // LocalStorage laden
  const handleLoadLocal = () => {
    const saved = localStorage.getItem('ordnerruecken-designer-project');
    if (!saved) {
      alert('Kein gespeichertes Projekt gefunden.');
      return;
    }

    try {
      const project: Project = JSON.parse(saved);

      // Labels mit fehlenden Rotation-Properties aktualisieren
      const updatedLabels = project.labels.map(label => ({
        ...label,
        header: { ...label.header, rotation: label.header.rotation ?? 0 },
        body: { ...label.body, rotation: label.body.rotation ?? 0 },
        divider: { ...label.divider, rotation: label.divider.rotation ?? 0 },
      }));

      onLoadProject(updatedLabels, project.printMargins);
      onClose();
    } catch {
      alert('Fehler beim Laden des Projekts.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Save className="w-5 h-5" />
            Projekt verwalten
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Datei-Operationen */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Als Datei speichern/laden</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSave}
                disabled={labels.length === 0}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                  labels.length === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Download className="w-4 h-4" />
                Exportieren
              </button>
              <label className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                Importieren
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleLoad}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Browser-Speicher */}
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">Im Browser speichern</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSaveLocal}
                disabled={labels.length === 0}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                  labels.length === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <Save className="w-4 h-4" />
                Speichern
              </button>
              <button
                onClick={handleLoadLocal}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <FolderOpen className="w-4 h-4" />
                Laden
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Schnelles Speichern ohne Download. Daten bleiben im Browser.
            </p>
          </div>

          {/* Info */}
          <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700">
            <strong>Tipp:</strong> Exportiere dein Projekt als JSON-Datei, um es auf anderen Geräten zu nutzen oder als Backup zu sichern.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectManager;
