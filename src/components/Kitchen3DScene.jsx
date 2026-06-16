import React, { useRef, useEffect, useState } from 'react'
import { useThree, useLoader } from '@react-three/fiber'
import { Grid, Environment } from '@react-three/drei'
import * as THREE from 'three'
import useKitchenStore, { COMPONENT_TYPES } from '../store/useKitchenStore'
import KitchenItem from './KitchenItem'

const ROOM_SIZE = 8
const WALL_THICKNESS = 0.15
const CEILING_HEIGHT = 3

function ReferenceImagePlane({ imageUrl }) {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    if (!imageUrl) return
    const loader = new THREE.TextureLoader()
    loader.load(imageUrl, (tex) => {
      setTexture(tex)
    })
  }, [imageUrl])

  if (!texture) return null

  return (
    <mesh position={[0, CEILING_HEIGHT / 2, -ROOM_SIZE / 2 + WALL_THICKNESS / 2 + 0.01]}>
      <planeGeometry args={[ROOM_SIZE * 0.8, CEILING_HEIGHT * 0.8]} />
      <meshBasicMaterial map={texture} transparent opacity={0.7} />
    </mesh>
  )
}

export default function Kitchen3DScene() {
  const { items, addItem, selectItem, pendingType, referenceImage } = useKitchenStore()
  const { camera, gl } = useThree()
  const floorRef = useRef()

  const handleFloorClick = (e) => {
    e.stopPropagation()

    if (pendingType) {
      const point = e.point
      const defaults = COMPONENT_TYPES[pendingType]
      if (!defaults) return

      let yPos = defaults.height / 2
      if (defaults.wallMounted) {
        yPos = defaults.mountHeight + defaults.height / 2
      }

      // Clamp to room bounds
      const halfRoom = ROOM_SIZE / 2 - 0.4
      const x = Math.max(-halfRoom, Math.min(halfRoom, point.x))
      const z = Math.max(-halfRoom, Math.min(halfRoom, point.z))

      addItem(pendingType, [x, yPos, z])
    } else {
      selectItem(null)
    }
  }

  const handleFloorMiss = (e) => {
    // Only deselect if clicking truly on background (not on any mesh)
  }

  return (
    <>
      {/* Ambient and directional lighting */}
      <ambientLight intensity={0.5} color="#fff5e0" />
      <directionalLight
        position={[3, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        color="#fffaf0"
      />
      <directionalLight position={[-5, 4, -3]} intensity={0.4} color="#e0e8ff" />
      <pointLight position={[0, CEILING_HEIGHT - 0.5, 0]} intensity={0.8} color="#fff8e7" distance={10} />

      {/* Floor */}
      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        onClick={handleFloorClick}
      >
        <planeGeometry args={[ROOM_SIZE, ROOM_SIZE]} />
        <meshStandardMaterial color="#c8beb0" roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Grid overlay on floor */}
      <Grid
        position={[0, 0.001, 0]}
        args={[ROOM_SIZE, ROOM_SIZE]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#9a8f82"
        sectionSize={1}
        sectionThickness={1}
        sectionColor="#7a6f62"
        fadeDistance={20}
        fadeStrength={1}
        infiniteGrid={false}
      />

      {/* Back wall */}
      <mesh
        position={[0, CEILING_HEIGHT / 2, -ROOM_SIZE / 2]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[ROOM_SIZE, CEILING_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial color="#e8e0d8" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Left wall */}
      <mesh
        position={[-ROOM_SIZE / 2, CEILING_HEIGHT / 2, 0]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[WALL_THICKNESS, CEILING_HEIGHT, ROOM_SIZE]} />
        <meshStandardMaterial color="#e0d8d0" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Right wall */}
      <mesh
        position={[ROOM_SIZE / 2, CEILING_HEIGHT / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[WALL_THICKNESS, CEILING_HEIGHT, ROOM_SIZE]} />
        <meshStandardMaterial color="#e0d8d0" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, CEILING_HEIGHT, 0]} receiveShadow>
        <boxGeometry args={[ROOM_SIZE, WALL_THICKNESS, ROOM_SIZE]} />
        <meshStandardMaterial color="#f0ebe4" roughness={1} metalness={0.0} />
      </mesh>

      {/* Baseboard trim on back wall */}
      <mesh position={[0, 0.05, -ROOM_SIZE / 2 + WALL_THICKNESS / 2 + 0.005]}>
        <boxGeometry args={[ROOM_SIZE, 0.1, 0.01]} />
        <meshStandardMaterial color="#d0c8c0" roughness={0.7} />
      </mesh>

      {/* Baseboard trim on left wall */}
      <mesh position={[-ROOM_SIZE / 2 + WALL_THICKNESS / 2 + 0.005, 0.05, 0]}>
        <boxGeometry args={[0.01, 0.1, ROOM_SIZE]} />
        <meshStandardMaterial color="#d0c8c0" roughness={0.7} />
      </mesh>

      {/* Reference image on back wall */}
      {referenceImage && <ReferenceImagePlane imageUrl={referenceImage} />}

      {/* Kitchen items */}
      {items.map((item) => (
        <KitchenItem key={item.id} item={item} />
      ))}
    </>
  )
}
