import React, { useRef, useState, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import useKitchenStore from '../store/useKitchenStore'

function BaseCabinetMesh({ width, depth, height, color, selected }) {
  const emissive = selected ? '#3a7bd5' : '#000000'
  const emissiveIntensity = selected ? 0.3 : 0

  return (
    <group>
      {/* Main body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Door panel */}
      <mesh position={[0, 0, depth / 2 + 0.005]}>
        <boxGeometry args={[width * 0.9, height * 0.85, 0.01]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.05} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, -height * 0.1, depth / 2 + 0.02]}>
        <cylinderGeometry args={[0.01, 0.01, width * 0.4, 8]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

function WallCabinetMesh({ width, depth, height, color, selected }) {
  const emissive = selected ? '#3a7bd5' : '#000000'
  const emissiveIntensity = selected ? 0.3 : 0

  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, depth / 2 + 0.005]}>
        <boxGeometry args={[width * 0.9, height * 0.85, 0.01]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[0, height * 0.1, depth / 2 + 0.02]}>
        <cylinderGeometry args={[0.01, 0.01, width * 0.4, 8]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

function CountertopMesh({ width, depth, height, color, selected }) {
  const emissive = selected ? '#3a7bd5' : '#000000'
  const emissiveIntensity = selected ? 0.3 : 0

  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} roughness={0.2} metalness={0.3} />
    </mesh>
  )
}

function SinkMesh({ width, depth, height, color, selected }) {
  const emissive = selected ? '#3a7bd5' : '#000000'
  const emissiveIntensity = selected ? 0.3 : 0

  return (
    <group>
      {/* Cabinet base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height * 0.9, depth]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Counter top */}
      <mesh position={[0, height * 0.45, 0]} castShadow>
        <boxGeometry args={[width, height * 0.05, depth]} />
        <meshStandardMaterial color="#C0C0C0" roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Sink basin */}
      <mesh position={[0, height * 0.48, 0]}>
        <boxGeometry args={[width * 0.65, height * 0.05, depth * 0.65]} />
        <meshStandardMaterial color="#888" roughness={0.1} metalness={0.6} />
      </mesh>
      {/* Faucet base */}
      <mesh position={[0, height * 0.55, -depth * 0.1]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
        <meshStandardMaterial color="#999" metalness={0.8} roughness={0.1} />
      </mesh>
      {/* Faucet head */}
      <mesh position={[0, height * 0.62, depth * 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.15, 8]} />
        <meshStandardMaterial color="#999" metalness={0.8} roughness={0.1} />
      </mesh>
    </group>
  )
}

function StoveMesh({ width, depth, height, color, selected }) {
  const emissive = selected ? '#3a7bd5' : '#000000'
  const emissiveIntensity = selected ? 0.3 : 0
  const burnerPositions = [
    [-width * 0.22, -depth * 0.2],
    [width * 0.22, -depth * 0.2],
    [-width * 0.22, depth * 0.2],
    [width * 0.22, depth * 0.2],
  ]

  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Stovetop surface */}
      <mesh position={[0, height / 2 + 0.005, 0]}>
        <boxGeometry args={[width * 0.98, 0.01, depth * 0.7]} />
        <meshStandardMaterial color="#222" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Burners */}
      {burnerPositions.map((pos, i) => (
        <mesh key={i} position={[pos[0], height / 2 + 0.015, pos[1]]}>
          <cylinderGeometry args={[0.08, 0.08, 0.01, 16]} />
          <meshStandardMaterial color="#444" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
      {/* Oven panel */}
      <mesh position={[0, 0, depth / 2 + 0.005]}>
        <boxGeometry args={[width * 0.9, height * 0.5, 0.01]} />
        <meshStandardMaterial color="#333" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  )
}

function RefrigeratorMesh({ width, depth, height, color, selected }) {
  const emissive = selected ? '#3a7bd5' : '#000000'
  const emissiveIntensity = selected ? 0.3 : 0

  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Freezer door */}
      <mesh position={[0, height * 0.3, depth / 2 + 0.005]}>
        <boxGeometry args={[width * 0.95, height * 0.35, 0.01]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.2} />
      </mesh>
      {/* Fridge door */}
      <mesh position={[0, -height * 0.15, depth / 2 + 0.005]}>
        <boxGeometry args={[width * 0.95, height * 0.55, 0.01]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.2} />
      </mesh>
      {/* Handle top */}
      <mesh position={[width * 0.35, height * 0.3, depth / 2 + 0.02]}>
        <cylinderGeometry args={[0.015, 0.015, height * 0.3, 8]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.1} />
      </mesh>
      {/* Handle bottom */}
      <mesh position={[width * 0.35, -height * 0.18, depth / 2 + 0.02]}>
        <cylinderGeometry args={[0.015, 0.015, height * 0.45, 8]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.1} />
      </mesh>
      {/* Separator line */}
      <mesh position={[0, height * 0.08, depth / 2 + 0.01]}>
        <boxGeometry args={[width * 0.95, 0.01, 0.005]} />
        <meshStandardMaterial color="#aaa" metalness={0.5} />
      </mesh>
    </group>
  )
}

function IslandMesh({ width, depth, height, color, selected }) {
  const emissive = selected ? '#3a7bd5' : '#000000'
  const emissiveIntensity = selected ? 0.3 : 0

  return (
    <group>
      {/* Base */}
      <mesh castShadow receiveShadow position={[0, -height * 0.05, 0]}>
        <boxGeometry args={[width, height * 0.9, depth]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Countertop */}
      <mesh position={[0, height * 0.46, 0]} castShadow>
        <boxGeometry args={[width + 0.05, height * 0.08, depth + 0.05]} />
        <meshStandardMaterial color="#888" roughness={0.15} metalness={0.4} />
      </mesh>
    </group>
  )
}

