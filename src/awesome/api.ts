import { Socket as SocketIO } from "socket.io-client"

export interface UserInfo {
  publicKey: string
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
  latestBlockHash: string
  latestBlockHeight: number
  timestamp: number
}

export interface ChainStats {
  chainUuid: string
  capitalization: number
  numberOfUsers: number
  numberOfBlocks: number
  numberOfTransactions: number
}

export interface ChainBrief {
  info: ChainInfo
  stats: ChainStats
}

export interface Membership {
  userPublicKey: string
  chainUuid: string
  address: string
  balance: number
}

export interface Block {
  chainUuid: string
  height: number
  previousHash: string
  transactions: string[] // transaction signatures
  merkleRoot: string
  achievement: string // achievement hash
  timestamp: number
  hash: string
}

export interface Transaction {
  chainUuid: string
  senderPublicKey: string
  senderAddress: string
  recipientAddress: string
  amount: number
  timestamp: number
  signature: string
}

export interface Achievement {
  chainUuid: string
  userDisplayName: string
  userAddress: string
  description: string
  evidenceImage: string
  timestamp: number
  hash: string
}

export interface AchievementVerificationResult {
  achievementHash: string
  message: string
  reward: number
}

export interface ServerEvents {
  register: (user: UserInfo) => void
  "sign in": (user: UserInfo) => void
  "get public chains": () => void
  "join chain": (chainUuid: string, address: string) => void
  "get chain head": (chainUuid: string) => void
  "get blocks": (chainUuid: string, fromHeight: number, toHeight: number) => void
  "new chain": (chainInfo: ChainInfo) => void
  "new achievement": (achievement: Achievement) => void
  "new block": (block: Block) => void
  "new transaction": (transaction: Transaction) => void
}

export interface ClientEvents {
  error: (message: string) => void
  "register success": () => void
  "sign in success": ({ memberships, chainBriefs }: { memberships: Membership[]; chainBriefs: ChainBrief[] }) => void
  "sign in error": (message: string) => void
  "public chains": (chains: ChainBrief[]) => void
  "join chain success": (chainBrief: ChainBrief, membership: Membership) => void
  "join chain error": (message: string) => void
  "new chain created": () => void
  "achievement verification result": (result: AchievementVerificationResult) => void
  "membership update": (membership: Membership) => void
  "new block created": (block: Block) => void
  "chain head": (chainHead: ChainHead) => void
  blocks: (blocks: Block[]) => void
}

export type Socket = SocketIO<ClientEvents, ServerEvents>
