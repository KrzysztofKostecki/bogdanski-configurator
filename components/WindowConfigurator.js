import React, { useState } from 'react';
import { 
  PlusIcon, 
  MinusIcon, 
  XIcon, 
  SaveIcon, 
  MenuIcon, 
  LayoutGridIcon 
} from 'lucide-react';

// Enhanced brand colors with additional shades
const BRAND_COLORS = {
  primary: '#D64541',
  primaryLight: '#e57572',
  primaryDark: '#b13b37',
  secondary: '#2C3E50',
  secondaryLight: '#3c526a',
  background: '#FFFFFF',
  text: '#333333',
  border: '#E5E7EB',
};

// Configuration options
const windowTypes = ['Uchylno-rozwieralne', 'Stałe', 'Rozwierane', 'Uchylne'];
const materials = ['PVC', 'Aluminium', 'Drewno'];
const glassTypes = ['Jednokomorowe', 'Dwukomorowe', 'Trzykomorowe'];
const colors = ['Biały', 'Czarny', 'Antracyt', 'Złoty Dąb'];
const installationTypes = [
  { type: 'Standardowy', multiplier: 1 },
  { type: 'Złożony', multiplier: 1.3 },
  { type: 'Nietypowy', multiplier: 1.5 }
];

const createSection = (type = 'Stałe', width = 100, height = 100) => ({
  id: Date.now() + Math.random(), // Ensure unique IDs
  type,
  width,
  height,
  isActive: false
});

const createInitialSections = (columns, rows) => {
  const sections = [];
  const totalSections = columns * rows;
  
  // Create default sections
  for (let i = 0; i < totalSections; i++) {
    sections[i] = createSection(
      i === 0 || i === 1 ? 'Uchylno-rozwieralne' : 'Stałe',
      i === 1 ? 155 : 100,
      i === 2 ? 60 : 100
    );
  }
  
  return sections;
};

const createNewWindow = () => ({
  id: Date.now(),
  width: 300,
  height: 250,
  material: materials[0],
  glassType: glassTypes[0],
  color: colors[0],
  columns: 2,
  rows: 2,
  sections: createInitialSections(2, 2)
});

