import React, { useRef, useState, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

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

// A single drawer that smoothly slides open/closed along +Z (toward viewer).
// Renders a proper open-topped box (front, back, sides, bottom) so the
// interior reads like a real drawer when pulled out.
function AnimatedDrawer({
  width,
  height,
  depth,
  frontColor,
  boxColor,
  open,
  openDistance,
  onToggle,
  hidden,
}) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const panel = 0.018 // panel thickness
  const target = open ? openDistance : 0

  useFrame(() => {
    const g = groupRef.current
    if (!g) return
    // Soft-close style easing toward the target offset.
    g.position.z += (target - g.position.z) * 0.18
  })

  const innerW = width - panel * 2
  const innerH = height - panel
  const handleY = hidden ? 0 : height * 0.28

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
    >
      {/* Drawer box bottom */}
      <mesh position={[0, -height / 2 + panel / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[innerW, panel, depth]} />
        <meshStandardMaterial color={boxColor} roughness={0.85} metalness={0.02} />
      </mesh>
      {/* Left / right sides */}
      <mesh position={[-innerW / 2 + panel / 2, 0, 0]} castShadow>
        <boxGeometry args={[panel, innerH, depth]} />
        <meshStandardMaterial color={boxColor} roughness={0.85} metalness={0.02} />
      </mesh>
      <mesh position={[innerW / 2 - panel / 2, 0, 0]} castShadow>
        <boxGeometry args={[panel, innerH, depth]} />
        <meshStandardMaterial color={boxColor} roughness={0.85} metalness={0.02} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 0, -depth / 2 + panel / 2]} castShadow>
        <boxGeometry args={[innerW, innerH, panel]} />
        <meshStandardMaterial color={boxColor} roughness={0.85} metalness={0.02} />
      </mesh>
      {/* Front face (the visible drawer panel) */}
      <mesh position={[0, 0, depth / 2 - panel / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, height, panel]} />
        <meshStandardMaterial
          color={frontColor}
          emissive={hovered ? '#3a7bd5' : '#000000'}
          emissiveIntensity={hovered ? 0.25 : 0}
          roughness={0.45}
          metalness={0.05}
        />
      </mesh>
      {/* Slim recessed handle groove */}
      <mesh position={[0, handleY, depth / 2 + 0.002]}>
        <boxGeometry args={[width * 0.55, 0.012, 0.006]} />
        <meshStandardMaterial color="#2b2b2b" roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  )
}

function DrawerWardrobeMesh({ item, selected }) {
  const { width, depth, height, color } = item
  const toggleDrawer = useKitchenStore((s) => s.toggleDrawer)
  const selectItem = useKitchenStore((s) => s.selectItem)
  const open = item.openDrawers || []
  const drawerCount = 4

  const emissive = selected ? '#3a7bd5' : '#000000'
  const emissiveIntensity = selected ? 0.2 : 0
  const shell = 0.02

  // Bottom ~58% of the wardrobe holds the drawer stack; the top is an
  // open hanging section with a rail (like the reel's wardrobe interior).
  const drawerZoneH = height * 0.58
  const drawerZoneBottom = -height / 2
  const drawerH = drawerZoneH / drawerCount
  const cavityDepth = depth - shell * 2
  const openDist = cavityDepth * 0.82

  const handleToggle = (key) => {
    selectItem(item.id)
    toggleDrawer(item.id, key)
  }

  const drawers = []
  for (let i = 0; i < drawerCount; i++) {
    const y = drawerZoneBottom + drawerH * (i + 0.5)
    const key = `d${i}`
    // A centered drawer of depth `cavityDepth` sits flush at the carcass
    // front when its origin is at z = 0.
    drawers.push(
      <group key={key} position={[0, y, 0]}>
        <AnimatedDrawer
          width={width - shell * 2.4}
          height={drawerH - 0.01}
          depth={cavityDepth}
          frontColor={color}
          boxColor="#c9a878"
          open={open.includes(key)}
          openDistance={openDist}
          onToggle={() => handleToggle(key)}
        />
      </group>
    )
  }

  // The concealed inner drawer: a shallow drawer that lives *behind* the
  // top drawer's front panel. It only reveals itself once you slide it out,
  // so it stays hidden during normal use — the reel's key trick.
  const topDrawerY = drawerZoneBottom + drawerH * (drawerCount - 1 + 0.5)
  const hiddenH = drawerH * 0.5
  const hiddenDepth = cavityDepth * 0.6
  // Recess the concealed drawer's closed front ~6cm behind the carcass face
  // so the top drawer's front panel fully hides it until pulled out.
  const hiddenOriginZ = depth / 2 - shell - 0.06 - hiddenDepth / 2
  const hiddenOpen = open.includes('hidden')

  return (
    <group>
      {/* Carcass: left / right / top / bottom / back panels */}
      <mesh position={[-width / 2 + shell / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[shell, height, depth]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh position={[width / 2 - shell / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[shell, height, depth]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh position={[0, height / 2 - shell / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, shell, depth]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh position={[0, -height / 2 + shell / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, shell, depth]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0, -depth / 2 + shell / 2]} castShadow receiveShadow>
        <boxGeometry args={[width, height, shell]} />
        <meshStandardMaterial color="#d8d2c8" roughness={0.85} metalness={0.02} />
      </mesh>

      {/* Divider shelf between the drawer zone and the hanging section */}
      <mesh position={[0, drawerZoneBottom + drawerZoneH, 0]} castShadow receiveShadow>
        <boxGeometry args={[width - shell * 2, shell, depth - shell * 2]} />
        <meshStandardMaterial color="#d8d2c8" roughness={0.8} metalness={0.02} />
      </mesh>

      {/* Hanging rail in the upper open section */}
      <mesh
        position={[0, height / 2 - height * 0.1, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.012, 0.012, width - shell * 3, 12]} />
        <meshStandardMaterial color="#9a9a9a" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Drawer stack */}
      {drawers}

      {/* Hidden inner compartment drawer, tucked behind the top drawer front */}
      <group position={[0, topDrawerY + drawerH * 0.15, hiddenOriginZ]}>
        <AnimatedDrawer
          width={width * 0.5}
          height={hiddenH}
          depth={hiddenDepth}
          frontColor="#b98d5f"
          boxColor="#b98d5f"
          open={hiddenOpen}
          openDistance={openDist + 0.1}
          onToggle={() => handleToggle('hidden')}
          hidden
        />
      </group>
    </group>
  )
}

const MESH_COMPONENTS = {
  base_cabinet: BaseCabinetMesh,
  wall_cabinet: WallCabinetMesh,
  tall_cabinet: TallCabinetMesh,
  drawer_wardrobe: DrawerWardrobeMesh,
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
      {item.type === 'drawer_wardrobe' ? (
        <MeshComponent item={item} selected={selected} />
      ) : (
        <MeshComponent
          width={item.width}
          depth={item.depth}
          height={item.height}
          color={item.color}
          selected={selected}
        />
      )}
      {selected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(item.width + 0.05, item.height + 0.05, item.depth + 0.05)]} />
          <lineBasicMaterial color="#4a9eff" linewidth={2} />
        </lineSegments>
      )}
    </group>
  )
}
