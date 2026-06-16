import { create } from 'zustand'

export const COMPONENT_TYPES = {
  base_cabinet: {
    label: 'Base Cabinet',
    width: 0.6,
    depth: 0.6,
    height: 0.85,
    color: '#8B7355',
    icon: '🗄️',
    category: 'cabinets',
  },
  wall_cabinet: {
    label: 'Wall Cabinet',
    width: 0.6,
    depth: 0.35,
    height: 0.7,
    color: '#8B7355',
    icon: '🗄️',
    category: 'cabinets',
    wallMounted: true,
    mountHeight: 1.5,
  },
  tall_cabinet: {
    label: 'Tall Cabinet',
    width: 0.6,
    depth: 0.6,
    height: 2.1,
    color: '#8B7355',
    icon: '🗄️',
    category: 'cabinets',
  },
  countertop: {
    label: 'Countertop',
    width: 1.2,
    depth: 0.6,
    height: 0.05,
    color: '#C0C0C0',
    icon: '▬',
    category: 'surfaces',
  },
  sink: {
    label: 'Sink',
    width: 0.8,
    depth: 0.6,
    height: 0.85,
    color: '#A8A8A8',
    icon: '🚰',
    category: 'appliances',
  },
  stove: {
    label: 'Stove',
    width: 0.6,
    depth: 0.6,
    height: 0.85,
    color: '#333333',
    icon: '🔥',
    category: 'appliances',
  },
  refrigerator: {
    label: 'Refrigerator',
    width: 0.75,
    depth: 0.75,
    height: 1.8,
    color: '#D0D0D0',
    icon: '❄️',
    category: 'appliances',
  },
  island: {
    label: 'Island',
    width: 1.5,
    depth: 0.9,
    height: 0.9,
    color: '#D2B48C',
    icon: '⬛',
    category: 'surfaces',
  },
  dishwasher: {
    label: 'Dishwasher',
    width: 0.6,
    depth: 0.6,
    height: 0.85,
    color: '#B0B0B0',
    icon: '🍽️',
    category: 'appliances',
  },
  oven: {
    label: 'Oven',
    width: 0.6,
    depth: 0.6,
    height: 0.9,
    color: '#2d2d2d',
    icon: '🟫',
    category: 'appliances',
  },
}

let nextId = 1

const useKitchenStore = create((set, get) => ({
  items: [],
  selectedId: null,
  viewMode: '3d',
  referenceImage: null,
  pendingType: null,
  history: [],

  addItem: (type, position) => {
    const defaults = COMPONENT_TYPES[type]
    if (!defaults) return

    const newItem = {
      id: `item_${nextId++}`,
      type,
      position: [position[0], position[1], position[2]],
      rotation: 0,
      color: defaults.color,
      width: defaults.width,
      depth: defaults.depth,
      height: defaults.height,
    }

    set((state) => ({
      items: [...state.items, newItem],
      history: [...state.history, state.items],
      pendingType: null,
    }))

    return newItem.id
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
      history: [...state.history, state.items],
    }))
  },

  updateItem: (id, updates) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }))
  },

  selectItem: (id) => {
    set({ selectedId: id })
  },

  setViewMode: (mode) => {
    set({ viewMode: mode })
  },

  setReferenceImage: (dataUrl) => {
    set({ referenceImage: dataUrl })
  },

  setPendingType: (type) => {
    set({ pendingType: type, selectedId: null })
  },

  undo: () => {
    set((state) => {
      if (state.history.length === 0) return state
      const previous = state.history[state.history.length - 1]
      return {
        items: previous,
        history: state.history.slice(0, -1),
        selectedId: null,
      }
    })
  },

  deleteSelected: () => {
    const { selectedId, removeItem } = get()
    if (selectedId) {
      removeItem(selectedId)
    }
  },

  rotateSelected: (degrees) => {
    const { selectedId, items } = get()
    if (!selectedId) return
    const item = items.find((i) => i.id === selectedId)
    if (!item) return
    const newRotation = (item.rotation + degrees) % 360
    get().updateItem(selectedId, { rotation: newRotation })
  },
}))

export default useKitchenStore