const WindowConfigurator = () => {
  const [project, setProject] = useState({
    windows: [createNewWindow()],
    installationType: installationTypes[0]
  });
  const [activeWindowIndex, setActiveWindowIndex] = useState(0);
  const [activeSectionIndex, setActiveSectionIndex] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const updateWindowGrid = (windowIndex, newColumns, newRows) => {
    const totalSections = newColumns * newRows;
    const currentWindow = project.windows[windowIndex];
    const currentSections = currentWindow.sections;
    
    // Create new sections array with proper length
    const newSections = [];
    for (let i = 0; i < totalSections; i++) {
      // Reuse existing section if available, otherwise create new
      newSections[i] = currentSections[i] || createSection();
    }

    // Update the window with new grid dimensions and sections
    updateWindow(windowIndex, {
      columns: newColumns,
      rows: newRows,
      sections: newSections // This now has exactly the right number of sections
    });
  };


  const updateSection = (windowIndex, sectionIndex, updates) => {
    const newWindows = [...project.windows];
    newWindows[windowIndex].sections[sectionIndex] = {
      ...newWindows[windowIndex].sections[sectionIndex],
      ...updates
    };
    setProject({ ...project, windows: newWindows });
  };

  const addWindow = () => {
    setProject(prev => ({
      ...prev,
      windows: [...prev.windows, createNewWindow()]
    }));
    setActiveWindowIndex(project.windows.length);
  };

  const removeWindow = (index) => {
    if (project.windows.length === 1) return;
    setProject(prev => ({
      ...prev,
      windows: prev.windows.filter((_, i) => i !== index)
    }));
    setActiveWindowIndex(Math.max(0, activeWindowIndex - 1));
  };

  const updateWindow = (index, updates) => {
    setProject(prev => ({
      ...prev,
      windows: prev.windows.map((window, i) => 
        i === index ? { ...window, ...updates } : window
      )
    }));
  };

  const activeWindow = project.windows[activeWindowIndex];

  const calculatePrice = (window) => {
    const basePrice = 500;
    const areaMultiplier = (window.width * window.height) / 10000;
    const materialMultiplier = materials.indexOf(window.material) * 0.3 + 1;
    const glassMultiplier = glassTypes.indexOf(window.glassType) * 0.4 + 1;
    const sectionsMultiplier = window.sections.length * 0.1 + 1;
    
    const windowPrice = basePrice * areaMultiplier * materialMultiplier * 
                       glassMultiplier * sectionsMultiplier;
    return windowPrice * project.installationType.multiplier;
  };

  // Helper function to get window color styles
  const getWindowColorStyles = (colorName) => {
    const colorMap = {
      'Biały': {
        border: '#ffffff',
        shadow: '0 0 0 1px rgba(0,0,0,0.1)',
        handles: '#909090'
      },
      'Czarny': {
        border: '#222222',
        shadow: '0 0 0 1px rgba(255,255,255,0.1)',
        handles: '#404040'
      },
      'Antracyt': {
        border: '#3c3c3c',
        shadow: '0 0 0 1px rgba(255,255,255,0.1)',
        handles: '#505050'
      },
      'Złoty Dąb': {
        border: '#b68d4c',
        shadow: '0 0 0 1px rgba(0,0,0,0.1)',
        handles: '#8b6b3a'
      }
    };
    return colorMap[colorName] || colorMap['Biały'];
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white">
      {/* Mobile Header with Collapsible Menu */}
      <div className="flex flex-col">
        {/* Logo and Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 flex items-center justify-center text-white font-bold rounded shadow-lg"
              style={{ backgroundColor: BRAND_COLORS.primary }}
            >
              B
            </div>
            <div className="text-xl font-bold" style={{ color: BRAND_COLORS.primary }}>
              BOGDAŃSKI
            </div>
          </div>
          
          {/* Mobile Menu Toggle */}
          <div className="sm:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        <h1 
          className="text-2xl font-bold mb-4 text-center sm:text-left" 
          style={{ color: BRAND_COLORS.secondary }}
        >
          Konfigurator okien
        </h1>
      </div>
      
      {/* Windows List - More Responsive */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start overflow-x-auto">
        {project.windows.map((window, index) => (
          <button 
            key={window.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 
              ${index === activeWindowIndex 
                ? 'bg-red-100 border-2 border-red-500 shadow-sm' 
                : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'}`}
            onClick={() => setActiveWindowIndex(index)}
          >
            <LayoutGridIcon size={16} />
            <span>Okno {index + 1}</span>
            {project.windows.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeWindow(index);
                }}
                className="ml-2 text-red-500 hover:bg-red-200 rounded-full p-1 transition-colors"
              >
                <XIcon size={16} />
              </button>
            )}
          </button>
        ))}
        <button
          onClick={addWindow}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity shadow-md"
          style={{ backgroundColor: BRAND_COLORS.primary }}
        >
          <PlusIcon size={20} />
          Dodaj okno
        </button>
      </div>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Controls - Mobile Friendly */}
        <div className={`
          ${isMobileMenuOpen ? 'block' : 'hidden'} sm:block 
          bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md space-y-6
        `}>
          {/* Grid configuration */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <LayoutGridIcon size={20} />
              Sekcje okna
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Columns control */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 mb-2">Kolumny</span>
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => updateWindowGrid(
                      activeWindowIndex,
                      Math.max(1, activeWindow.columns - 1),
                      activeWindow.rows
                    )}
                    className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                  >
                    <MinusIcon size={16} />
                  </button>
                  <span className="flex-grow text-center font-medium">
                    {activeWindow.columns}
                  </span>
                  <button
                    onClick={() => updateWindowGrid(
                      activeWindowIndex,
                      Math.min(4, activeWindow.columns + 1),
                      activeWindow.rows
                    )}
                    className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                  >
                    <PlusIcon size={16} />
                  </button>
                </div>
              </div>

              {/* Rows control */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 mb-2">Rzędy</span>
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => updateWindowGrid(
                      activeWindowIndex,
                      activeWindow.columns,
                      Math.max(1, activeWindow.rows - 1)
                    )}
                    className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                  >
                    <MinusIcon size={16} />
                  </button>
                  <span className="flex-grow text-center font-medium">
                    {activeWindow.rows}
                  </span>
                  <button
                    onClick={() => updateWindowGrid(
                      activeWindowIndex,
                      activeWindow.columns,
                      Math.min(4, activeWindow.rows + 1)
                    )}
                    className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                  >
                    <PlusIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section configuration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Konfiguracja sekcji</label>
            <div className="grid gap-4">
              {activeWindow.sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`p-4 border rounded transition-all duration-200
                    ${index === activeSectionIndex ? 'bg-red-50 border-red-500 shadow-md' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">Sekcja {index + 1}</span>
                    <select
                      value={section.type}
                      onChange={(e) => updateSection(activeWindowIndex, index, { type: e.target.value })}
                      className="p-1 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      {windowTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Section size controls */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Szerokość względna (%)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="20"
                          max="200"
                          value={section.width}
                          onChange={(e) => updateSection(activeWindowIndex, index, { 
                            width: parseInt(e.target.value)
                          })}
                          className="flex-grow"
                        />
                        <input
                          type="number"
                          value={section.width}
                          onChange={(e) => updateSection(activeWindowIndex, index, { 
                            width: Math.max(20, Math.min(200, parseInt(e.target.value) || 100))
                          })}
                          className="w-16 p-1 border rounded text-center focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Wysokość względna (%)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="20"
                          max="200"
                          value={section.height}
                          onChange={(e) => updateSection(activeWindowIndex, index, { 
                            height: parseInt(e.target.value)
                          })}
                          className="flex-grow"
                        />
                        <input
                          type="number"
                          value={section.height}
                          onChange={(e) => updateSection(activeWindowIndex, index, { 
                            height: Math.max(20, Math.min(200, parseInt(e.target.value) || 100))
                          })}
                          className="w-16 p-1 border rounded text-center focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Other controls (dimensions, material, etc.) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Wymiary</label>
            <div className="flex gap-4">
              <div>
                <span className="text-sm text-gray-500">Szerokość (cm)</span>
                <input
                  type="number"
                  value={activeWindow.width}
                  onChange={(e) => updateWindow(activeWindowIndex, { 
                    width: Math.max(50, Math.min(300, parseInt(e.target.value) || 50)) 
                  })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <span className="text-sm text-gray-500">Wysokość (cm)</span>
                <input
                  type="number"
                  value={activeWindow.height}
                  onChange={(e) => updateWindow(activeWindowIndex, { 
                    height: Math.max(50, Math.min(300, parseInt(e.target.value) || 50)) 
                  })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Material, glass, and color selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Materiał</label>
              <select
                value={activeWindow.material}
                onChange={(e) => updateWindow(activeWindowIndex, { material: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {materials.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rodzaj szkła</label>
              <select
                value={activeWindow.glassType}
                onChange={(e) => updateWindow(activeWindowIndex, { glassType: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {glassTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kolor</label>
              <div className="grid grid-cols-2 gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => updateWindow(activeWindowIndex, { color })}
                    className={`p-2 border rounded text-left transition-colors
                      ${activeWindow.color === color ? 'bg-red-100 border-red-500 shadow-sm' : 'hover:bg-gray-100'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Installation type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Typ montażu</label>
            <div className="grid grid-cols-1 gap-2">
              {installationTypes.map(type => (
                <button
                  key={type.type}
                  onClick={() => setProject(prev => ({ ...prev, installationType: type }))}
                  className={`p-2 border rounded text-left transition-colors
                    ${project.installationType.type === type.type ? 'bg-red-100 border-red-500 shadow-sm' : 'hover:bg-gray-100'}`}
                >
                  {type.type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <LayoutGridIcon size={20} />
              Podgląd
            </h3>
            <div 
              className="w-full aspect-square flex items-center justify-center perspective-1000"
            >
              <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                <div className="absolute inset-0 flex items-center justify-center perspective-1000">
                  <div 
                    className="relative transition-transform duration-500"
                    style={{ transform: 'rotateX(10deg) rotateY(-20deg)' }}
                  >
                    {/* Enhanced wall backdrop with texture */}
                    <div 
                      className="absolute -inset-8 bg-gradient-to-br from-gray-100 to-gray-300"
                      style={{
                        transform: 'translateZ(-20px)',
                        boxShadow: 'inset 0 0 50px rgba(0,0,0,0.15)',
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 21px)',
                      }}
                    />
                    
                    {/* Window frame with enhanced shadows and reflections */}
                    <div 
                      className="relative transition-all duration-300"
                      style={{
                        width: `${activeWindow.width}px`,
                        height: `${activeWindow.height}px`,
                        maxWidth: '100%',
                        maxHeight: '100%',
                        backgroundColor: '#f8f9fa',
                        boxShadow: '0 20px 25px rgba(0,0,0,0.3), inset 0 0 30px rgba(255,255,255,0.5)',
                        border: `8px solid ${getWindowColorStyles(activeWindow.color).border}`,
                        borderRadius: '4px',
                        transform: 'translateZ(0)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Glass reflection effect */}
                      <div 
                        className="absolute inset-0 opacity-20"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
                          pointerEvents: 'none'
                        }}
                      />

                      {/* Window sections grid */}
                      <div 
                        className="absolute inset-0 grid gap-1"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: activeWindow.sections
                            .slice(0, activeWindow.columns)
                            .map(section => `${section.width}fr`)
                            .join(' '),
                          gridTemplateRows: activeWindow.sections
                            .reduce((acc, section, i) => {
                              const row = Math.floor(i / activeWindow.columns);
                              if (!acc[row]) acc[row] = section.height;
                              return acc;
                            }, [])
                            .map(height => `${height}fr`)
                            .join(' ')
                        }}
                      >
                        {activeWindow.sections.map((section, index) => (
                          <div
                            key={section.id}
                            className={`relative border transition-all duration-300 cursor-pointer
                              ${index === activeSectionIndex ? 'border-red-500 shadow-inner' : 'border-gray-300'}`}
                            onClick={() => setActiveSectionIndex(index)}
                            style={{
                              background: 'linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(0,0,0,0.05))'
                            }}
                          >
                            {section.type !== 'Stałe' && (
                              <>
                                {/* Enhanced handle with 3D effect */}
                                <div 
                                  className="absolute right-1 top-1/2 w-2 h-4 rounded-full transition-all duration-300"
                                  style={{
                                    transform: 'translateY(-50%) translateZ(2px)',
                                    background: `linear-gradient(90deg, ${getWindowColorStyles(activeWindow.color).handles}, ${getWindowColorStyles(activeWindow.color).handles})`,
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)'
                                  }}
                                />
                                
                                {/* Opening indicators with enhanced visibility */}
                                {section.type === 'Uchylno-rozwieralne' && (
                                  <>
                                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gray-400 opacity-50" />
                                    <div className="absolute inset-y-0 right-0 w-0.5 bg-gray-400 opacity-50" />
                                  </>
                                )}
                                {section.type === 'Rozwierane' && (
                                  <div className="absolute inset-y-0 right-0 w-0.5 bg-gray-400 opacity-50" />
                                )}
                                {section.type === 'Uchylne' && (
                                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gray-400 opacity-50" />
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <SaveIcon size={20} />
              Wycena szacunkowa
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                <span>Cena podstawowa:</span>
                <span className="font-medium">{calculatePrice(activeWindow).toFixed(2)} zł</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded shadow-sm font-medium" 
                   style={{ color: BRAND_COLORS.primary }}>
                <span>Suma (wszystkie okna):</span>
                <span>
                  {project.windows.reduce((sum, window) => sum + calculatePrice(window), 0).toFixed(2)} zł
                </span>
              </div>
            </div>
          </div>

          {/* Save button */}
          <button 
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg text-lg font-semibold"
            style={{ backgroundColor: BRAND_COLORS.primary }}
          >
            <SaveIcon size={24} />
            Zapisz projekt
          </button>
        </div>
      </div>
    </div>
  );
};

export default WindowConfigurator;