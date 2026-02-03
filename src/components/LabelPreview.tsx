import type { Label, TextSection, LabelIcon } from '../types';
import { LABEL_FORMATS } from '../types';

interface LabelPreviewProps {
  label: Label;
  isSelected: boolean;
  onClick: () => void;
  scale?: number;
}

// Komponente für einen Textbereich (Header oder Body)
const TextContent: React.FC<{
  section: TextSection;
  isHeader?: boolean;
}> = ({ section, isHeader = false }) => {
  const isVertical = section.orientation === 'vertical';

  // Kombinierte Rotation: orientation + extra rotation
  const getTransform = () => {
    const transforms: string[] = [];
    if (isVertical) {
      transforms.push('rotate(180deg)');
    }
    if (section.rotation !== 0) {
      transforms.push(`rotate(${section.rotation}deg)`);
    }
    return transforms.length > 0 ? transforms.join(' ') : undefined;
  };

  const textStyle: React.CSSProperties = {
    fontFamily: section.fontFamily,
    fontSize: `${section.fontSize}pt`,
    fontWeight: section.fontWeight,
    fontStyle: section.fontStyle,
    color: section.color,
    textAlign: section.textAlign,
    writingMode: isVertical ? 'vertical-rl' : 'horizontal-tb',
    textOrientation: isVertical ? 'mixed' : undefined,
    transform: getTransform(),
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
  };

  return (
    <div style={textStyle}>
      {section.text || (isHeader ? 'Titel eingeben...' : 'Text eingeben...')}
    </div>
  );
};


// Komponente für Symbol/Bild
const IconDisplay: React.FC<{
  icon?: LabelIcon;
  scale?: number;
}> = ({ icon, scale = 1 }) => {
  if (!icon?.value) return null;

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: icon.position === 'left' ? 'flex-start' :
                    icon.position === 'right' ? 'flex-end' : 'center',
    width: '100%',
    height: '100%',
    padding: '2mm',
    pointerEvents: 'none',
    zIndex: 10,
  };

  const iconStyle: React.CSSProperties = {
    fontSize: `${icon.size * scale}pt`,
    color: icon.color,
    transform: icon.rotation !== 0 ? `rotate(${icon.rotation}deg)` : undefined,
  };

  if (icon.type === 'symbol') {
    return (
      <div style={containerStyle}>
        <span style={iconStyle}>{icon.value}</span>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <img
        src={icon.value}
        alt="Icon"
        style={{
          maxWidth: `${icon.size * 1.5}px`,
          maxHeight: `${icon.size * 1.5}px`,
          objectFit: 'contain',
          transform: icon.rotation !== 0 ? `rotate(${icon.rotation}deg)` : undefined,
        }}
      />
    </div>
  );
};

// Hauptkomponente für die Etikettenvorschau
export const LabelPreview: React.FC<LabelPreviewProps> = ({
  label,
  isSelected,
  onClick,
  scale = 1,
}) => {
  const dimensions = LABEL_FORMATS.standard;

  // Avery C32267: Etiketten liegen quer auf dem A4 (190mm breit × 54mm hoch)
  const effectiveWidth = dimensions.height;  // 190mm
  const effectiveHeight = dimensions.width;  // 54mm

  // Berechne die Größe in Pixeln (1mm ≈ 3.78px bei 96dpi)
  const mmToPx = 3.78 * scale;
  const width = effectiveWidth * mmToPx;
  const height = effectiveHeight * mmToPx;

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'}
      `}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: label.backgroundColor,
        border: '1px solid #e2e8f0',
        boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)',
      }}
      onClick={onClick}
    >
      <div className="flex flex-row h-full relative">
        {/* Icon Overlay */}
        <IconDisplay icon={label.icon} scale={scale} />

        {/* Header Bereich - dynamisch basierend auf horizontalPosition */}
        <div style={{ flex: `0 0 ${label.divider.horizontalPosition || 40}%`, overflow: 'hidden', position: 'relative' }}>
          <TextContent section={label.header} isHeader={true} />
        </div>

        {/* Trennlinie */}
        {label.divider.visible && (
          <div style={{
            position: 'relative',
            width: label.divider.rotation === 90 || label.divider.rotation === 270 ? '20px' : `${label.divider.thickness}px`,
            display: 'flex',
            alignItems: label.divider.verticalPosition <= 33 ? 'flex-start' :
                        label.divider.verticalPosition >= 67 ? 'flex-end' : 'center',
            justifyContent: 'center',
            paddingTop: label.divider.verticalPosition < 50 ? `${label.divider.verticalPosition * 0.5}%` : 0,
            paddingBottom: label.divider.verticalPosition > 50 ? `${(100 - label.divider.verticalPosition) * 0.5}%` : 0,
          }}>
            <div style={{
              width: label.divider.rotation === 90 || label.divider.rotation === 270 ? `${label.divider.height || 100}%` : `${label.divider.thickness}px`,
              height: label.divider.rotation === 90 || label.divider.rotation === 270 ? `${label.divider.thickness}px` : `${label.divider.height || 100}%`,
              backgroundColor: label.divider.color,
              borderStyle: label.divider.style,
              borderColor: label.divider.color,
              borderWidth: label.divider.style !== 'solid' ? '0' : undefined,
              background: label.divider.style === 'dashed'
                ? `repeating-linear-gradient(${label.divider.rotation === 90 || label.divider.rotation === 270 ? '90deg' : '180deg'}, ${label.divider.color}, ${label.divider.color} 4px, transparent 4px, transparent 8px)`
                : label.divider.style === 'dotted'
                ? `repeating-linear-gradient(${label.divider.rotation === 90 || label.divider.rotation === 270 ? '90deg' : '180deg'}, ${label.divider.color}, ${label.divider.color} 2px, transparent 2px, transparent 6px)`
                : label.divider.color,
              transform: label.divider.rotation !== 0 && label.divider.rotation !== 90 && label.divider.rotation !== 270 ? `rotate(${label.divider.rotation}deg)` : undefined,
              marginTop: `${(label.divider.verticalPosition || 50) - 50}%`,
            }} />
          </div>
        )}

        {/* Body Bereich - Rest (rechts) */}
        <div style={{ flex: '1', overflow: 'hidden' }}>
          <TextContent section={label.body} />
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default LabelPreview;
