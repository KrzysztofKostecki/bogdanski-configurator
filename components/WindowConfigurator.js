import React, { useState } from 'react';
import { Plus, Minus, X, Save } from 'lucide-react';

// Brand colors from the website
const BRAND_COLORS = {
  primary: '#D64541', // Red from the logo/website
  secondary: '#2C3E50', // Dark blue/gray from the navigation
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

const WindowConfigurator = () => {
  const createSection = () => ({
    id: Date.now(),
    type: 'Stałe',
    isActive: false,
    width: 100, // Width percentage of the total window width
    height: 100 // Height percentage of the total window height
  });

  function createNewWindow() {
    return {
      id: Date.now(),
      width: 100,
      height: 100,
      material: materials[0],
      glassType: glassTypes[0],
      color: colors[0],
      columns: 1,
      rows: 1,
      sections: [createSection()]
    };
  }

  const [project, setProject] = useState({
    windows: [createNewWindow()],
    installationType: installationTypes[0]
  });
  const [activeWindowIndex, setActiveWindowIndex] = useState(0);
  const [activeSectionIndex, setActiveSectionIndex] = useState(null);

  const updateWindowGrid = (windowIndex, newColumns, newRows) => {
    const totalSections = newColumns * newRows;
    const currentSections = project.windows[windowIndex].sections;
    
    let newSections = [];
    for (let i = 0; i < totalSections; i++) {
      newSections[i] = currentSections[i] || createSection();
    }

    updateWindow(windowIndex, {
      columns: newColumns,
      rows: newRows,
      sections: newSections
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Logo and header */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center gap-1">
          <div 
            className="w-8 h-8 flex items-center justify-center text-white font-bold rounded"
            style={{ backgroundColor: BRAND_COLORS.primary }}
          >
            B
          </div>
          <div className="text-xl font-bold" style={{ color: BRAND_COLORS.primary }}>
            BOGDAŃSKI
          </div>
        </div>
        <div className="h-6 w-px bg-gray-300 mx-4" />
        <h1 className="text-2xl font-bold" style={{ color: BRAND_COLORS.secondary }}>
          Konfigurator okien
        </h1>
      </div>
      
      {/* Windows list */}
      <div className="flex gap-4 mb-6 overflow-x-auto p-2">
        {project.windows.map((window, index) => (
          <div 
            key={window.id}
            className={`flex items-center gap-2 p-3 rounded cursor-pointer transition-colors border-2
              ${index === activeWindowIndex ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}
            style={{ borderColor: index === activeWindowIndex ? BRAND_COLORS.primary : undefined }}
            onClick={() => setActiveWindowIndex(index)}
          >
            <span>Okno {index + 1}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeWindow(index);
              }}
              className="p-1 hover:bg-red-100 rounded"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <button
          onClick={addWindow}
          className="flex items-center gap-2 px-4 py-2 text-white rounded hover:bg-red-600"
          style={{ backgroundColor: BRAND_COLORS.primary }}
        >
          <Plus size={20} />
          Dodaj okno
        </button>
      </div>

      {/* Configuration panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
          {/* Grid configuration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sekcje okna</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Kolumny</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateWindowGrid(
                      activeWindowIndex,
                      Math.max(1, activeWindow.columns - 1),
                      activeWindow.rows
                    )}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center">{activeWindow.columns}</span>
                  <button
                    onClick={() => updateWindowGrid(
                      activeWindowIndex,
                      Math.min(4, activeWindow.columns + 1),
                      activeWindow.rows
                    )}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Rzędy</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateWindowGrid(
                      activeWindowIndex,
                      activeWindow.columns,
                      Math.max(1, activeWindow.rows - 1)
                    )}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center">{activeWindow.rows}</span>
                  <button
                    onClick={() => updateWindowGrid(
                      activeWindowIndex,
                      activeWindow.columns,
                      Math.min(4, activeWindow.rows + 1)
                    )}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Plus size={16} />
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
                  className={`p-4 border rounded
                    ${index === activeSectionIndex ? 'bg-red-50 border-red-500' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">Sekcja {index + 1}</span>
                    <select
                      value={section.type}
                      onChange={(e) => updateSection(activeWindowIndex, index, { type: e.target.value })}
                      className="p-1 border rounded"
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
                          className="w-16 p-1 border rounded text-center"
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
                          className="w-16 p-1 border rounded text-center"
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
                  className="w-full p-2 border rounded"
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
                  className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
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
                    className={`p-2 border rounded text-left
                      ${activeWindow.color === color ? 'bg-red-100 border-red-500' : 'hover:bg-gray-100'}`}
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
                  className={`p-2 border rounded text-left
                    ${project.installationType.type === type.type ? 'bg-red-100 border-red-500' : 'hover:bg-gray-100'}`}
                >
                  {type.type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Podgląd</h3>
            <div className="relative w-full" style={{ paddingBottom: '100%' }}>
              <div className="absolute inset-0 flex items-center justify-center perspective-1000">
                <div className="relative" style={{ transform: 'rotateX(10deg) rotateY(-20deg)' }}>
                  {/* Wall backdrop */}
                  <div 
                    className="absolute -inset-8 bg-gray-200"
                    style={{
                      transform: 'translateZ(-20px)',
                      boxShadow: 'inset 0 0 50px rgba(0,0,0,0.1)'
                    }}
                  />
                  
                  {/* Window frame */}
                  <div 
                    className="relative transition-all duration-300"
                    style={{
                      width: `${activeWindow.width}px`,
                      height: `${activeWindow.height}px`,
                      maxWidth: '100%',
                      maxHeight: '100%',
                      backgroundColor: '#f5f5f5',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                      border: `8px solid ${
                        activeWindow.color === 'Biały' ? '#ffffff' :
                        activeWindow.color === 'Czarny' ? '#222222' :
                        activeWindow.color === 'Antracyt' ? '#3c3c3c' :
                        activeWindow.color === 'Złoty Dąb' ? '#b68d4c' : '#ffffff'
                      }`,
                      borderRadius: '4px',
                      transform: 'translateZ(0)'
                    }}
                  >
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
                          className={`relative border transition-all duration-300 ${
                            index === activeSectionIndex ? 'border-red-500' : 'border-gray-300'
                          }`}
                          onClick={() => setActiveSectionIndex(index)}
                        >
                          {section.type !== 'Stałe' && (
                            <>
                              {/* Handle */}
                              <div 
                                className="absolute right-1 top-1/2 w-2 h-4 bg-gray-400 rounded-full"
                                style={{
                                  transform: 'translateY(-50%) translateZ(2px)',
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                }}
                              />
                              
                              {/* Opening indicators */}
                              {section.type === 'Uchylno-rozwieralne' && (
                                <>
                                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gray-300" />
                                  <div className="absolute inset-y-0 right-0 w-0.5 bg-gray-300" />
                                </>
                              )}
                              {section.type === 'Rozwierane' && (
                                <div className="absolute inset-y-0 right-0 w-0.5 bg-gray-300" />
                              )}
                              {section.type === 'Uchylne' && (
                                <div className="absolute inset-x-0 top-0 h-0.5 bg-gray-300" />
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

          {/* Pricing */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Wycena szacunkowa</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Cena podstawowa:</span>
                <span>{calculatePrice(activeWindow).toFixed(2)} zł</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Suma (wszystkie okna):</span>
                <span>
                  {project.windows.reduce((sum, window) => sum + calculatePrice(window), 0).toFixed(2)} zł
                </span>
              </div>
            </div>
          </div>

          {/* Save button */}
          <button 
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded hover:bg-red-600"
            style={{ backgroundColor: BRAND_COLORS.primary }}
          >
            <Save size={20} />
            Zapisz projekt
          </button>
        </div>
      </div>
    </div>
  );
};

export default WindowConfigurator;