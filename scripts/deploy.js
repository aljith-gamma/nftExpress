
const { ethers } = require("hardhat");

async function main() {
  const nftExpress = await ethers.getContractFactory('NftExpress');
  const contract = await nftExpress.deploy("my URL");

  console.log({ contract })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
