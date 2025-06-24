'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { parseAbi, isAddress } from 'viem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const abi = parseAbi([
  'function whitelistVoters(uint256 electionId, address[] voters) external',
  'function getAllElections() view returns (uint256[] ids, string[] titles, bool[] isLive)'
])

export default function WhitelistVotersPage() {
  const router = useRouter()
  const { isConnected } = useAccount()
  const { writeContract, isPending } = useWriteContract()
  const [electionId, setElectionId] = useState('')
  const [addresses, setAddresses] = useState([''])

  const {
    data: electionData,
    isLoading,
    isError
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'getAllElections'
  })

  const handleAddressChange = (index, value) => {
    const updated = [...addresses]
    updated[index] = value
    setAddresses(updated)
  }

  const addAddressField = () => {
    setAddresses([...addresses, ''])
  }

  const removeAddressField = (index) => {
    const updated = [...addresses]
    updated.splice(index, 1)
    setAddresses(updated)
  }

  const handleWhitelist = async () => {
    const id = Number(electionId)
    if (isNaN(id) || addresses.some(addr => !isAddress(addr))) {
      toast.error('Enter valid election ID and valid Ethereum addresses.')
      return
    }

    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'whitelistVoters',
        args: [BigInt(id), addresses]
      })
      toast.success('Voters whitelisted successfully!')
      router.push('/admin')
    } catch (err) {
      console.error(err)
      toast.error('Failed to whitelist voters.')
    }
  }

  // Format last 5 elections
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

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardContent className="space-y-5">
          <h2 className="text-2xl font-bold">Whitelist Voters</h2>

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
                <option value="">-- Select from last 5 elections --</option>
                {formattedElections.map((e) => (
                  <option key={e.id} value={e.id}>
                   {e.title}  (ID: {e.id})
                  </option>
                ))}
              </select>
            )}
          </div>

          {addresses.map((addr, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <Input
                value={addr}
                onChange={(e) => handleAddressChange(idx, e.target.value)}
                placeholder={`Voter Address ${idx + 1}`}
              />
              {addresses.length > 1 && (
                <Button
                  onClick={() => removeAddressField(idx)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  X
                </Button>
              )}
            </div>
          ))}

          <Button
            onClick={addAddressField}
            className="w-full bg-green-700 hover:bg-green-800"
          >
            + Add Address
          </Button>

          <Button
            onClick={handleWhitelist}
            disabled={!isConnected || isPending}
            className="mt-4 w-full"
          >
            {isPending ? 'Whitelisting...' : 'Whitelist Voters'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
