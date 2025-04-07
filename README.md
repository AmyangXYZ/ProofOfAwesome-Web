# Proof of Awesome

<img src="./public/logo.png" height="144"/>

A blockchain-inspired social platform that transforms real-world achievements into verifiable digital assets.

## 🚀 Overview

**Proof of Awesome** reimagines blockchain technology as a social experience where users "mine" blocks through verified real-world accomplishments rather than computational puzzles. The platform combines blockchain mechanics with achievement tracking to create a compelling social experience with authentic utility.

Our platform features two key innovations:

1. **Achievement Consensus**: Instead of computational puzzles, we use a multi-round AI review system inspired by academic paper reviews. Multiple independent AI models evaluate achievements from different angles, with a meta-AI "TPC Chair" synthesizing evaluations for final consensus.

2. **Achievement Market**: A hybrid market system where accomplishments gain real platform value through:
   - Order book trading with community-driven price discovery
   - Automated market maker providing stable liquidity
   - Reserve-backed token value for achievement chains
   - Real-time price updates based on supply and demand

## ✨ Key Features

- 🏆 **Blockchain-Verified Achievements**: Record your accomplishments permanently on themed blockchains
- 🤖 **AI-Powered Verification**: Get your achievements validated and rewarded through sophisticated AI analysis
- ⛓️ **Themed Achievement Chains**: Join public and private chains focused on fitness, creativity, gaming, and more
- 🪙 **AwesomeCoin Economy**: Earn and utilize tokens with real utility within the ecosystem
- 🔍 **Real-Time Block Creation**: Watch your achievements become blocks in an actual blockchain
- 🌐 **Public & Private Chains**: Participate in public communities or create private chains for specific groups
- 📱 **Cross-Platform**: Access via web app or dedicated iOS application
- 💹 **AwesomeCoin Market**: Trade earned tokens with community-driven price discovery
- 📊 **Portfolio Management**: Track your AwesomeCoin balance and token holdings value

## 🔍 Use Cases

### Personal Development

- Track fitness journeys, learning progress, and daily wins
- Create accountability through blockchain verification
- Visualize your progress through growing block chains
- Convert your achievements into tradeable digital assets

### Social Recognition

- Share meaningful achievements with your community
- Receive validation through AI and peer acknowledgment
- Build a permanent record of your accomplishments
- Gain social proof through token value appreciation

### Group Challenges

- Create custom challenges with pooled token rewards
- Verify completion through evidence-based validation
- Track community progress toward shared goals
- Design token-based incentive systems

### Trading & Market Experience

- Experience real cryptocurrency trading mechanics risk-free
- Learn order book trading with your earned achievement tokens
- Practice portfolio management with multiple achievement chains
- Understand market making and liquidity dynamics
- Participate in price discovery through community trading
- Explore token economics in a controlled environment

## 💡 Platform Experience

### Achievement Verification System

Our multi-round AI review system validates achievements through:

- **Independent AI Reviewers**: Multiple specialized models evaluate different aspects:

  - Thematic relevance to the chosen chain
  - Evidence quality and documentation
  - Achievement difficulty assessment
  - Personal growth context

- **Meta-AI TPC Chair**: Synthesizes reviewer evaluations to reach final consensus
- **Community Governance**: Token holders participate in validation for complex cases
- **Fraud Prevention**: Multi-model approach prevents gaming any single verification method

### Chain Ecosystem

- **Public Chains**: Join themed communities like Fitness King, Home Hero, and Pro Gamer
- **Private Chains**: Create invitation-only chains with custom rules and rewards
- **Chain Explorer**: Discover trending chains and view recent community achievements
- **Block History**: Browse the complete blockchain record of all verified achievements

### User Experience

- **Robinhood-Inspired Design**: Clean, minimal interface focusing on essential information
- **Real-Time Updates**: Watch your achievements transform into blocks in real-time
- **Social Elements**: View and interact with achievements from your network
- **Achievement Streaks**: Build consistent habits by maintaining blockchain-verified activity

### Market System

- **Token Trading**: Exchange achievement tokens through an efficient order matching system
- **Server Reserve**: Stable market maker ensuring consistent liquidity
- **Portfolio Tracking**: Monitor your AwesomeCoin balance and token values over time
- **Order Book**: Place and track buy/sell orders with partial filling support
- **Real-Time Pricing**: Watch market prices update based on community trading activity
- **Achievement Value**: See your accomplishments gain real utility through market dynamics

#### Price Discovery & Market Making

Our market system employs a hybrid approach combining order book dynamics with a market maker reserve:

1. **Order Book Mid Price**

   - Calculated as (lowest_ask + highest_bid) / 2
   - Based on actual user orders only
   - Falls back to market maker reserve price when no orders exist

2. **Market Maker Reserve Price**

   - Base price determined by AC_reserve / token_reserve ratio
   - For stable chains, maintains 1:1 parity with AwesomeCoin
   - Provides consistent liquidity and price stability

3. **Market Maker Order Placement**
   - Sell orders: max(order_book_mid, reserve_price) \* (1 + spread)
   - Buy orders: min(order_book_mid, reserve_price) \* (1 - spread)
   - Ensures balanced trading with controlled spread

This design creates a stable yet dynamic market where:

- Achievement tokens maintain baseline value through reserve backing
- Community trading drives natural price discovery
- Market maker provides consistent liquidity
- Spread mechanism prevents excessive volatility

## 📱 Platform Support

### Web Demo

- Progressive web app accessible from any modern browser
- Full achievement tracking and verification capabilities
- Real-time blockchain visualization

### iOS Native App

- Enhanced mobile experience with native iOS design
- Advanced chain explorer with activity feed
- Push notifications for chain events and verifications
- Integrated trading features

## ⚠️ Important Disclaimer

**Proof of Awesome** is a self-contained ecosystem that does not connect to any real-world blockchain networks or cryptocurrencies. The blockchain mechanics, AwesomeCoins, and all transactions exist solely within our application and have no monetary value or connection to actual cryptocurrency trading platforms. This is an educational and social platform designed to demonstrate blockchain concepts through achievement tracking, not a cryptocurrency or investment vehicle.

## 🛠️ Technical Implementation

Built using a modern tech stack:

- **Frontend**: React, Material UI, Socket.io client
- **Backend**: Node.js, Express, Socket.io
- **Blockchain Core**: Custom implementation with cryptographic verification
- **AI Verification**: Multi-model consensus system with TPC Chair validation
- **Storage**: Distributed ledger with local encryption
- **Market System**: Hybrid order book with market maker reserves
- **Security**: Cryptographic key management with mnemonic phrase recovery

## 🔮 Future Roadmap

- Enhanced trading features between chains
- Smart contracts for automated challenges and rewards
- Mobile app for Android
- Advanced governance models for community chains
- Integration with existing fitness and productivity apps
- Community review system for achievement validation
- Advanced market features (price alerts, advanced orders)
- Premium features for power users
- Enhanced analytics and trading insights
- Private group achievements with custom validation rules
- Peer-to-peer token transactions
- Comprehensive marketplace with order matching
- Enhanced community governance tools

## 📄 License

This demo website is licensed under the GNU Affero General Public License v3 (AGPL-3.0) - see the [LICENSE](LICENSE) file for details.

The AGPL-3.0 License was chosen to:

- Ensure modifications and improvements remain open source
- Require network service providers to share their changes
- Protect the innovative features of the demo
- Promote transparency and community collaboration

Note: This license applies only to the demo website. The Proof of Awesome server, iOS client, and other components are proprietary software.

---
