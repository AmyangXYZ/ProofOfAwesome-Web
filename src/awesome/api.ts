import { Socket as SocketIO } from "socket.io-client"

export interface UserInfo {
  publicKey: string
  name: string
}

export interface ChainInfo {
  uuid: string
  name: string
  logoUrl: string
  description: string
  rule: string
  visibility: "public" | "private"
}

export interface ChainHead {
  chainUuid: string
  latestBlock: Block
  timestamp: number
}

export interface ChainStats {
  chainUuid: string
  capital: number
  numberOfUsers: number
  numberOfBlocks: number
  numberOfTransactions: number
}

export interface ChainBrief {
  info: ChainInfo
  stats: ChainStats
}

export interface ChainDetail {
  info: ChainInfo
  stats: ChainStats
  recentBlocks: Block[]
  pendingTransactions: Transaction[]
}

export interface Membership {
  userPublicKey: string
  chainUuid: string
  balance: number
  address: string
}

export interface Block {
  chainUuid: string
  height: number
  previousHash: string
  transactionSignatures: string[] // transaction signatures
  merkleRoot: string
  achievementSignature: string // achievement signature
  timestamp: number
  hash: string
}

export interface Transaction {
  chainUuid: string
  senderAddress: string
  recipientAddress: string
  amount: number
  timestamp: number
  signature: string
}

export interface Achievement {
  chainUuid: string
  userAddress: string
  description: string
  evidenceImage: string
  timestamp: number
  signature: string
}

export interface AchievementVerificationResult {
  achievementSignature: string
  pass: boolean
  message: string
  reward: number
}

interface ServerEvents {
  register: (user: UserInfo) => void
  "sign in": (user: UserInfo) => void
  "get public chains": () => void
  "join chain": (chainUuid: string) => void
  "get chain detail": (chainUuid: string) => void
  "new chain": (chainInfo: ChainInfo) => void
  "new achievement": (achievement: Achievement) => void
  "new block": (block: Block) => void
  "new transaction": (transaction: Transaction) => void
}

interface ClientEvents {
  error: (message: string) => void
  "register success": () => void
  "sign in success": ({ memberships, chainBriefs }: { memberships: Membership[]; chainBriefs: ChainBrief[] }) => void
  "sign in error": (message: string) => void
  "public chains": (chains: ChainBrief[]) => void
  "chain detail": (chainDetail: ChainDetail) => void
  "join chain success": (chainDetail: ChainDetail) => void
  "join chain error": (message: string) => void
  "new chain created": () => void
  "achievement verification result": (result: AchievementVerificationResult) => void
  "membership update": (membership: Membership) => void
  "new block created": (block: Block) => void
}

export type Socket = SocketIO<ClientEvents, ServerEvents>
