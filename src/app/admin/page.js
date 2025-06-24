'use client'

import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts'
import { useAccount } from 'wagmi'
import { readContract } from '@wagmi/core'
import { parseAbi } from 'viem'
import { config } from '@/app/config' // update path if needed

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A020F0']

const abi = parseAbi([
  'function getAllElections() view returns (uint256[] ids, string[] titles, bool[] isLive)',
  'function getCandidateCount(uint256 electionId) view returns (uint256)',
  'function getCandidate(uint256 electionId, uint256 candidateId) view returns (string name, uint256 voteCount)'
])

export default function Page() {
  const [elections, setElections] = useState([])
  const [selectedElection, setSelectedElection] = useState(null)
  const [candidates, setCandidates] = useState([])

  const fetchElections = async () => {
    try {
      const result = await readContract(config, {
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'getAllElections'
      })

      const ids = result[0]
      const titles = result[1]
      const lastFive = ids.slice(-5).map((id, index) => ({
        id: Number(id),
        title:`Election ${id}`
      }))

      setElections(lastFive)
      setSelectedElection(lastFive[lastFive.length - 1]) // default to latest
    } catch (err) {
      console.error('Error fetching elections:', err)
    }
  }

  const fetchCandidates = async (electionId) => {
    try {
      const count = await readContract(config, {
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'getCandidateCount',
        args: [BigInt(electionId)]
      })

      const candidateData = await Promise.all(
        Array.from({ length: Number(count) }).map((_, i) =>
          readContract(config, {
            address: CONTRACT_ADDRESS,
            abi,
            functionName: 'getCandidate',
            args: [BigInt(electionId), BigInt(i)]
          })
        )
      )

      const formatted = candidateData.map(([name, votes]) => ({
        name,
        votes: Number(votes)
      }))

      setCandidates(formatted)
    } catch (err) {
      console.error('Error fetching candidates:', err)
    }
  }

  useEffect(() => {
    fetchElections()
  }, [])

  useEffect(() => {
    if (selectedElection) {
      fetchCandidates(selectedElection.id)
    }
  }, [selectedElection])

  const handleSelect = (e) => {
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
            <BarChart data={candidates}>
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
                data={candidates}
                dataKey="votes"
                nameKey="name"
                outerRadius={100}
                label
              >
                {candidates.map((_, index) => (
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
