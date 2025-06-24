'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { parseAbi } from 'viem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const abi = parseAbi([
  'function addCandidate(uint256 electionId, string name) external',
  'function getAllElections() view returns (uint256[] ids, string[] titles, bool[] isLive)'
])

export default function AddCandidatePage() {
  const router = useRouter()
  const { isConnected } = useAccount()
  const { writeContract, isPending } = useWriteContract()
  const [electionId, setElectionId] = useState('')
  const [candidateName, setCandidateName] = useState('')

  const {
    data: electionData,
    isLoading,
    isError
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'getAllElections'
  })
   console.log(electionData);
  const formattedElections = (() => {
    if (!electionData || electionData.length < 2) return []
    const ids = electionData[0]
    const titles = electionData[1]
    const last5 = ids.slice(-5).map((id, index) => ({
      id,
      title: `Election ${id}`
    }))
    return last5
  })()

  const handleAddCandidate = async () => {
    if (!electionId || !candidateName.trim()) {
      toast.error('Enter valid election ID and candidate name.')
      return
    }

    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'addCandidate',
        args: [BigInt(electionId), candidateName]
      })
      toast.success('Candidate added successfully!')
      router.push('/admin')
    } catch (err) {
      console.error(err)
      toast.error('Failed to add candidate.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardContent className="space-y-5">
          <h2 className="text-2xl font-bold">Add Candidate</h2>

          <div>
            <Label>Select Election</Label>
            {isLoading ? (
              <p>Loading elections...</p>
            ) : isError ? (
              <p>Error loading elections.</p>
            ) : (
              <select
                value={electionId}
                onChange={(e) => setElectionId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Select Election --</option>
                {formattedElections.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title} (ID: {e.id})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <Label>Candidate Name</Label>
            <Input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="Enter Candidate Name"
            />
          </div>

          <Button
            onClick={handleAddCandidate}
            disabled={!isConnected || isPending}
            className="mt-4 w-full"
          >
            {isPending ? 'Adding...' : 'Add Candidate'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
