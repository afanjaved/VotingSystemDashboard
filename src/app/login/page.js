'use client';

import { useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useAccount } from 'wagmi';
import { useDisconnect } from 'wagmi';
import { useRouter } from 'next/navigation';

const ADMIN_WALLET = '0x705f8186D6514CC037DD08a0Bd16B4a74567f43C'.toLowerCase();

export default function LoginPage() {
  const router = useRouter();

  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();

  const goToAdmin = () => {
    if (address?.toLowerCase() === ADMIN_WALLET) {
      router.push('/admin');
    } else {
      alert('You are not authorized as admin!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-bl from-green-600 via-green-700 to-green-800 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Login with MetaMask</h1>

      {!isConnected ? (
        <button
          onClick={() => connect({ connector: injected() })}
          className="bg-white text-green-700 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-green-100 transition"
        >
          Connect MetaMask
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm">
            Connected as: <span className="font-mono">{address}</span>
          </p>
          <button
            onClick={goToAdmin}
            className="bg-white text-green-700 font-semibold px-6 py-2 rounded-full shadow hover:bg-green-100 transition"
          >
            Go to Admin Dashboard
          </button>
          <button
            onClick={() => disconnect()}
            className="text-sm text-green-200 underline"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
