'use client'

import { useState } from 'react'
import { useReadContract } from 'wagmi'
import { parseAbi } from 'viem'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const abi = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "electionId", "type": "uint256" }
    ],
    "name": "getAllCandidates",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "uint256", "name": "voteCount", "type": "uint256" }
        ],
        "internalType": "struct VotingSystem.Candidate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "electionId", "type": "uint256" }],
    "name": "isVotingOngoing",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "electionId", "type": "uint256" }],
    "name": "doesElectionExist",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
]


export default function ElectionResultsPage() {
  const [electionId, setElectionId] = useState('')
  const [trigger, setTrigger] = useState(false)

  const {
    data: exists,
    isLoading: checkingExist,
    isError: existError,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'doesElectionExist',
    args: [electionId ? BigInt(electionId) : 0n],
    query: {
      enabled: !!electionId && trigger,
    },
  })

  const {
    data: candidates,
    isLoading: loadingCandidates,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'getAllCandidates',
    args: [electionId ? BigInt(electionId) : 0n],
    query: {
      enabled: !!electionId && exists,
    },
  })

  const {
    data: isLive,
    isLoading: loadingStatus,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'isVotingOngoing',
    args: [electionId ? BigInt(electionId) : 0n],
    query: {
      enabled: !!electionId && exists,
    },
  })

  const handleSearch = () => {
    if (!electionId.trim()) {
      alert('Enter a valid election ID')
      return
    }
    setTrigger(true)
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardContent className="space-y-6">
          <h2 className="text-2xl font-bold">View Election Results</h2>

          <div>
            <Label>Election ID</Label>
            <Input
              type="number"
              value={electionId}
              onChange={(e) => setElectionId(e.target.value)}
              placeholder="Enter Election ID"
            />
          </div>

          <Button onClick={handleSearch}>Fetch Results</Button>

          {checkingExist && <p>Checking election existence...</p>}
          {existError && <p>Error checking election.</p>}
          {trigger && !exists && !checkingExist && <p>No such election found.</p>}

          {exists && (
            <div className="space-y-3 mt-6">
              {loadingStatus ? (
                <p>Checking if voting is live...</p>
              ) : (
                <p className={`font-semibold ${isLive ? 'text-green-600' : 'text-gray-700'}`}>
                  Voting Status: {isLive ? 'Live (Ongoing)' : 'Closed'}
                </p>
              )}

              {loadingCandidates ? (
                <p>Loading candidates and votes...</p>
              ) : (
                <ul className="space-y-2">
                  {candidates?.map((c, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between border-b py-2"
                    >
                      <span>{c.name}</span>
                      <span className="font-bold">{c.voteCount.toString()} votes</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
