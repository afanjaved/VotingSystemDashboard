'use client'

import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0']

// Dummy data simulation (replace with blockchain contract calls)
const elections = [
  { id: 4, title: 'Student Council 2025', candidates: [{ name: 'Ali', votes: 10 }, { name: 'Sara', votes: 20 }] },
  { id: 3, title: 'Tech Expo 2024', candidates: [{ name: 'Node', votes: 12 }, { name: 'React', votes: 18 }] },
  { id: 2, title: 'City Election', candidates: [{ name: 'A', votes: 30 }, { name: 'B', votes: 10 }] },
  { id: 1, title: 'Test Election 1', candidates: [{ name: 'X', votes: 7 }, { name: 'Y', votes: 13 }] },
  { id: 0, title: 'Test Election 0', candidates: [{ name: 'One', votes: 5 }, { name: 'Two', votes: 15 }] }
]

export default function Page() {
  const [selectedElection, setSelectedElection] = useState(elections[0])

  const handleSelect  = (e) => {
    const selectedId = parseInt(e.target.value)
    const election = elections.find(el => el.id === selectedId)
    if (election) setSelectedElection(election)
  }

  return (
    <div className="p-10 text-green-900 bg-green-50 min-h-screen space-y-8">
      <h1 className="text-4xl font-bold text-center text-green-700">
        🌿 Welcome to Votify Dashboard 🌿
      </h1>

      {/* Election Selector */}
      <div className="max-w-md mx-auto">
        <label className="block mb-2 text-lg font-semibold">Select an Election:</label>
        <select
          onChange={handleSelect}
          className="w-full p-2 border rounded shadow-sm"
        >
          {elections.map(e => (
            <option key={e.id} value={e.id}>
              {e.title} (ID: {e.id})
            </option>
          ))}
        </select>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-center">📊 Votes per Candidate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={selectedElection.candidates}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="votes" fill="#2E8B57" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-center">🥧 Vote Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={selectedElection.candidates}
                dataKey="votes"
                nameKey="name"
                outerRadius={100}
                label
              >
                {selectedElection.candidates.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
