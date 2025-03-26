import { validateMnemonic, mnemonicToSeedSync } from "bip39"
import { BIP32Factory, BIP32Interface } from "bip32"
import * as ecc from "tiny-secp256k1"
import { sha256 } from "js-sha256"
import { Buffer } from "buffer"
import { Achievement, AchievementVerificationResult, ChainBrief, ChainDetail } from "./api"

export class User {
  private _name: string
  private _mnemonic: string
  private _passphrase: string
  private _publicKey: string = ""
  private wallet: BIP32Interface | null = null
  private chains: Record<string, ChainDetail> = {}
  private addresses: Record<string, string> = {}
  private balances: Record<string, number> = {}
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

  public totalBalance(): number {
    return Object.values(this.balances).reduce((acc, balance) => acc + balance, 0)
  }

  public addAchievement(achievement: Achievement) {
    this.achievements[achievement.signature] = achievement
  }

  public getAchievement(signature: string): Achievement | null {
    return this.achievements[signature] || null
  }

  public getAchievements(): Achievement[] {
    return Object.values(this.achievements).sort((a, b) => b.timestamp - a.timestamp)
  }

  public addAchievementVerificationResult(result: AchievementVerificationResult) {
    this.achievementVerificationResults[result.achievementSignature] = result
  }

  public getAchievementVerificationResult(signature: string): AchievementVerificationResult | null {
    return this.achievementVerificationResults[signature] || null
  }

  public deriveAddress(chainUuid: string): string {
    if (!this.wallet) {
      throw new Error("Wallet not created")
    }
    if (!this.addresses[chainUuid]) {
      const derivationPath = `m/44'/777'/0'/0/0`
      const chainKey = this.wallet.derivePath(derivationPath)

      const publicKeyBuffer = Buffer.from(chainKey.publicKey)
      const chainUuidBuffer = Buffer.from(chainUuid)

      const hash = sha256(Buffer.concat([publicKeyBuffer, chainUuidBuffer]))
      const address = `${hash.substring(0, 40)}`
      this.addresses[chainUuid] = address
    }
    return this.addresses[chainUuid]
  }

  public joinChain(chainBrief: ChainBrief): void {
    const address = this.deriveAddress(chainBrief.info.uuid)
    this.addresses[chainBrief.info.uuid] = address
    this.balances[chainBrief.info.uuid] = 0
    this.chains[chainBrief.info.uuid] = {
      info: chainBrief.info,
      stats: chainBrief.stats,
      recentBlocks: [],
      pendingTransactions: [],
    } satisfies ChainDetail
  }

  public setBalance(chainUuid: string, balance: number): void {
    this.balances[chainUuid] = balance
  }

  public getBalance(chainUuid: string): number {
    return this.balances[chainUuid]
  }

  public signAchievement(achievement: Achievement): string {
    if (!this.wallet) {
      return ""
    }
    const messageHash = sha256(
      achievement.chainUuid +
        achievement.userAddress +
        achievement.description +
        achievement.evidenceImage +
        achievement.timestamp.toString()
    )
    return Buffer.from(this.wallet.sign(Buffer.from(messageHash, "hex"))).toString("hex")
  }
}
