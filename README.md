# n8n-nodes-rlusd-stablecoin

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

n8n community node providing comprehensive integration with RLUSD Stablecoin blockchain infrastructure. This node includes 4 essential resources covering account balances, transaction management, token information, and network status monitoring for RLUSD operations.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![RLUSD](https://img.shields.io/badge/RLUSD-Stablecoin-green)
![Blockchain](https://img.shields.io/badge/Blockchain-Integration-orange)
![DeFi](https://img.shields.io/badge/DeFi-Ready-purple)

## Features

- **Account Balance Tracking** - Monitor RLUSD token balances across multiple accounts and addresses
- **Transaction Management** - Execute, track, and analyze RLUSD transfers and smart contract interactions
- **Token Information Retrieval** - Access comprehensive RLUSD token metadata, supply metrics, and contract details
- **Network Status Monitoring** - Real-time blockchain network health, gas prices, and transaction throughput data
- **Multi-Network Support** - Compatible with Ethereum, XRP Ledger, and other RLUSD-supported networks
- **Real-Time Updates** - Live monitoring capabilities for balance changes and transaction confirmations
- **Batch Operations** - Efficiently process multiple accounts and transactions in single workflow executions
- **Error Resilience** - Robust error handling with automatic retries for network-related failures

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-rlusd-stablecoin`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-rlusd-stablecoin
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-rlusd-stablecoin.git
cd n8n-nodes-rlusd-stablecoin
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-rlusd-stablecoin
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your RLUSD Stablecoin API access key | Yes |
| Environment | Select production or testnet environment | Yes |
| Network | Target blockchain network (Ethereum, XRP Ledger, etc.) | Yes |

## Resources & Operations

### 1. Account Balances

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve RLUSD token balance for specific account |
| Get Multiple Balances | Fetch balances for multiple accounts in batch |
| Get Historical Balance | Access account balance at specific block height |
| Monitor Balance Changes | Track real-time balance updates |
| Get Balance Summary | Comprehensive account balance overview |

### 2. Transactions

| Operation | Description |
|-----------|-------------|
| Send Transaction | Execute RLUSD token transfer |
| Get Transaction | Retrieve transaction details by hash |
| Get Transaction History | Fetch account transaction history |
| Get Pending Transactions | Monitor unconfirmed transactions |
| Estimate Transaction Fee | Calculate gas costs before execution |
| Batch Transfer | Execute multiple transfers efficiently |

### 3. Token Info

| Operation | Description |
|-----------|-------------|
| Get Token Details | Retrieve RLUSD token contract information |
| Get Total Supply | Current circulating RLUSD supply |
| Get Token Holders | List of token holder addresses |
| Get Contract Events | Smart contract event logs |
| Get Decimals | Token decimal precision |
| Get Symbol | Token symbol and name information |

### 4. Network Status

| Operation | Description |
|-----------|-------------|
| Get Network Info | Current blockchain network status |
| Get Gas Prices | Real-time transaction fee estimates |
| Get Block Height | Latest confirmed block number |
| Get Network Health | Blockchain performance metrics |
| Get Validator Info | Network validator status and performance |
| Get Throughput Stats | Transaction processing statistics |

## Usage Examples

```javascript
// Monitor RLUSD balance for treasury account
const balanceData = {
  "address": "0x742d35cc6635c0532925a3b8d3ac19b26c924c",
  "includePending": true
};
// Returns current RLUSD balance and pending transactions
```

```javascript
// Execute RLUSD transfer with fee estimation
const transferData = {
  "from": "0x742d35cc6635c0532925a3b8d3ac19b26c924c",
  "to": "0x8ba1f109551bD432803012645Hac136c0532925",
  "amount": "1000.50",
  "estimateGas": true
};
// Returns transaction hash and gas cost estimate
```

```javascript
// Fetch RLUSD token supply and holder statistics
const tokenData = {
  "includeMetrics": true,
  "holderLimit": 100
};
// Returns total supply, holder count, and top holders list
```

```javascript
// Monitor network health for transaction timing
const networkData = {
  "includeGasPrice": true,
  "includeThroughput": true
};
// Returns current gas prices and network congestion status
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and active |
| Network Timeout | Request exceeded maximum response time | Retry with exponential backoff, check network connectivity |
| Insufficient Balance | Account lacks funds for transaction | Verify account balance before executing transfers |
| Invalid Address | Blockchain address format is incorrect | Validate address format for target network |
| Gas Estimation Failed | Unable to calculate transaction fees | Check network status and transaction parameters |
| Rate Limit Exceeded | Too many requests in time window | Implement request throttling and retry logic |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-rlusd-stablecoin/issues)
- **RLUSD Documentation**: [RLUSD Developer Portal](https://docs.rlusd.com)
- **Community**: [RLUSD Discord](https://discord.gg/rlusd)