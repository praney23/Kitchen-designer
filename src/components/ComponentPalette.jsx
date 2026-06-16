import React from 'react'
import useKitchenStore, { COMPONENT_TYPES } from '../store/useKitchenStore'

const CATEGORIES = {
  cabinets: { label: 'Cabinets', color: '#8B7355' },
  surfaces: { label: 'Surfaces', color: '#C0C0C0' },
  appliances: { label: 'Appliances', color: '#4a9eff' },
}

export default function ComponentPalette() {
  const { pendingType, setPendingType } = useKitchenStore()

  const grouped = {}
  Object.entries(COMPONENT_TYPES).forEach(([key, val]) => {
    const cat = val.category || 'other'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push({ key, ...val })
  })

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: '#1e2030' }}
    >
      <div className="px-4 py-3 border-b border-gray-700">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Components
        </h2>
        <p className="text-xs text-gray-500 mt-1">Click to select, then click floor</p>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {Object.entries(CATEGORIES).map(([catKey, catInfo]) => {
          const items = grouped[catKey] || []
          if (items.length === 0) return null

          return (
            <div key={catKey} className="mb-1">
              <div className="px-4 py-1.5">
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: catInfo.color }}
                >
                  {catInfo.label}
                </span>
              </div>
              <div className="px-2 space-y-0.5">
                {items.map(({ key, label, icon, width, depth, height }) => {
                  const isActive = pendingType === key
                  return (
                    <button
                      key={key}
                      onClick={() => setPendingType(isActive ? null : key)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150"
                      style={{
                        background: isActive
                          ? 'rgba(74, 158, 255, 0.2)'
                          : 'transparent',
                        border: isActive
                          ? '1px solid rgba(74, 158, 255, 0.5)'
                          : '1px solid transparent',
                        color: isActive ? '#4a9eff' : '#ccc',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                          e.currentTarget.style.color = '#fff'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = '#ccc'
                        }
                      }}
                    >
                      <span className="text-lg leading-none w-6 text-center flex-shrink-0">
                        {icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{label}</div>
                        <div className="text-xs text-gray-500">
                          {width}m × {depth}m × {height}m
                        </div>
                      </div>
                      {isActive && (
                        <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                          Active
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {pendingType && (
        <div className="p-3 border-t border-gray-700">
          <button
            onClick={() => setPendingType(null)}
            className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            ✕ Cancel placement
          </button>
        </div>
      )}
    </div>
  )
}
