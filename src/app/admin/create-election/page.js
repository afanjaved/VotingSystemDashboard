'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount, useWriteContract } from 'wagmi'
import { parseAbi } from 'viem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

// ✅ Updated contract address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

// ✅ Updated ABI with title added
const abi = parseAbi([
  'function createElection(string memory title, string[] memory candidateNames, uint256 _startTime, uint256 _endTime) external returns (uint256)'
])

export default function CreateElectionPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { writeContract, isPending } = useWriteContract()

  const [title, setTitle] = useState('')
  const [candidates, setCandidates] = useState([''])
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const handleCandidateChange = (index, value) => {
    const updated = [...candidates]
    updated[index] = value
    setCandidates(updated)
  }

  const addCandidateField = () => {
    setCandidates([...candidates, ''])
  }

  const removeCandidate = (index) => {
    const updated = [...candidates]
    updated.splice(index, 1)
    setCandidates(updated)
  }

  const handleCreateElection = async () => {
    if (!title || !startTime || !endTime || candidates.length === 0 || candidates.some(c => c.trim() === '')) {
      toast.error('Please fill all fields, including title and candidate names.')
      return
    }

    const start = Math.floor(new Date(startTime).getTime() / 1000)
    const end = Math.floor(new Date(endTime).getTime() / 1000)

    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'createElection',
        args: [title, candidates, BigInt(start), BigInt(end)],
      })
      toast.success('Election created successfully!')
      router.push('/admin')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Transaction failed')
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardContent>
          <h2 className="text-2xl font-bold mb-6">Create New Election</h2>

          <div className="space-y-5">
            {/* Title Field */}
            <div>
              <Label htmlFor="election-title">Election Title</Label>
              <Input
                id="election-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Community Leadership Vote"
              />
            </div>

            {/* Candidate Fields */}
            {candidates.map((name, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={name}
                  onChange={(e) => handleCandidateChange(index, e.target.value)}
                  placeholder={`Candidate ${index + 1}`}
                />
                {candidates.length > 1 && (
                  <Button onClick={() => removeCandidate(index)} className="bg-red-500 hover:bg-red-600">X</Button>
                )}
              </div>
            ))}
            <Button onClick={addCandidateField} className="w-full bg-green-700 hover:bg-green-800">
              + Add Candidate
            </Button>

            {/* Start and End */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Start Date & Time</Label>
                <Input
                  type="datetime-local"
                  id="start-time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end-time">End Date & Time</Label>
                <Input
                  type="datetime-local"
                  id="end-time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              onClick={handleCreateElection}
              disabled={!isConnected || isPending}
              className="mt-6 w-full"
            >
              {isPending ? 'Creating...' : 'Create Election'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
