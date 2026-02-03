import { useState, useCallback, useRef } from 'react';
import { Toolbar } from './components/Toolbar';
import { A4Preview } from './components/A4Preview';
import { Sidebar } from './components/Sidebar';
import { TemplateSelector } from './components/TemplateSelector';
import { ProjectManager } from './components/ProjectManager';
import type { Label, PrintMargins, Template } from './types';
import { DEFAULT_PRINT_MARGINS, createNewLabel, A4_WIDTH, A4_HEIGHT, LABEL_FORMATS } from './types';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';

// Avery C32267: 5 Etiketten pro A4-Seite
const LABELS_PER_PAGE = LABEL_FORMATS.standard.labelsPerSheet;
// Unbegrenzete Seitenanzahl - nur durch Anzahl der Etiketten begrenzt
const MAX_LABELS = 100; // Maximal 20 Seiten à 5 Etiketten

function App() {
  // State
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
  const [printMargins, setPrintMargins] = useState<PrintMargins>(DEFAULT_PRINT_MARGINS);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLandscape, setIsLandscape] = useState(true); // Default: Querformat

  // Refs
  const printRef = useRef<HTMLDivElement>(null);

  // Berechnungen
  const totalPages = Math.max(1, Math.ceil(labels.length / LABELS_PER_PAGE));
  const pageLabels = labels.slice(currentPage * LABELS_PER_PAGE, (currentPage + 1) * LABELS_PER_PAGE);

  // Ausgewähltes Etikett finden
  const selectedLabel = labels.find((l) => l.id === selectedLabelId) || null;

  // Etikett hinzufügen
  const handleAddLabel = useCallback(() => {
    if (labels.length >= MAX_LABELS) return;
    const newLabel = createNewLabel();
    setLabels((prev) => [...prev, newLabel]);
    setSelectedLabelId(newLabel.id);
    // Zur Seite des neuen Etiketts wechseln
    const newPage = Math.floor(labels.length / LABELS_PER_PAGE);
    setCurrentPage(newPage);
  }, [labels.length]);

  // Etikett aus Vorlage erstellen
  const handleAddFromTemplate = useCallback((template: Template) => {
    if (labels.length >= MAX_LABELS) return;
    const newLabel: Label = {
      ...template.label,
      id: crypto.randomUUID(),
    };
    setLabels((prev) => [...prev, newLabel]);
    setSelectedLabelId(newLabel.id);
    const newPage = Math.floor(labels.length / LABELS_PER_PAGE);
    setCurrentPage(newPage);
  }, [labels.length]);

  // Etikett löschen
  const handleDeleteLabel = useCallback(() => {
    if (!selectedLabelId) return;
    setLabels((prev) => prev.filter((l) => l.id !== selectedLabelId));
    setSelectedLabelId(null);
  }, [selectedLabelId]);

  // Etikett duplizieren
  const handleDuplicateLabel = useCallback(() => {
    if (!selectedLabel || labels.length >= MAX_LABELS) return;
    const duplicate: Label = {
      ...selectedLabel,
      id: crypto.randomUUID(),
      header: { ...selectedLabel.header },
      body: { ...selectedLabel.body },
      divider: { ...selectedLabel.divider },
    };
    setLabels((prev) => [...prev, duplicate]);
    setSelectedLabelId(duplicate.id);
    const newPage = Math.floor(labels.length / LABELS_PER_PAGE);
    setCurrentPage(newPage);
  }, [selectedLabel, labels.length]);

  // Projekt laden
  const handleLoadProject = useCallback((loadedLabels: Label[], margins: PrintMargins) => {
    setLabels(loadedLabels);
    setPrintMargins(margins);
    setSelectedLabelId(null);
    setCurrentPage(0);
  }, []);

  // Etikett verschieben (Drag & Drop)
  const handleMoveLabel = useCallback((fromIndex: number, toIndex: number) => {
    setLabels((prev) => {
      const newLabels = [...prev];
      const [removed] = newLabels.splice(fromIndex, 1);
      newLabels.splice(toIndex, 0, removed);
      return newLabels;
    });
  }, []);

  // Etikett nach oben/unten verschieben
  const handleMoveLabelUp = useCallback(() => {
    if (!selectedLabelId) return;
    const index = labels.findIndex((l) => l.id === selectedLabelId);
    if (index > 0) {
      handleMoveLabel(index, index - 1);
    }
  }, [selectedLabelId, labels, handleMoveLabel]);

  const handleMoveLabelDown = useCallback(() => {
    if (!selectedLabelId) return;
    const index = labels.findIndex((l) => l.id === selectedLabelId);
    if (index < labels.length - 1) {
      handleMoveLabel(index, index + 1);
    }
  }, [selectedLabelId, labels, handleMoveLabel]);

  // Etikett aktualisieren
  const handleUpdateLabel = useCallback((updatedLabel: Label) => {
    setLabels((prev) =>
      prev.map((l) => (l.id === updatedLabel.id ? updatedLabel : l))
    );
  }, []);

  // Drucken
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Testdruck mit Messlinien
  const handleTestPrint = useCallback(() => {
    // Temporär ein Testmuster erstellen und drucken
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const availableWidth = A4_WIDTH - printMargins.left - printMargins.right;
    const availableHeight = A4_HEIGHT - printMargins.top - printMargins.bottom;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Testdruck - Ordnerrücken-Designer</title>
        <style>
          @page { size: A4 portrait; margin: 0; }
          body { margin: 0; font-family: Arial, sans-serif; }
          .sheet {
            width: 210mm;
            height: 297mm;
            position: relative;
            background: white;
          }
          .print-area {
            position: absolute;
            left: ${printMargins.left}mm;
            top: ${printMargins.top}mm;
            width: ${availableWidth}mm;
            height: ${availableHeight}mm;
            border: 1px dashed #999;
          }
          .ruler-h {
            position: absolute;
            height: 5mm;
            background: repeating-linear-gradient(90deg, #000 0, #000 1px, transparent 1px, transparent 10mm);
          }
          .ruler-v {
            position: absolute;
            width: 5mm;
            background: repeating-linear-gradient(0deg, #000 0, #000 1px, transparent 1px, transparent 10mm);
          }
          .info {
            position: absolute;
            font-size: 10pt;
            color: #333;
          }
          .center-cross {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .center-cross::before,
          .center-cross::after {
            content: '';
            position: absolute;
            background: #000;
          }
          .center-cross::before {
            width: 20mm;
            height: 0.5mm;
            left: -10mm;
            top: -0.25mm;
          }
          .center-cross::after {
            width: 0.5mm;
            height: 20mm;
            top: -10mm;
            left: -0.25mm;
          }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div class="print-area">
            <!-- Horizontale Lineale -->
            <div class="ruler-h" style="top: 0; left: 0; width: 100%;"></div>
            <div class="ruler-h" style="bottom: 0; left: 0; width: 100%;"></div>

            <!-- Vertikale Lineale -->
            <div class="ruler-v" style="top: 0; left: 0; height: 100%;"></div>
            <div class="ruler-v" style="top: 0; right: 0; height: 100%;"></div>

            <!-- Zentrierungskreuz -->
            <div class="center-cross"></div>

            <!-- Informationen -->
            <div class="info" style="top: 10mm; left: 10mm;">
              <strong>Testdruck - Ordnerrücken-Designer</strong><br><br>
              Ränder: Oben ${printMargins.top}mm, Rechts ${printMargins.right}mm,
              Unten ${printMargins.bottom}mm, Links ${printMargins.left}mm<br><br>
              Druckbereich: ${availableWidth}mm × ${availableHeight}mm<br><br>
              <em>Messen Sie die Abstände vom Papierrand zum gestrichelten Rahmen.
              Passen Sie die Ränder entsprechend an.</em>
            </div>
          </div>

          <!-- Eckmarkierungen -->
          <div style="position: absolute; top: 5mm; left: 5mm; width: 10mm; height: 10mm; border-left: 1px solid #000; border-top: 1px solid #000;"></div>
          <div style="position: absolute; top: 5mm; right: 5mm; width: 10mm; height: 10mm; border-right: 1px solid #000; border-top: 1px solid #000;"></div>
          <div style="position: absolute; bottom: 5mm; left: 5mm; width: 10mm; height: 10mm; border-left: 1px solid #000; border-bottom: 1px solid #000;"></div>
          <div style="position: absolute; bottom: 5mm; right: 5mm; width: 10mm; height: 10mm; border-right: 1px solid #000; border-bottom: 1px solid #000;"></div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }, [printMargins]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-400 to-slate-500 app-container">
      {/* Toolbar - nicht drucken */}
      <div className="no-print">
        <Toolbar
          onAddLabel={handleAddLabel}
          onDeleteLabel={handleDeleteLabel}
          onDuplicateLabel={handleDuplicateLabel}
          onOpenTemplates={() => setShowTemplates(true)}
          onOpenProjectManager={() => setShowProjectManager(true)}
          hasSelectedLabel={!!selectedLabel}
          labelsCount={labels.length}
          maxLabels={MAX_LABELS}
        />
      </div>

      {/* Hauptbereich - nicht drucken */}
      <div className="flex-1 flex overflow-hidden relative no-print">
        {/* A4 Vorschau (Mitte) */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-auto">
          {/* Seiten-Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className={`p-2 rounded-lg ${
                  currentPage === 0
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                Seite {currentPage + 1} von {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages - 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Ansicht-Toggle */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setIsLandscape(!isLandscape)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
              title={isLandscape ? 'Zu Hochformat wechseln' : 'Zu Querformat wechseln'}
            >
              <RotateCcw className="w-4 h-4" />
              {isLandscape ? 'Querformat' : 'Hochformat'}
            </button>
          </div>

          <div style={{
            transform: isLandscape ? 'rotate(90deg)' : 'none',
            transformOrigin: 'center center',
          }}>
            <A4Preview
              labels={pageLabels}
              selectedLabelId={selectedLabelId}
              onLabelSelect={setSelectedLabelId}
              printMargins={printMargins}
              scale={isLandscape ? 1.0 : 0.75}
              onAddLabel={handleAddLabel}
            />
          </div>

          {/* Etiketten-Sortierung */}
          {selectedLabel && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-xs text-gray-500">Reihenfolge:</span>
              <button
                onClick={handleMoveLabelUp}
                disabled={labels.findIndex((l) => l.id === selectedLabelId) === 0}
                className={`p-1.5 rounded border ${
                  labels.findIndex((l) => l.id === selectedLabelId) === 0
                    ? 'border-gray-200 text-gray-300'
                    : 'border-gray-300 hover:bg-gray-100 text-gray-600'
                }`}
                title="Nach oben verschieben"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={handleMoveLabelDown}
                disabled={labels.findIndex((l) => l.id === selectedLabelId) === labels.length - 1}
                className={`p-1.5 rounded border ${
                  labels.findIndex((l) => l.id === selectedLabelId) === labels.length - 1
                    ? 'border-gray-200 text-gray-300'
                    : 'border-gray-300 hover:bg-gray-100 text-gray-600'
                }`}
                title="Nach unten verschieben"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-400 ml-2">
                #{labels.findIndex((l) => l.id === selectedLabelId) + 1} von {labels.length}
              </span>
            </div>
          )}
        </div>

        {/* Sidebar (Rechts) - Moderne Tab-Leiste */}
        <Sidebar
          selectedLabel={selectedLabel}
          onUpdateLabel={handleUpdateLabel}
          printMargins={printMargins}
          onMarginsChange={setPrintMargins}
          onPrint={handlePrint}
          onTestPrint={handleTestPrint}
          labelsCount={labels.length}
        />
      </div>

      {/* Druckansicht (nur beim Drucken sichtbar) - Alle Seiten */}
      <div className="hidden print-view" ref={printRef}>
        {Array.from({ length: totalPages }).map((_, pageIndex) => (
          <A4Preview
            key={pageIndex}
            labels={labels.slice(pageIndex * LABELS_PER_PAGE, (pageIndex + 1) * LABELS_PER_PAGE)}
            selectedLabelId={null}
            onLabelSelect={() => {}}
            printMargins={printMargins}
            isPrintMode={true}
          />
        ))}
      </div>

      {/* Modals */}
      <TemplateSelector
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelect={handleAddFromTemplate}
      />

      <ProjectManager
        isOpen={showProjectManager}
        onClose={() => setShowProjectManager(false)}
        labels={labels}
        printMargins={printMargins}
        onLoadProject={handleLoadProject}
      />
    </div>
  );
}

export default App;
