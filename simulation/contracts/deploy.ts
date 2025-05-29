const hre = require("hardhat");

async function deployContracts() {
  const artifactPaths = {
    "Counter": "../../../sample-foundry-project/out/Counter.sol/Counter.json",
    "MyToken": "../../../sample-foundry-project/out/MyToken.sol/MyToken.json"
  };

  const CounterArtifact = require(artifactPaths.Counter);
  const MyTokenArtifact = require(artifactPaths.MyToken);

  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const contracts = {};

  // Deploy MyToken
  const initialSupply = "1000000000000000000000";
  const MyToken = new hre.ethers.ContractFactory(
    MyTokenArtifact.abi,
    MyTokenArtifact.bytecode,
    deployer
  );
  const myToken = await MyToken.deploy(initialSupply);
  await myToken.waitForDeployment();
  contracts.myToken = myToken;

  console.log("MyToken deployed to:", myToken.target);

  // Deploy Counter
  const Counter = new hre.ethers.ContractFactory(
    CounterArtifact.abi,
    CounterArtifact.bytecode,
    deployer
  );
  const counter = await Counter.deploy();
  await counter.waitForDeployment();
  contracts.counter = counter;

  console.log("Counter deployed to:", counter.target);

  return contracts;
}

exports.deployContracts = deployContracts;