import React, { useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import Kitchen3DScene from './Kitchen3DScene'
import useKitchenStore from '../store/useKitchenStore'

export default function Canvas3D() {
  const { pendingType, selectItem, setPendingType } = useKitchenStore()

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      if (pendingType) {
        setPendingType(null)
      } else {
        selectItem(null)
      }
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      useKitchenStore.getState().deleteSelected()
    }
  }, [pendingType, selectItem, setPendingType])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div
      className="relative flex-1 h-full"
      style={{ cursor: pendingType ? 'crosshair' : 'auto' }}
    >
      {pendingType && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg pointer-events-none">
          Click on the floor to place: {pendingType.replace('_', ' ')} &nbsp;·&nbsp; Press Esc to cancel
        </div>
      )}

      <Canvas
        shadows
        style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' }}
        gl={{ antialias: true, toneMapping: 3, toneMappingExposure: 1.1 }}
        onPointerMissed={() => {
          if (!pendingType) selectItem(null)
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[4, 5, 7]}
          fov={50}
          near={0.1}
          far={100}
        />
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          panSpeed={0.8}
          zoomSpeed={0.8}
          rotateSpeed={0.6}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={2}
          maxDistance={20}
          target={[0, 0, 0]}
        />

        {/* Fog for depth */}
        <fog attach="fog" args={['#1a1a2e', 15, 30]} />

        <Kitchen3DScene />
      </Canvas>
    </div>
  )
}
