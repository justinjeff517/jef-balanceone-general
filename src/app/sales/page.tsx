"use client"
import { useMemo, useState } from "react"
import Link from "next/link"

const MONTH_NAMES = [
  "January", "February", "March",
  "April",   "May",      "June",
  "July",    "August",   "September",
  "October", "November", "December",
]

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

// months to display in YYYY-MM format
const months = ["2025-01", "2025-02", "2025-03"]
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function DatesPage() {
  const [selected, setSelected] = useState<string | null>(null)

  const data = useMemo(() => {
    return months.map((ym) => {
      const [year, month] = ym.split("-").map(Number)
      const title = `${MONTH_NAMES[month - 1]} ${year}`
      const days = Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1)
      return { ym, title, year, month, days }
    })
  }, [])

  return (
    <div className="w-screen h-screen p-4 overflow-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Calendar View</h1>

      {/* responsive grid: 1 col → 2 cols at md (half screen) → 3 cols at lg (full screen) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map(({ ym, title, year, month, days }) => (
          <section key={ym} className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>

            <div className="grid grid-cols-7 gap-1 mb-1 text-center text-xs font-medium text-gray-600">
              {WEEKDAYS.map((wd) => <div key={wd}>{wd}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const key = `${ym}-${day}`
                const isSelected = selected === key
                const href = `/dates/${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`

                return (
                  <Link
                    key={key}
                    href={href}
                    className={`flex flex-col justify-between items-start p-2 bg-white border border-gray-200 rounded-lg transition-transform ${
                      isSelected
                        ? 'bg-blue-500 text-white scale-110'
                        : 'hover:shadow hover:bg-gray-100'
                    }`}
                    onClick={() => setSelected(key)}
                  >
                    <span className="text-sm font-medium">{day}</span>
                    <span className="text-xs mt-auto">
                      {isSelected ? 'Selected' : '₱0.00'}
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
