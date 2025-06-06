import { ethers } from "hardhat";
import CounterArtifact from "../../../sample-foundry-project/out/Counter.sol/Counter.json";
import MyTokenArtifact from "../../../sample-foundry-project/out/MyToken.sol/MyToken.json";

async function deployContracts() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const contracts: { [key: string]: any } = {};

  // Deployment sequence
  // 1. Deploy MyToken
  console.log("Deploying MyToken...");
  const myTokenFactory = new ethers.ContractFactory(
    MyTokenArtifact.abi,
    MyTokenArtifact.bytecode,
    deployer
  );
  const initialSupply = "1000000000000000000000";
  const myToken = await myTokenFactory.deploy(initialSupply);
  await myToken.waitForDeployment();
  console.log("MyToken deployed to:", myToken.target);
  contracts["myToken"] = myToken;

  // 2. Deploy Counter
  console.log("Deploying Counter...");
  const counterFactory = new ethers.ContractFactory(
    CounterArtifact.abi,
    CounterArtifact.bytecode,
    deployer
  );
  const counter = await counterFactory.deploy();
  await counter.waitForDeployment();
  console.log("Counter deployed to:", counter.target);
  contracts["counter"] = counter;

  return contracts;
}

export { deployContracts };