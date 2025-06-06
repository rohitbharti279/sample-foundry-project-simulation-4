import { ethers } from "hardhat";
import * as CounterArtifact from '../../../sample-foundry-project/out/Counter.sol/Counter.json';
import * as MyTokenArtifact from '../../../sample-foundry-project/out/MyToken.sol/MyToken.json';

async function deployContracts() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const myToken = await new ethers.ContractFactory(
    MyTokenArtifact.abi,
    MyTokenArtifact.bytecode,
    deployer
  ).deploy(1000000000000000000000n);
  await myToken.waitForDeployment();

  const counter = await new ethers.ContractFactory(
    CounterArtifact.abi,
    CounterArtifact.bytecode,
    deployer
  ).deploy();
  await counter.waitForDeployment();

  console.log("Counter address:", counter.target);
  console.log("MyToken address:", myToken.target);

  return {
    myToken: myToken,
    counter: counter
  };
}

export { deployContracts };