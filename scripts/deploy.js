// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Exchange = await hre.ethers.getContractFactory("Exchange");
  const exchange = await Exchange.deploy(2);

  await exchange.deployed();

  console.log("exchange deployed to:", exchange.address);

  const McNFT = await hre.ethers.getContractFactory("McNFT");
  const Mcnft = await McNFT.deploy();

  await Mcnft.deployed();

  console.log("MF deployed to:", Mcnft.address);

  fs.writeFileSync('./config.js', `
    export const exchangeAddress = "${exchange.address}"
    export const nftAddress = "${Mcnft.address}"
  `)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
