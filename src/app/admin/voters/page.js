'use client'

import { useState } from 'react'
import { isAddress } from 'viem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useReadContract } from 'wagmi'
import { readContract } from '@wagmi/core'
import toast from 'react-hot-toast'

import { parseAbi } from 'viem'

const abi = parseAbi([
  'function isWhitelisted(uint256 electionId, address user) view returns (bool)',
  'function hasUserVoted(uint256 electionId, address user) view returns (bool)',
  'function getAllElections() view returns (uint256[] ids, string[] titles, bool[] isLive)'
])

import { config } from '../../config'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function VoterWhitelistCheckPage() {
  const [voterAddress, setVoterAddress] = useState('')
  const [electionId, setElectionId] = useState('')
  const [whitelisted, setWhitelisted] = useState(false)
  const [voted, setVoted] = useState(false)
  const [loading, setLoading] = useState(false)

  const { data: electionData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'getAllElections'
  })

  const formattedElections = (() => {
    if (!electionData || electionData.length < 2) return []
    const ids = electionData[0]
    return ids.map((id) => ({
      id: id.toString(),
      title: `Election ${id}`
    }))
  })()

  const checkStatus = async () => {
    if (!electionId || !isAddress(voterAddress)) {
      toast.error('Enter valid election ID and address.')
      return
    }

    setLoading(true)
    try {
      const eid = BigInt(electionId)
      const addr = voterAddress.trim().toLowerCase();

      const [isWL, hasVoted] = await Promise.all([
        readContract(config, {
          abi,
          address: CONTRACT_ADDRESS,
          functionName: 'isWhitelisted',
          args: [eid, addr],
        }),
        readContract(config, {
          abi,
          address: CONTRACT_ADDRESS,
          functionName: 'hasUserVoted',
          args: [eid, addr],
        }),
      ])

      setWhitelisted(isWL)
      setVoted(hasVoted)
    } catch (err) {
      console.error(err)
      toast.error('Error fetching voter status.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardContent className="space-y-6">
          <h2 className="text-2xl font-bold">Voter Status Checker</h2>

          <div>
            <Label>Select Election</Label>
            <select
              value={electionId}
              onChange={(e) => setElectionId(e.target.value)}
              className="w-full px-3 py-2 border rounded"
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

          <Button onClick={checkStatus} disabled={loading} className="w-full">
            {loading ? 'Checking...' : 'Check Status'}
          </Button>

          {(voterAddress && electionId) && (
            <div className="mt-4 p-4 rounded bg-gray-100 text-black space-y-1">
              <p><strong>Whitelisted:</strong> {whitelisted ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Has Voted:</strong> {voted ? '🟢 Voted' : '🔴 Not Voted'}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
