import React from 'react'
import { getParkingStats } from '../utils/parkingLogic'

export default function Header({ slots }) {
  const stats = getParkingStats(slots)

  return (
    <header className="relative z-10 px-6 pt-8 pb-6">
      {/* Brand */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-parking-accent flex items-center justify-center glow-accent">
              <span className="text-parking-bg font-display font-black text-lg">P</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-parking-green animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl tracking-tight text-gradient">
              SmartPark
            </h1>
            <p className="text-parking-muted text-xs font-body tracking-widest uppercase">
              Intelligent Parking System
            </p>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-parking-card border border-parking-border">
          <span className="w-2 h-2 rounded-full bg-parking-green animate-pulse" />
          <span className="text-xs text-parking-muted font-mono">LIVE</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Total Slots"
          value={stats.total}
          icon="🅿️"
          color="text-parking-accent"
          delay="stagger-1"
        />
        <StatCard
          label="Available"
          value={stats.available}
          icon="✅"
          color="text-parking-green"
          delay="stagger-2"
        />
        <StatCard
          label="Occupied"
          value={stats.occupied}
          icon="🚗"
          color="text-parking-red"
          delay="stagger-3"
        />
        <StatCard
          label="Occupancy"
          value={`${stats.occupancyRate}%`}
          icon="📊"
          color="text-parking-amber"
          delay="stagger-4"
        />
      </div>

      {/* Occupancy bar */}
      {stats.total > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-parking-muted mb-1.5">
            <span className="font-mono">Lot Capacity</span>
            <span className="font-mono">{stats.occupied}/{stats.total} slots used</span>
          </div>
          <div className="h-2 bg-parking-card rounded-full overflow-hidden border border-parking-border">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${stats.occupancyRate}%`,
                background:
                  stats.occupancyRate > 80
                    ? 'linear-gradient(90deg, #f87171, #fbbf24)'
                    : stats.occupancyRate > 50
                    ? 'linear-gradient(90deg, #6ee7f7, #fbbf24)'
                    : 'linear-gradient(90deg, #6ee7f7, #4ade80)',
              }}
            />
          </div>
        </div>
      )}
    </header>
  )
}

function StatCard({ label, value, icon, color, delay }) {
  return (
    <div className={`glass border border-parking-border rounded-2xl p-4 animate-fade-up opacity-0 ${delay}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-parking-muted uppercase tracking-wider font-mono">{label}</span>
        <span className="text-base">{icon}</span>
      </div>
      <div className={`font-display font-bold text-2xl ${color}`}>{value}</div>
    </div>
  )
}