import React from 'react'
import useKitchenStore from './store/useKitchenStore'
import Toolbar from './components/Toolbar'
import ComponentPalette from './components/ComponentPalette'
import Canvas3D from './components/Canvas3D'
import FloorPlan from './components/FloorPlan'
import ImageUpload from './components/ImageUpload'

export default function App() {
  const { viewMode, items, selectedId } = useKitchenStore()

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#0f1020' }}>
      {/* Top toolbar */}
      <Toolbar />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - component palette */}
        <div
          className="flex flex-col flex-shrink-0 overflow-hidden"
          style={{
            width: '220px',
            background: '#1e2030',
            borderRight: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {/* Palette */}
          <div className="flex-1 overflow-y-auto">
            <ComponentPalette />
          </div>

          {/* Image upload section at bottom */}
          <div
            className="p-3 flex-shrink-0"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2 px-1">
              Reference Photo
            </div>
            <ImageUpload compact />
          </div>

          {/* Stats */}
          <div
            className="px-4 py-2.5 text-xs text-gray-600 flex-shrink-0"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            {items.length} item{items.length !== 1 ? 's' : ''} placed
            {selectedId && <span className="text-blue-500 ml-2">· 1 selected</span>}
          </div>
        </div>

        {/* Main view area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {viewMode === '3d' ? (
            <Canvas3D />
          ) : (
            <FloorPlan />
          )}
        </div>
      </div>
    </div>
  )
}