function DishwasherMesh({ width, depth, height, color, selected }) {
  const emissive = selected ? '#3a7bd5' : '#000000'
  const emissiveIntensity = selected ? 0.3 : 0

  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} roughness={0.3} metalness={0.3} />
      </mesh>
      {/* Control panel */}
      <mesh position={[0, height * 0.48, depth / 2 + 0.005]}>
        <boxGeometry args={[width * 0.9, height * 0.1, 0.01]} />
        <meshStandardMaterial color="#333" roughness={0.4} metalness={0.4} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0, depth / 2 + 0.005]}>
        <boxGeometry args={[width * 0.9, height * 0.85, 0.01]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.35} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, height * 0.35, depth / 2 + 0.02]}>
        <cylinderGeometry args={[0.012, 0.012, width * 0.5, 8]} />
        <meshStandardMaterial color="#777" metalness={0.8} roughness={0.1} />
      </mesh>
    </group>
  )
}

function OvenMesh({ width, depth, height, color, selected }) {
  const emissive = selected ? '#3a7bd5' : '#000000'
  const emissiveIntensity = selected ? 0.3 : 0

  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Oven window */}
      <mesh position={[0, -height * 0.05, depth / 2 + 0.01]}>
        <boxGeometry args={[width * 0.7, height * 0.45, 0.01]} />
        <meshStandardMaterial color="#111" roughness={0.1} metalness={0.5} transparent opacity={0.8} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, height * 0.35, depth / 2 + 0.025]}>
        <cylinderGeometry args={[0.012, 0.012, width * 0.6, 8]} />
        <meshStandardMaterial color="#777" metalness={0.8} roughness={0.1} />
      </mesh>
      {/* Knobs */}
      {[-width * 0.2, width * 0.2].map((x, i) => (
        <mesh key={i} position={[x, height * 0.38, depth / 2 + 0.02]}>
          <cylinderGeometry args={[0.025, 0.025, 0.02, 12]} />
          <meshStandardMaterial color="#555" metalness={0.5} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

function TallCabinetMesh({ width, depth, height, color, selected }) {
  const emissive = selected ? '#3a7bd5' : '#000000'
  const emissiveIntensity = selected ? 0.3 : 0

  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Upper door */}
      <mesh position={[0, height * 0.25, depth / 2 + 0.005]}>
        <boxGeometry args={[width * 0.9, height * 0.45, 0.01]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Lower door */}
      <mesh position={[0, -height * 0.25, depth / 2 + 0.005]}>
        <boxGeometry args={[width * 0.9, height * 0.45, 0.01]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Handles */}
      <mesh position={[0, height * 0.05, depth / 2 + 0.02]}>
        <cylinderGeometry args={[0.01, 0.01, width * 0.35, 8]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -height * 0.05, depth / 2 + 0.02]}>
        <cylinderGeometry args={[0.01, 0.01, width * 0.35, 8]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

const MESH_COMPONENTS = {
  base_cabinet: BaseCabinetMesh,
  wall_cabinet: WallCabinetMesh,
  tall_cabinet: TallCabinetMesh,
  countertop: CountertopMesh,
  sink: SinkMesh,
  stove: StoveMesh,
  refrigerator: RefrigeratorMesh,
  island: IslandMesh,
  dishwasher: DishwasherMesh,
  oven: OvenMesh,
}

export default function KitchenItem({ item }) {
  const groupRef = useRef()
  const { selectItem, selectedId, updateItem, pendingType } = useKitchenStore()
  const selected = selectedId === item.id
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef(null)
  const { camera, gl } = useThree()

  const MeshComponent = MESH_COMPONENTS[item.type] || BaseCabinetMesh

  const yPosition = item.position[1]

  const handlePointerDown = useCallback((e) => {
    if (pendingType) return
    e.stopPropagation()
    selectItem(item.id)

    setIsDragging(true)
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      itemPos: [...item.position],
    }
    gl.domElement.style.cursor = 'grabbing'
  }, [pendingType, item.id, item.position, selectItem, gl])

  const handlePointerUp = useCallback((e) => {
    if (isDragging) {
      setIsDragging(false)
      gl.domElement.style.cursor = 'auto'
      dragStart.current = null
    }
  }, [isDragging, gl])

  const handlePointerMove = useCallback((e) => {
    if (!isDragging || !dragStart.current) return
    e.stopPropagation()

    // Use raycasting against the floor plane for drag
    const rect = gl.domElement.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera({ x, y }, camera)

    const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const target = new THREE.Vector3()
    raycaster.ray.intersectPlane(floorPlane, target)

    if (target) {
      updateItem(item.id, {
        position: [
          Math.round(target.x * 10) / 10,
          item.position[1],
          Math.round(target.z * 10) / 10,
        ],
      })
    }
  }, [isDragging, item.id, item.position, camera, gl, updateItem])

  const rotationY = (item.rotation * Math.PI) / 180

  return (
    <group
      ref={groupRef}
      position={[item.position[0], yPosition, item.position[2]]}
      rotation={[0, rotationY, 0]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        if (!pendingType) gl.domElement.style.cursor = 'pointer'
      }}
      onPointerLeave={() => {
        if (!isDragging) gl.domElement.style.cursor = 'auto'
      }}
    >
      <MeshComponent
        width={item.width}
        depth={item.depth}
        height={item.height}
        color={item.color}
        selected={selected}
      />
      {selected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(item.width + 0.05, item.height + 0.05, item.depth + 0.05)]} />
          <lineBasicMaterial color="#4a9eff" linewidth={2} />
        </lineSegments>
      )}
    </group>
  )
}
