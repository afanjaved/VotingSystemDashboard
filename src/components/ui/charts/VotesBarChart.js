'use client'

import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function VotesBarChart({ titles, votes }) {
  const data = {
    labels: titles,
    datasets: [
      {
        label: 'Votes',
        data: votes,
        backgroundColor: '#0B8457'
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
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
      <h3 className="text-lg font-semibold mb-2">Votes per Candidate</h3>
      <Bar data={data} options={options} />
    </div>
  )
}
