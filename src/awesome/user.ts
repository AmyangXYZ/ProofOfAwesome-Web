import { validateMnemonic, mnemonicToSeedSync } from "bip39"
import { BIP32Factory, BIP32Interface } from "bip32"
import * as ecc from "tiny-secp256k1"
import { sha256 } from "js-sha256"
import { Buffer } from "buffer"
import { Achievement, AchievementVerificationResult, Block, ChainBrief, ChainHead, Membership } from "./api"

export class User {
  private _name: string
  private _mnemonic: string
  private _passphrase: string
  private _publicKey: string = ""
  private wallet: BIP32Interface | null = null
  private chains: Record<string, ChainBrief> = {}
  private chainHeads: Record<string, ChainHead> = {}
  private blocks: Record<string, Block[]> = {}
  private memberships: Record<string, Membership> = {}
  private achievements: Record<string, Achievement> = {}
  private achievementVerificationResults: Record<string, AchievementVerificationResult> = {}

  constructor(name: string, mnemonic: string, passphrase: string) {
    this._name = name
    this._mnemonic = mnemonic
    this._passphrase = passphrase
  }

  public createWallet(): boolean {
    if (!validateMnemonic(this._mnemonic)) {
      return false
    }
    this.wallet = BIP32Factory(ecc).fromSeed(mnemonicToSeedSync(this._mnemonic, this._passphrase))
    this._publicKey = Buffer.from(this.wallet.publicKey).toString("hex")
    return true
  }

  get name(): string {
    return this._name
  }

  get publicKey(): string {
    return this._publicKey
  }

  get totalBalance(): number {
    return Object.values(this.memberships).reduce((acc, membership) => acc + membership.balance, 0)
  }

  public addAchievement(achievement: Achievement) {
    this.achievements[achievement.hash] = achievement
  }

  public getAchievement(signature: string): Achievement | null {
    return this.achievements[signature] || null
  }

  public getAchievements(): Achievement[] {
    return Object.values(this.achievements).sort((a, b) => b.timestamp - a.timestamp)
  }

  public addAchievementVerificationResult(result: AchievementVerificationResult) {
    this.achievementVerificationResults[result.achievementHash] = result
  }

  public getAchievementVerificationResult(signature: string): AchievementVerificationResult | null {
    return this.achievementVerificationResults[signature] || null
  }

  public deriveAddress(chainUuid: string): string {
    if (!this.wallet) {
      throw new Error("Wallet not created")
    }
    const derivationPath = `m/44'/777'/0'/0/0`
    const chainKey = this.wallet.derivePath(derivationPath)

    const publicKeyBuffer = Buffer.from(chainKey.publicKey)
    const chainUuidBuffer = Buffer.from(chainUuid)

    const hash = sha256(Buffer.concat([publicKeyBuffer, chainUuidBuffer]))
    return `${hash.substring(0, 40)}`
  }

  public updateChainHead(chainHead: ChainHead): void {
    this.chainHeads[chainHead.chainUuid] = chainHead
  }

  public addMembership(chainBrief: ChainBrief, membership: Membership): void {
    this.chains[chainBrief.info.uuid] = chainBrief
    this.memberships[membership.chainUuid] = membership
  }

  public getChains(): ChainBrief[] {
    return Object.values(this.chains).map((chain) => chain)
  }

  public setBalance(chainUuid: string, balance: number): void {
    if (!this.memberships[chainUuid]) {
      return
    }
    this.memberships[chainUuid].balance = balance
  }

  public getBalance(chainUuid: string): number {
    if (!this.memberships[chainUuid]) {
      return 0
    }
    return this.memberships[chainUuid].balance
  }

  public createBlock(chainUuid: string, achievement: Achievement): Block | null {
    if (
      !this.chains[chainUuid] ||
      !this.achievements[achievement.hash] ||
      !this.getAchievementVerificationResult(achievement.hash)
    ) {
      return null
    }
    const chainHead = this.chainHeads[chainUuid]
    if (!chainHead) {
      return null
    }
    const block = {
      chainUuid,
      height: chainHead.latestBlockHeight + 1,
      previousHash: chainHead.latestBlockHash,
      transactions: [],
      merkleRoot: "",
      achievement: achievement.hash,
      timestamp: Date.now(),
      hash: "",
    } satisfies Block

    block.hash = sha256(
      block.chainUuid +
        block.achievement +
        block.height.toString() +
        block.previousHash +
        block.merkleRoot +
        block.timestamp.toString()
    )
    return block
  }

  public addBlock(block: Block) {
    if (!this.blocks[block.chainUuid]) {
      this.blocks[block.chainUuid] = []
    }
    this.blocks[block.chainUuid].push(block)
  }

  public getBlocks(chainUuid: string, count: number): Block[] {
    if (!this.blocks[chainUuid]) {
      return []
    }
    return this.blocks[chainUuid].slice(-count)
  }
}
