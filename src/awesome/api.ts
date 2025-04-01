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
  capitalization: number
  numberOfUsers: number
  numberOfBlocks: number
  numberOfTransactions: number
  timestamp: number
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
  "get membership": (userPublicKey: string, chainUuid: string) => void
  "get memberships": (userPublicKey: string) => void
  "get chain head": (chainUuid: string) => void
  "get chain heads": (chainUuids: string[]) => void
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
  chains: (chains: ChainInfo[]) => void
  chain: (chain: ChainInfo) => void
  "chain head": (chainHead: ChainHead) => void
  "chain heads": (chainHeads: ChainHead[]) => void
  memberships: (memberships: Membership[]) => void
  membership: (membership: Membership) => void
  blocks: (blocks: Block[]) => void
  block: (block: Block) => void
  achievements: (achievements: Achievement[]) => void
  achievement: (achievement: Achievement) => void
  "achievement verification result": (result: AchievementVerificationResult) => void
  transactions: (transactions: Transaction[]) => void
  transaction: (transaction: Transaction) => void
}

export type Socket = SocketIO<ClientEvents, ServerEvents>
