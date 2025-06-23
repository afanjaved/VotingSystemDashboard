export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
export const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string[]", "name": "candidateNames", "type": "string[]" },
      { "internalType": "uint256", "name": "_startTime", "type": "uint256" },
      { "internalType": "uint256", "name": "_endTime", "type": "uint256" }
    ],
    "name": "createElection",
    "outputs": [{ "internalType": "uint256", "name": "electionId", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "electionId", "type": "uint256" },
      { "internalType": "address[]", "name": "voters", "type": "address[]" }
    ],
    "name": "whitelistVoters",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "electionId", "type": "uint256" },
      { "internalType": "uint256", "name": "candidateId", "type": "uint256" }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "electionId", "type": "uint256" },
      { "internalType": "string", "name": "name", "type": "string" }
    ],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "electionId", "type": "uint256" }],
    "name": "getCandidateCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "electionId", "type": "uint256" }],
    "name": "doesElectionExist",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "electionId", "type": "uint256" },
      { "internalType": "uint256", "name": "candidateId", "type": "uint256" }
    ],
    "name": "getCandidate",
    "outputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "uint256", "name": "voteCount", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "electionId", "type": "uint256" }],
    "name": "getElectionDetails",
    "outputs": [
      { "internalType": "address", "name": "admin", "type": "address" },
      { "internalType": "uint256", "name": "startTime", "type": "uint256" },
      { "internalType": "uint256", "name": "endTime", "type": "uint256" },
      { "internalType": "bool", "name": "votingLive", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
