'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAccount, useDisconnect } from 'wagmi'
import Image from 'next/image'

const ADMIN_WALLET = '0x705f8186D6514CC037DD08a0Bd16B4a74567f43C'.toLowerCase()

export default function AdminLayout({ children }) {
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()

  useEffect(() => {
    const notAdmin = !isConnected || address?.toLowerCase() !== ADMIN_WALLET
    if (notAdmin) {
      router.replace('/login')
    }
  }, [isConnected, address, router])

  const stillLoading = !isConnected && !address
  const notAuthorised = address && address.toLowerCase() !== ADMIN_WALLET
  if (stillLoading || notAuthorised) return null

  return (
    <div className="flex min-h-screen bg-green-50 text-green-900">
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 text-white p-6 flex flex-col justify-between">
        <div>
          <Link href="/admin" className="flex items-center justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Votify Logo"
              width={160}
              height={60}
              className="object-contain cursor-pointer"
              priority
            />
          </Link>

          <nav className="space-y-3">
            <NavLink href="/admin/create-election">🗳️ Create&nbsp;Election</NavLink>
            <NavLink href="/admin/whitelist">✅ Whitelist&nbsp;Voters</NavLink>
            <NavLink href="/admin/add-candidate">➕ Add&nbsp;Candidate</NavLink>
            <NavLink href="/admin/results">📊 View&nbsp;Results</NavLink>
            <NavLink href="/admin/voters">🔎 Voter&nbsp;Checker</NavLink>
            <NavLink href="/admin/elections">📊 List&nbsp;Elections</NavLink>
          </nav>
        </div>

        <button
          onClick={() => {
            disconnect()
            router.replace('/login') // optional: redirect after disconnect
          }}
          className="w-full mt-6 bg-white text-green-700 font-semibold py-2 px-4 rounded hover:bg-green-100 transition"
        >
          🔌 Disconnect
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  )
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="block transition hover:underline focus:outline-none focus:ring-2 focus:ring-white/70"
    >
      {children}
    </Link>
  )
}
