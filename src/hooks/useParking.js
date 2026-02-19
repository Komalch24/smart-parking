import { useState, useEffect, useCallback } from 'react'
import { ParkVehicle, sortSlots, isSlotNumberTaken } from '../utils/parkingLogic'

const STORAGE_KEY = 'smartpark_slots_v1'

// Seed with some demo slots on first load
const DEMO_SLOTS = [
  { id: '1', slotNo: 'A1', isCovered: true,  isEVCharging: true,  isOccupied: false },
  { id: '2', slotNo: 'A2', isCovered: true,  isEVCharging: false, isOccupied: true  },
  { id: '3', slotNo: 'A3', isCovered: false, isEVCharging: true,  isOccupied: false },
  { id: '4', slotNo: 'B1', isCovered: true,  isEVCharging: false, isOccupied: false },
  { id: '5', slotNo: 'B2', isCovered: false, isEVCharging: false, isOccupied: true  },
  { id: '6', slotNo: 'B3', isCovered: false, isEVCharging: true,  isOccupied: false },
]

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // corrupt data, ignore
  }
  return null
}

function saveToStorage(slots) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slots))
  } catch {
    console.warn('localStorage unavailable')
  }
}

export function useParking() {
  const [slots, setSlots] = useState(() => {
    const saved = loadFromStorage()
    return saved ?? DEMO_SLOTS
  })
  const [lastResult, setLastResult] = useState(null) // { type: 'success'|'error', message, slot }
  const [activeTab, setActiveTab] = useState('slots') // 'slots' | 'add' | 'park'

  // Persist whenever slots change
  useEffect(() => {
    saveToStorage(slots)
  }, [slots])

  // Add a new slot
  const addSlot = useCallback((slotNo, isCovered, isEVCharging) => {
    const trimmed = slotNo.trim().toUpperCase()

    if (!trimmed) {
      return { ok: false, message: 'Slot number cannot be empty.' }
    }
    if (isSlotNumberTaken(slots, trimmed)) {
      return { ok: false, message: `Slot "${trimmed}" already exists.` }
    }

    const newSlot = {
      id: Date.now().toString(),
      slotNo: trimmed,
      isCovered,
      isEVCharging,
      isOccupied: false,
    }

    setSlots((prev) => sortSlots([...prev, newSlot]))
    return { ok: true, message: `Slot ${trimmed} added successfully!` }
  }, [slots])

  // Park a vehicle
  const parkVehicle = useCallback((needsEV, needsCover) => {
    const result = ParkVehicle(sortSlots(slots), needsEV, needsCover)

    if (result.slot) {
      setSlots((prev) =>
        prev.map((s) =>
          s.id === result.slot.id ? { ...s, isOccupied: true } : s
        )
      )
      setLastResult({ type: 'success', message: result.message, slot: result.slot })
    } else {
      setLastResult({ type: 'error', message: result.message, slot: null })
    }

    return result
  }, [slots])

  // Remove / free a vehicle from slot
  const removeVehicle = useCallback((slotId) => {
    const target = slots.find((s) => s.id === slotId)
    if (!target) return

    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, isOccupied: false } : s))
    )
    setLastResult({
      type: 'info',
      message: `Slot ${target.slotNo} is now free.`,
      slot: target,
    })
  }, [slots])

  // Delete a slot entirely
  const deleteSlot = useCallback((slotId) => {
    setSlots((prev) => prev.filter((s) => s.id !== slotId))
    setLastResult(null)
  }, [])

  // Update slot features (isCovered, isEVCharging)
  // changes = { isCovered?: boolean, isEVCharging?: boolean }
  const updateSlot = useCallback((slotId, changes) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, ...changes } : s))
    )
    const target = slots.find((s) => s.id === slotId)
    if (target) {
      setLastResult({
        type: 'info',
        message: `Slot ${target.slotNo} updated.`,
        slot: { ...target, ...changes },
      })
    }
  }, [slots])

  const clearResult = useCallback(() => setLastResult(null), [])

  return {
    slots: sortSlots(slots),
    lastResult,
    activeTab,
    setActiveTab,
    addSlot,
    parkVehicle,
    removeVehicle,
    deleteSlot,
    updateSlot,
    clearResult,
  }
}