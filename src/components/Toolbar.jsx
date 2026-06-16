import React, { useRef } from 'react'
import useKitchenStore, { COMPONENT_TYPES } from '../store/useKitchenStore'
import ImageUpload from './ImageUpload'

export default function Toolbar() {
  const {
    viewMode,
    setViewMode,
    selectedId,
    items,
    deleteSelected,
    undo,
    updateItem,
    rotateSelected,
    referenceImage,
    setReferenceImage,
  } = useKitchenStore()

  const selectedItem = items.find((i) => i.id === selectedId)
  const fileInputRef = useRef()

  const handleColorChange = (e) => {
    if (selectedId) {
      updateItem(selectedId, { color: e.target.value })
    }
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setReferenceImage(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0 z-20"
      style={{
        background: '#161826',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        height: '52px',
      }}
    >
      {/* App title */}
      <div className="flex items-center gap-2 mr-4">
        <span className="text-xl">🏠</span>
        <span className="font-bold text-white text-sm tracking-wide hidden sm:block">
          Kitchen Designer 3D
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-700 mx-1" />

      {/* View toggle */}
      <div
        className="flex items-center rounded-lg overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        <button
          onClick={() => setViewMode('3d')}
          className="px-3 py-1.5 text-sm font-medium transition-all"
          style={{
            background: viewMode === '3d' ? '#3a7bd5' : 'transparent',
            color: viewMode === '3d' ? '#fff' : '#aaa',
          }}
        >
          3D View
        </button>
        <button
          onClick={() => setViewMode('floorplan')}
          className="px-3 py-1.5 text-sm font-medium transition-all"
          style={{
            background: viewMode === 'floorplan' ? '#3a7bd5' : 'transparent',
            color: viewMode === 'floorplan' ? '#fff' : '#aaa',
          }}
        >
          Floor Plan
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-700 mx-1" />

      {/* Undo */}
      <button
        onClick={undo}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all"
        title="Undo (Ctrl+Z)"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
        </svg>
        <span className="hidden md:inline">Undo</span>
      </button>

      {/* Delete */}
      <button
        onClick={deleteSelected}
        disabled={!selectedId}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all"
        style={{
          color: selectedId ? '#ff6b6b' : '#555',
          cursor: selectedId ? 'pointer' : 'not-allowed',
          background: selectedId ? 'rgba(255, 107, 107, 0.1)' : 'transparent',
        }}
        onMouseEnter={(e) => {
          if (selectedId) e.currentTarget.style.background = 'rgba(255, 107, 107, 0.2)'
        }}
        onMouseLeave={(e) => {
          if (selectedId) e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)'
          else e.currentTarget.style.background = 'transparent'
        }}
        title="Delete selected (Delete key)"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
        <span className="hidden md:inline">Delete</span>
      </button>

      {/* Rotate buttons - only when selected */}
      {selectedItem && (
        <>
          <div className="w-px h-6 bg-gray-700 mx-1" />
          <button
            onClick={() => rotateSelected(-90)}
            className="px-2.5 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all"
            title="Rotate -90°"
          >
            ↺ 90°
          </button>
          <button
            onClick={() => rotateSelected(90)}
            className="px-2.5 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all"
            title="Rotate +90°"
          >
            ↻ 90°
          </button>
        </>
      )}

      {/* Color picker - only when selected */}
      {selectedItem && (
        <>
          <div className="w-px h-6 bg-gray-700 mx-1" />
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400 hidden md:block">Color</label>
            <div
              className="relative rounded-lg overflow-hidden"
              style={{
                border: '2px solid rgba(255,255,255,0.2)',
                width: '36px',
                height: '28px',
              }}
            >
              <input
                type="color"
                value={selectedItem.color}
                onChange={handleColorChange}
                className="absolute inset-0 w-full h-full cursor-pointer opacity-100"
                style={{ transform: 'scale(1.5)', cursor: 'pointer' }}
                title="Change color"
              />
            </div>
          </div>
        </>
      )}

      {/* Selected item info */}
      {selectedItem && (
        <div
          className="px-3 py-1.5 rounded-lg text-xs text-blue-300 hidden lg:flex items-center gap-1"
          style={{ background: 'rgba(74,158,255,0.1)', border: '1px solid rgba(74,158,255,0.2)' }}
        >
          <span className="opacity-60">Selected:</span>
          <span className="font-medium">{COMPONENT_TYPES[selectedItem.type]?.label}</span>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Upload photo button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all"
        style={{
          background: referenceImage ? 'rgba(74,158,255,0.15)' : 'rgba(255,255,255,0.07)',
          color: referenceImage ? '#4a9eff' : '#aaa',
          border: referenceImage ? '1px solid rgba(74,158,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
        }}
        title="Upload reference photo"
      >
        <span>📷</span>
        <span className="hidden md:inline">{referenceImage ? 'Photo loaded' : 'Upload Photo'}</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* Help */}
      <div
        className="px-2.5 py-1.5 rounded-lg text-xs text-gray-500 hidden xl:block"
        title="Keyboard shortcuts"
      >
        Del: delete · Esc: deselect
      </div>
    </div>
  )
}
