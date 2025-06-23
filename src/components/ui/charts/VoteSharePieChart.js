'use client'

import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function VoteSharePieChart({ titles, votes }) {
  const data = {
    labels: titles,
    datasets: [
      {
        label: 'Vote Share',
        data: votes,
        backgroundColor: ['#0B8457', '#1abc9c', '#3498db', '#f39c12', '#e74c3c']
      }
    ]
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Vote Share Pie</h3>
      <Pie data={data} />
    </div>
  )
}
