import React, { useState, useCallback } from 'react'
import useKitchenStore, { COMPONENT_TYPES } from '../store/useKitchenStore'

const ROOM_SIZE = 8    // meters
const SCALE = 60       // pixels per meter
const PADDING = 40     // pixels

const SVG_SIZE = ROOM_SIZE * SCALE + PADDING * 2

// Map world coords to SVG coords
// World: x goes right, z goes into screen (down in top-view)
// SVG: x goes right, y goes down
function worldToSVG(x, z) {
  return {
    sx: x * SCALE + SVG_SIZE / 2,
    sy: z * SCALE + SVG_SIZE / 2,
  }
}

const TYPE_COLORS = {
  base_cabinet:  '#8B7355',
  wall_cabinet:  '#A0896A',
  tall_cabinet:  '#7A6245',
  countertop:    '#B0B0B0',
  sink:          '#888',
  stove:         '#444',
  refrigerator:  '#ccc',
  island:        '#D2B48C',
  dishwasher:    '#999',
  oven:          '#333',
}

export default function FloorPlan() {
  const { items, selectedId, selectItem, updateItem } = useKitchenStore()
  const [dragging, setDragging] = useState(null)
  const [svgRef, setSvgRef] = useState(null)

  const handleItemClick = (e, id) => {
    e.stopPropagation()
    selectItem(id)
  }

  const handleSVGClick = () => {
    selectItem(null)
  }

  const handleMouseDown = (e, item) => {
    e.stopPropagation()
    selectItem(item.id)
    setDragging({
      id: item.id,
      startSVGX: e.clientX,
      startSVGY: e.clientY,
      startPosX: item.position[0],
      startPosZ: item.position[2],
    })
  }

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return
    const dx = (e.clientX - dragging.startSVGX) / SCALE
    const dz = (e.clientY - dragging.startSVGY) / SCALE
    const halfRoom = ROOM_SIZE / 2 - 0.3
    const newX = Math.max(-halfRoom, Math.min(halfRoom, dragging.startPosX + dx))
    const newZ = Math.max(-halfRoom, Math.min(halfRoom, dragging.startPosZ + dz))
    updateItem(dragging.id, {
      position: [
        Math.round(newX * 10) / 10,
        items.find(i => i.id === dragging.id)?.position[1] ?? 0,
        Math.round(newZ * 10) / 10,
      ],
    })
  }, [dragging, items, updateItem])

  const handleMouseUp = useCallback(() => {
    setDragging(null)
  }, [])

  const roomPx = ROOM_SIZE * SCALE
  const roomOriginX = PADDING
  const roomOriginY = PADDING

  return (
    <div
      className="flex-1 h-full flex flex-col items-center justify-center overflow-auto"
      style={{ background: '#0f1020' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="mb-4 text-center">
        <h2 className="text-white font-semibold text-lg">Floor Plan</h2>
        <p className="text-gray-500 text-xs mt-1">
          Top-down view · 1 grid square = 0.5m · Drag items to move
        </p>
      </div>

      <div className="relative" style={{ overflow: 'auto', maxWidth: '100%', maxHeight: 'calc(100% - 80px)' }}>
        <svg
          ref={setSvgRef}
          width={SVG_SIZE}
          height={SVG_SIZE}
          onClick={handleSVGClick}
          style={{ display: 'block', userSelect: 'none' }}
        >
          {/* Background */}
          <rect width={SVG_SIZE} height={SVG_SIZE} fill="#0f1020" />

          {/* Grid */}
          {Array.from({ length: ROOM_SIZE * 2 + 1 }, (_, i) => i * (SCALE / 2)).map((pos, i) => (
            <g key={i}>
              <line
                x1={PADDING + pos}
                y1={PADDING}
                x2={PADDING + pos}
                y2={PADDING + roomPx}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={i % 2 === 0 ? 1 : 0.5}
              />
              <line
                x1={PADDING}
                y1={PADDING + pos}
                x2={PADDING + roomPx}
                y2={PADDING + pos}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={i % 2 === 0 ? 1 : 0.5}
              />
            </g>
          ))}

          {/* Room floor */}
          <rect
            x={PADDING}
            y={PADDING}
            width={roomPx}
            height={roomPx}
            fill="rgba(200,190,180,0.08)"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth={2}
          />

          {/* Walls (thicker lines) */}
          {/* Back wall */}
          <rect x={PADDING} y={PADDING} width={roomPx} height={9} fill="#ddd" rx={1} />
          {/* Left wall */}
          <rect x={PADDING} y={PADDING} width={9} height={roomPx} fill="#ddd" rx={1} />
          {/* Right wall */}
          <rect x={PADDING + roomPx - 9} y={PADDING} width={9} height={roomPx} fill="#ddd" rx={1} />

          {/* North/South/East/West labels */}
          <text x={PADDING + roomPx / 2} y={PADDING - 10} textAnchor="middle" fill="#666" fontSize="11">N</text>
          <text x={PADDING + roomPx / 2} y={PADDING + roomPx + 18} textAnchor="middle" fill="#666" fontSize="11">S</text>
          <text x={PADDING - 12} y={PADDING + roomPx / 2 + 4} textAnchor="middle" fill="#666" fontSize="11">W</text>
          <text x={PADDING + roomPx + 14} y={PADDING + roomPx / 2 + 4} textAnchor="middle" fill="#666" fontSize="11">E</text>

          {/* Scale bar */}
          <g transform={`translate(${PADDING}, ${PADDING + roomPx + 26})`}>
            <line x1={0} y1={0} x2={SCALE} y2={0} stroke="#666" strokeWidth={1.5} />
            <line x1={0} y1={-4} x2={0} y2={4} stroke="#666" strokeWidth={1.5} />
            <line x1={SCALE} y1={-4} x2={SCALE} y2={4} stroke="#666" strokeWidth={1.5} />
            <text x={SCALE / 2} y={-7} textAnchor="middle" fill="#666" fontSize="10">1m</text>
          </g>

          {/* Kitchen items */}
          {items.map((item) => {
            const { sx, sy } = worldToSVG(item.position[0], item.position[2])
            const pw = item.width * SCALE
            const pd = item.depth * SCALE

            const rotRad = (item.rotation * Math.PI) / 180

            const isSelected = selectedId === item.id
            const fillColor = item.color || TYPE_COLORS[item.type] || '#888'
            const label = COMPONENT_TYPES[item.type]?.label || item.type

            // Adjusted width/depth after rotation (for bounds, not needed, just rotate)
            return (
              <g
                key={item.id}
                transform={`translate(${sx}, ${sy}) rotate(${item.rotation})`}
                style={{ cursor: 'grab' }}
                onMouseDown={(e) => handleMouseDown(e, item)}
                onClick={(e) => handleItemClick(e, item.id)}
              >
                <rect
                  x={-pw / 2}
                  y={-pd / 2}
                  width={pw}
                  height={pd}
                  fill={fillColor}
                  fillOpacity={0.85}
                  stroke={isSelected ? '#4a9eff' : 'rgba(255,255,255,0.3)'}
                  strokeWidth={isSelected ? 2.5 : 1}
                  rx={2}
                />
                {/* Front face indicator */}
                <rect
                  x={-pw / 2}
                  y={pd / 2 - 4}
                  width={pw}
                  height={4}
                  fill="rgba(0,0,0,0.3)"
                  rx={1}
                />
                {/* Label */}
                <text
                  x={0}
                  y={4}
                  textAnchor="middle"
                  fill="white"
                  fontSize={Math.min(10, pw * 0.18)}
                  fontWeight="500"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {label.split(' ').map((word, i) => (
                    <tspan key={i} x={0} dy={i === 0 ? (label.includes(' ') ? -5 : 0) : 11}>
                      {word}
                    </tspan>
                  ))}
                </text>

                {/* Selection handles */}
                {isSelected && (
                  <>
                    <rect
                      x={-pw / 2 - 4}
                      y={-pd / 2 - 4}
                      width={pw + 8}
                      height={pd + 8}
                      fill="none"
                      stroke="#4a9eff"
                      strokeWidth={1}
                      strokeDasharray="4 3"
                      rx={3}
                    />
                    {/* Corner handles */}
                    {[[-pw/2, -pd/2], [pw/2, -pd/2], [pw/2, pd/2], [-pw/2, pd/2]].map(([cx, cy], i) => (
                      <circle key={i} cx={cx} cy={cy} r={4} fill="#4a9eff" stroke="white" strokeWidth={1} />
                    ))}
                  </>
                )}
              </g>
            )
          })}

          {/* Dimension annotations */}
          <text x={PADDING + 4} y={PADDING + 14} fill="rgba(255,255,255,0.2)" fontSize="10">
            {ROOM_SIZE}m × {ROOM_SIZE}m
          </text>
        </svg>
      </div>

      <div className="mt-3 flex gap-4 text-xs text-gray-500">
        <span>Click item to select</span>
        <span>·</span>
        <span>Drag to move</span>
        <span>·</span>
        <span>{items.length} item{items.length !== 1 ? 's' : ''} placed</span>
      </div>
    </div>
  )
}
