const hre = require("hardhat");

async function main() {
  console.log("🔒 Deploying LockedIn contract...");
  
  const network = hre.network.name;
  console.log(`📡 Network: ${network}`);

  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 Deploying with account: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${hre.ethers.formatEther(balance)} CELO`);

  // Deploy the contract
  console.log("📦 Deploying contract...");
  const LockedIn = await hre.ethers.getContractFactory("LockedIn");
  const lockedIn = await LockedIn.deploy();
  
  await lockedIn.waitForDeployment();
  const address = await lockedIn.getAddress();

  console.log("\n✅ LockedIn deployed successfully!");
  console.log(`📝 Contract address: ${address}`);
  
  // Get explorer URL based on network
  let explorerUrl = "";
  if (network === "celo") {
    explorerUrl = `https://celoscan.io/address/${address}`;
  } else if (network === "alfajores") {
    explorerUrl = `https://alfajores.celoscan.io/address/${address}`;
  } else {
    explorerUrl = "Local network - no explorer";
  }
  
  console.log(`🔍 View on explorer: ${explorerUrl}`);
  
  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    network: network,
    contractAddress: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  };
  
  const deploymentsDir = './deployments';
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  fs.writeFileSync(
    `${deploymentsDir}/${network}-deployment.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`\n💾 Deployment info saved to: deployments/${network}-deployment.json`);
  console.log("\n📋 Next steps:");
  console.log(`1. Update your frontend .env.local file with:`);
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
  console.log(`2. Verify the contract (optional):`);
  console.log(`   npx hardhat verify --network ${network} ${address}`);
  
  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

