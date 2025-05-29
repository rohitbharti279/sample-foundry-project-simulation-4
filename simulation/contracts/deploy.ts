import { ethers } from "hardhat";
import * as CounterJson from "../../../sample-foundry-project/out/Counter.sol/Counter.json";
import * as MyTokenJson from "../../../sample-foundry-project/out/MyToken.sol/MyToken.json";

async function deployContracts() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", balance.toString());

  const myTokenFactory = new ethers.ContractFactory(
    MyTokenJson.abi,
    MyTokenJson.bytecode,
    deployer
  );
  const myToken = await myTokenFactory
    .deploy("1000000000000000000000")
    .then((f) => f.waitForDeployment());
  console.log("MyToken address:", myToken.target);

  const counterFactory = new ethers.ContractFactory(
    CounterJson.abi,
    CounterJson.bytecode,
    deployer
  );
  const counter = await counterFactory.deploy().then((f) => f.waitForDeployment());
  console.log("Counter address:", counter.target);

  return {
    MyToken: myToken,
    Counter: counter,
  };
}

export { deployContracts };
