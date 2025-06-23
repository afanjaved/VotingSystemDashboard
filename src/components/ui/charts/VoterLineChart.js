'use client'

import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

export default function VoterLineChart({ whitelisted, voted }) {
  const data = {
    labels: ['Whitelisted', 'Voted'],
    datasets: [
      {
        label: 'Voter Stats',
        data: [whitelisted, voted],
        fill: false,
        borderColor: '#0B8457',
        tension: 0.3
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Voter Participation</h3>
      <Line data={data} options={options} />
    </div>
  )
}
