require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
const ACCOUNT = "0x2f4f87699090af7f11584cd76c30293c148269fb3f50242c7d72be0fbbb33a8b";
module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/YoQKigBTaVQxDVsk8flhekDkqN2LaWTF",
      accounts: [ACCOUNT]
    }
  },
  solidity: {
    version: "0.8.21",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths:  {
    sources: "./contracts",
    artifacts: "./client/src"
  }
};
