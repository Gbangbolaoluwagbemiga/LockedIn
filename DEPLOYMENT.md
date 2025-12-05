# 🚀 Deployment Guide - LockedIn on Celo

This guide will walk you through deploying the LockedIn contract on Celo networks.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **A Celo wallet** with CELO tokens
4. **Private key** of the deployer account

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

1. Create a `.env` file in the root directory:

```env
PRIVATE_KEY=your_private_key_here_without_0x_prefix
CELOSCAN_API_KEY=your_celoscan_api_key_here
```

⚠️ **Important**: 
- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Your private key should NOT include the `0x` prefix

## Step 3: Get Testnet CELO (Alfajores)

If deploying to testnet, get free testnet CELO:

1. Visit: https://faucet.celo.org/alfajores
2. Connect your wallet (MetaMask, Valora, etc.)
3. Request testnet CELO

You'll need CELO to pay for gas fees.

## Step 4: Compile the Contract

```bash
npm run compile
```

This will compile your Solidity contracts and check for errors.

## Step 5: Deploy to Alfajores Testnet

Test your deployment on the testnet first:

```bash
npm run deploy:alfajores
```

Expected output:
```
🔒 Deploying LockedIn contract...
📡 Network: alfajores
👤 Deploying with account: 0x...
💰 Account balance: X CELO
📦 Deploying contract...

✅ LockedIn deployed successfully!
📝 Contract address: 0x...
🔍 View on explorer: https://alfajores.celoscan.io/address/0x...
```

## Step 6: Verify the Contract (Optional)

To verify your contract on CeloScan:

1. Get a CeloScan API key from: https://celoscan.io/apis
2. Add it to your `.env` file
3. Use Hardhat verify plugin:

```bash
npx hardhat verify --network alfajores <CONTRACT_ADDRESS>
```

## Step 7: Deploy to Celo Mainnet

Once tested on Alfajores, deploy to mainnet:

```bash
npm run deploy:celo
```

⚠️ **Warning**: 
- Mainnet deployment costs real CELO
- Double-check your contract before deploying
- Ensure you have enough CELO for gas fees

## Troubleshooting

### "Insufficient funds"
- Make sure your account has enough CELO for gas fees
- For testnet, get more from the faucet

### "Invalid private key"
- Check that your private key doesn't include `0x` prefix
- Ensure there are no extra spaces or newlines

### "Network error"
- Check your internet connection
- Verify the RPC endpoint is accessible
- Try again after a few moments

## Contract Verification

After deployment, verify your contract on CeloScan:

1. Go to: https://alfajores.celoscan.io (testnet) or https://celoscan.io (mainnet)
2. Search for your contract address
3. Click "Contract" tab
4. Click "Verify and Publish"
5. Fill in the details and upload your contract source code

## Next Steps

After deployment:

1. **Test the contract** by creating a commitment
2. **Share the contract address** with users
3. **Monitor transactions** on CeloScan
4. **Update your frontend** (if applicable) with the new contract address

## Support

- Celo Documentation: https://docs.celo.org
- Celo Discord: https://discord.gg/celo
- Celo Forum: https://forum.celo.org

