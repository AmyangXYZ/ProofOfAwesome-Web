import { Socket as SocketIO } from "socket.io-client"

export interface ChainInfo {
  uuid: string
  name: string
  logoUrl: string
  description: string
  rule: string
}

export interface ChainHead {
  chainUuid: string
  latestBlockHash: string
  latestBlockHeight: number
  timestamp: number
}

export interface ChainStats {
  chainUuid: string
  price: number
  volume: number
  marketCap: number
  numMembers: number
  numBlocks: number
}

export interface ChainBrief {
  info: ChainInfo
  head: ChainHead
  stats: ChainStats
}

export interface Membership {
  userPublicKey: string
  chainUuid: string
  address: string
  tokens: number
}

export interface Block {
  chainUuid: string
  height: number
  previousHash: string
  transactions: string[]
  merkleRoot: string
  achievement: string
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
  userPublicKey: string
  userAddress: string
  description: string
  evidenceImage: string
  timestamp: number
  signature: string
}

export interface Review {
  achievementSignature: string
  reviewerPublicKey: string
  reviewerAddress: string
  comment: string
  reward: number
  timestamp: number
  signature: string
}

export interface MarketOrder {
  orderType: "buy" | "sell"
  chainUuid: string
  userPublicKey: string
  status: "pending" | "filled" | "partially filled" | "cancelled"
  amount: number
  price: number
  timestamp: number
  signature: string
}

export interface ServerEvents {
  register: (publicKey: string) => void
  "sign in": (publicKey: string) => void
  "get chains": () => void
  "get membership": (publicKey: string, chainUuid: string) => void
  "get memberships": (publicKey: string) => void
  "get chain head": (chainUuid: string) => void
  "get chain brief": (chainUuid: string) => void
  "get blocks": (chainUuid: string, fromHeight: number, toHeight: number) => void
  "get block": (chainUuid: string, blockHeight: number) => void
  "get achievements": (chainUuid: string, fromBlockHeight: number, toBlockHeight: number) => void
  "get achievement": (chainUuid: string, achievementHash: string) => void
  "get transactions": (chainUuid: string, blockHeight: number) => void
  "get transaction": (chainUuid: string, transactionSignature: string) => void
  "join chain": (chainUuid: string, address: string) => void
  "new chain": (chainInfo: ChainInfo) => void
  "new achievement": (achievement: Achievement) => void
  "new block": (block: Block) => void
  "new transaction": (transaction: Transaction) => void
}

export interface ClientEvents {
  error: (message: string) => void
  "register success": () => void
  "sign in success": () => void
  "chain info": (chainInfo: ChainInfo) => void
  "chain head": (chainHead: ChainHead) => void
  "chain stats": (chainStats: ChainStats) => void
  "chain brief": (chainBrief: ChainBrief) => void
  "chain briefs": (chainBriefs: ChainBrief[]) => void
  memberships: (memberships: Membership[]) => void
  membership: (membership: Membership) => void
  blocks: (blocks: Block[]) => void
  block: (block: Block) => void
  "new block accepted": () => void
  achievements: (achievements: Achievement[]) => void
  achievement: (achievement: Achievement) => void
  "achievement reviews": (reviews: Review[]) => void
  transactions: (transactions: Transaction[]) => void
  transaction: (transaction: Transaction) => void
}

export type Socket = SocketIO<ClientEvents, ServerEvents>
