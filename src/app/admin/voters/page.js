'use client'

import { useState } from 'react'
import { useReadContract } from 'wagmi'
import {
  parseAbi,
  isAddress,
  encodeFunctionData,
  decodeFunctionResult
} from 'viem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const abi = parseAbi([
  'function isWhitelisted(uint256 electionId, address user) view returns (bool)',
  'function hasUserVoted(uint256 electionId, address user) view returns (bool)',
  'function getAllElections() view returns (uint256[] ids, string[] titles, bool[] isLive)'
])

export default function VoterWhitelistCheckPage() {
  const [voterAddress, setVoterAddress] = useState('')
  const [electionId, setElectionId] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const { data: electionData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'getAllElections'
  })

  const checkStatus = async () => {
    if (!electionId || !isAddress(voterAddress)) {
      alert('Enter valid election ID and wallet address.')
      return
    }

    if (!window.ethereum) {
      alert('MetaMask is not detected.')
      return
    }

    setLoading(true)
    setStatus(null)

    const eid = BigInt(electionId)
    const user = voterAddress.trim().toLowerCase() // ✅ fix: normalize address

    try {
      const [whitelistResult, votedResult] = await Promise.all([
        window.ethereum.request({
          method: 'eth_call',
          params: [{
            to: CONTRACT_ADDRESS,
            data: encodeFunctionData({
              abi,
              functionName: 'isWhitelisted',
              args: [eid, user]
            })
          }, 'latest']
        }),
        window.ethereum.request({
          method: 'eth_call',
          params: [{
            to: CONTRACT_ADDRESS,
            data: encodeFunctionData({
              abi,
              functionName: 'hasUserVoted',
              args: [eid, user]
            })
          }, 'latest']
        })
      ])

      const whitelisted = decodeFunctionResult({
        abi,
        functionName: 'isWhitelisted',
        data: whitelistResult
      })[0]

      const voted = decodeFunctionResult({
        abi,
        functionName: 'hasUserVoted',
        data: votedResult
      })[0]

      setStatus({ whitelisted, voted })
    } catch (err) {
      console.error('Error checking status:', err)
      alert('Something went wrong while checking status.')
    } finally {
      setLoading(false)
    }
  }

  const formattedElections = (() => {
    if (!electionData || electionData.length < 2) return []
    const ids = electionData[0]
    const titles = electionData[1]
    return ids.slice(-5).map((id, idx) => ({
      id: id.toString(),
      title:`Election ${id}`
    }))
  })()

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardContent className="space-y-5">
          <h2 className="text-2xl font-bold">Voter Status Checker</h2>

          <div>
            <Label>Select Election</Label>
            <select
              value={electionId}
              onChange={(e) => setElectionId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">-- Select Election --</option>
              {formattedElections.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title} (ID: {e.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Voter Address</Label>
            <Input
              value={voterAddress}
              onChange={(e) => setVoterAddress(e.target.value)}
              placeholder="0x..."
            />
          </div>

          <Button onClick={checkStatus} className="w-full" disabled={loading}>
            {loading ? 'Checking voter status...' : 'Check baw Status'}
          </Button>

          {status && (
            <div className="mt-6 bg-gray-100 p-4 rounded text-black space-y-2">
              <p><strong>Whitelisted:</strong> {status.whitelisted ? 'Yes ✅' : 'No ❌'}</p>
              <p><strong>Has Voted:</strong> {status.voted ? 'Yes 🗳️' : 'No 😴'}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
