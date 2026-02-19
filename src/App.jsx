import React, { useState } from 'react'
import { useParking } from './hooks/useParking'
import Header from './components/Header'
import TabNav from './components/TabNav'
import AddSlotForm from './components/AddSlotForm'
import SlotGrid from './components/SlotGrid'
import ParkVehiclePanel from './components/ParkVehiclePanel'
import DataModelTable from './components/DataModelTable'
import SlotDetailModal from './components/SlotDetailModal'

export default function App() {
  const {
    slots,
    lastResult,
    activeTab,
    setActiveTab,
    addSlot,
    parkVehicle,
    removeVehicle,
    deleteSlot,
    updateSlot,
    clearResult,
  } = useParking()

  // Modal state — stores the slot id being viewed
  const [selectedSlotId, setSelectedSlotId] = useState(null)

  // Always get the latest slot data from state (so modal reflects live changes)
  const modalSlot = selectedSlotId
    ? slots.find((s) => s.id === selectedSlotId) ?? null
    : null

  const openModal = (slot) => setSelectedSlotId(slot.id)
  const closeModal = () => setSelectedSlotId(null)

  return (
    <div className="min-h-screen bg-parking-bg grid-bg noise-bg relative">
      {/* Background glow orbs */}
      <div
        className="fixed top-0 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6ee7f7, transparent)' }}
      />
      <div
        className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }}
      />

      {/* Max width container */}
      <div className="max-w-2xl mx-auto pb-12 relative z-10">
        {/* Header with live stats */}
        <Header slots={slots} />

        {/* Tab navigation — 4 tabs */}
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab content — key forces remount = restarts animations */}
        <div key={activeTab}>
          {activeTab === 'slots' && (
            <SlotGrid
              slots={slots}
              onRemove={removeVehicle}
              onDelete={deleteSlot}
              onViewSlot={openModal}
            />
          )}

          {activeTab === 'data' && (
            <DataModelTable
              slots={slots}
              onViewSlot={openModal}
            />
          )}

          {activeTab === 'add' && (
            <AddSlotForm addSlot={addSlot} />
          )}

          {activeTab === 'park' && (
            <ParkVehiclePanel
              slots={slots}
              parkVehicle={parkVehicle}
              removeVehicle={removeVehicle}
              lastResult={lastResult}
              clearResult={clearResult}
              onViewSlot={openModal}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-10 px-6">
          <p className="text-parking-muted text-xs font-mono">
            SmartPark v1.0 &mdash; Round 2 Assignment
          </p>
          <p className="text-parking-border text-xs font-mono mt-0.5">
            Data Model: slotNo | isCovered | isEVCharging | isOccupied
          </p>
        </footer>
      </div>

      {/* Slot Detail Modal — portal-style at root so overlay works correctly */}
      {modalSlot && (
        <SlotDetailModal
          slot={modalSlot}
          onClose={closeModal}
          onUpdate={updateSlot}
          onRemove={(id) => { removeVehicle(id); closeModal() }}
          onDelete={(id) => { deleteSlot(id); closeModal() }}
        />
      )}
    </div>
  )
}