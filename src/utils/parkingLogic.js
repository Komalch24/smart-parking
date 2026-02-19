// ─── Core Parking Logic ───────────────────────────────────────────

/**
 * ParkVehicle — Finds and allocates the best matching available slot.
 * @param {Array} slots      - All parking slots
 * @param {boolean} needsEV  - Vehicle needs EV charging
 * @param {boolean} needsCover - Vehicle needs covered spot
 * @returns {{ slot: Object|null, message: string }}
 */
export function ParkVehicle(slots, needsEV, needsCover) {
  // Step 1: Filter only available (unoccupied) slots
  const available = slots.filter((s) => !s.isOccupied)

  if (available.length === 0) {
    return { slot: null, message: 'Parking lot is completely full.' }
  }

  // Step 2: Apply user preference filters
  const matching = available.filter((s) => {
    const evOk = needsEV ? s.isEVCharging : true
    const coverOk = needsCover ? s.isCovered : true
    return evOk && coverOk
  })

  if (matching.length === 0) {
    const reason = []
    if (needsEV) reason.push('EV charging')
    if (needsCover) reason.push('covered spot')
    return {
      slot: null,
      message: `No available slot with ${reason.join(' & ')} found.`,
    }
  }

  // Step 3: Pick the nearest slot (first in sorted order)
  const allocated = matching[0]
  return { slot: allocated, message: `Slot ${allocated.slotNo} allocated successfully!` }
}

/**
 * Sorts slots by slotNo — numeric first, then alphanumeric
 */
export function sortSlots(slots) {
  return [...slots].sort((a, b) => {
    const numA = parseInt(a.slotNo)
    const numB = parseInt(b.slotNo)
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB
    return a.slotNo.localeCompare(b.slotNo)
  })
}

/**
 * Get parking lot statistics
 */
export function getParkingStats(slots) {
  const total = slots.length
  const occupied = slots.filter((s) => s.isOccupied).length
  const available = total - occupied
  const evSlots = slots.filter((s) => s.isEVCharging).length
  const coveredSlots = slots.filter((s) => s.isCovered).length
  const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0

  return { total, occupied, available, evSlots, coveredSlots, occupancyRate }
}

/**
 * Validate slot number uniqueness
 */
export function isSlotNumberTaken(slots, slotNo) {
  return slots.some((s) => s.slotNo.toLowerCase() === slotNo.toLowerCase())
}