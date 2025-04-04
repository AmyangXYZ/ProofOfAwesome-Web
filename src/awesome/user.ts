import { validateMnemonic, mnemonicToSeedSync } from "bip39"
import { BIP32Factory, BIP32Interface } from "bip32"
import * as ecc from "tiny-secp256k1"
import { sha256 } from "js-sha256"
import { Buffer } from "buffer"
import { Achievement, Review, Block, ChainHead, ChainInfo, Membership, ChainStats, ChainBrief } from "./api"

export class User {
  private _mnemonic: string
  private _passphrase: string
  private _publicKey: string = ""
  private _netWorth: number = 0
  private _cashBalance: number = 0
  private _tokenValue: number = 0
  private wallet: BIP32Interface | null = null
  private chains: Record<string, ChainInfo> = {}
  private chainHeads: Record<string, ChainHead> = {}
  private chainStats: Record<string, ChainStats> = {}
  private blocks: Record<string, Block[]> = {}
  private memberships: Record<string, Membership> = {}
  private achievements: Record<string, Achievement> = {}
  private reviews: Record<string, Review[]> = {}

  constructor(mnemonic: string, passphrase: string) {
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

  get publicKey(): string {
    return this._publicKey
  }

  get netWorth(): number {
    return this._netWorth
  }

  get cashBalance(): number {
    return this._cashBalance
  }

  get tokenValue(): number {
    return this._tokenValue
  }

  public addAchievement(achievement: Achievement) {
    this.achievements[achievement.signature] = achievement
  }

  public getAchievement(signature: string): Achievement | null {
    return this.achievements[signature]
  }

  public getAchievements(): Achievement[] {
    return Object.values(this.achievements).sort((a, b) => b.timestamp - a.timestamp)
  }

  public addReview(review: Review) {
    if (!this.reviews[review.achievementSignature]) {
      this.reviews[review.achievementSignature] = []
    }
    this.reviews[review.achievementSignature].push(review)
  }

  public getReview(signature: string): Review[] {
    return this.reviews[signature] ?? []
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

  public getMembership(chainUuid: string): Membership | null {
    return this.memberships[chainUuid]
  }

  public setMembership(membership: Membership): void {
    this.memberships[membership.chainUuid] = membership
    this._tokenValue = Object.values(this.memberships).reduce(
      (acc, membership) => acc + membership.tokens * this.chainStats[membership.chainUuid].price,
      0
    )
    this._netWorth = this._cashBalance + this._tokenValue
  }

  public setChain(chain: ChainInfo): void {
    this.chains[chain.uuid] = chain
  }

  public setChainBrief(chainBrief: ChainBrief): void {
    this.chains[chainBrief.info.uuid] = chainBrief.info
    this.chainHeads[chainBrief.info.uuid] = chainBrief.head
    this.chainStats[chainBrief.info.uuid] = chainBrief.stats
  }

  public getChains(): ChainBrief[] {
    return Object.values(this.chains).map((chain) => ({
      info: chain,
      head: this.chainHeads[chain.uuid],
      stats: this.chainStats[chain.uuid],
    }))
  }
  public getChainHead(chainUuid: string): ChainHead {
    return this.chainHeads[chainUuid]
  }

  public setChainHead(chainHead: ChainHead): void {
    this.chainHeads[chainHead.chainUuid] = chainHead
  }

  public createBlock(chainUuid: string, achievement: Achievement): Block | null {
    if (
      !this.chains[chainUuid] ||
      !this.achievements[achievement.signature] ||
      this.getReview(achievement.signature).length === 0 ||
      this.getReview(achievement.signature).some((review) => review.reward <= 0)
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
      achievement: achievement.signature,
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
