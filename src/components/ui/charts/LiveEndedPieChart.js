'use client'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function LiveEndedPieChart({ live, ended }) {
  const data = {
    labels: ['Live', 'Ended'],
    datasets: [
      {
        data: [live, ended],
        backgroundColor: ['#00c853', '#d50000'],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-3">Election Status</h2>
      <Pie data={data} />
    </div>
  )
}
