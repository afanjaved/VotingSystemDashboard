'use client'

import { useState } from 'react'
import { useReadContract } from 'wagmi'
import { parseAbi } from 'viem'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const abi = parseAbi([
  'function getAllElections() view returns (uint256[] ids, string[] titles, bool[] isLive)'
])

const ITEMS_PER_PAGE = 10

export default function ElectionsListPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'getAllElections'
  })

  const elections = (() => {
    if (!data || data.length < 3) return []
    const [ids, titles, isLive] = data
    return ids.map((id, i) => ({
      id: id.toString(),
      title: titles[i],
      live: isLive[i]
    }))
  })()

  const totalPages = Math.ceil(elections.length / ITEMS_PER_PAGE)

  const paginated = elections.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-4 text-center">All Elections</h2>

      {isLoading && <p className="text-center">Loading elections...</p>}
      {isError && <p className="text-center text-red-500">Failed to load elections.</p>}

      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {paginated.map((election, idx) => (
          <Card key={election.id}>
            <CardContent className="py-4">
              <h3 className="text-lg font-semibold">
                {election.title} (ID: {election.id})
              </h3>
              <p className="text-sm text-gray-600">
                Status: {election.live ? 'Live 🔥' : 'Ended 🧊'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <Button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
          Previous
        </Button>
        <p className="text-sm text-gray-700">
          Page {page} of {totalPages}
        </p>
        <Button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
          Next
        </Button>
      </div>
    </div>
  )
}
