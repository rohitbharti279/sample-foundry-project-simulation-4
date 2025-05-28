import { ethers } from "hardhat";

// Import contract artifacts
import CounterArtifact from "../../../sample-foundry-project/out/Counter.sol/Counter.json";
import MyTokenArtifact from "../../../sample-foundry-project/out/MyToken.sol/MyToken.json";

async function deployContracts(): Promise<{ [key: string]: ethers.Contract }> {
  // Get the deployer account
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const deploymentSequence = [
    {
      type: "deploy",
      contract: "MyToken",
      function: "constructor",
      ref_name: "myToken",
      params: [{
        name: "initialSupply",
        value: "1000000000000000000000",
        type: "val"
      }]
    },
    {
      type: "deploy",
      contract: "Counter",
      function: "constructor",
      ref_name: "counter",
      params: []
    }
  ];

  const deployedContracts: { [key: string]: ethers.Contract } = {};

  for (const step of deploymentSequence) {
    if (step.type === "deploy") {
      console.log(`Deploying ${step.contract} as ${step.ref_name}...`);
      let contractFactory;

      if (step.contract === "MyToken") {
        contractFactory = new ethers.ContractFactory(
          MyTokenArtifact.abi,
          MyTokenArtifact.bytecode,
          deployer
        );
      } else if (step.contract === "Counter") {
        contractFactory = new ethers.ContractFactory(
          CounterArtifact.abi,
          CounterArtifact.bytecode,
          deployer
        );
      } else {
        console.error(`Unknown contract: ${step.contract}. Skipping deployment.`);
        continue;
      }

      let deploymentParams: any[] = [];
      if (step.params && step.params.length > 0) {
        deploymentParams = step.params.map((param) => {
          if (param.type === "val") {
            return param.value;
          } else {
            console.error(`Unknown param type: ${param.type} for param ${param.name}. Skipping.`);
            return undefined;
          }
        }).filter(param => param !== undefined);
      }

      try {
        const contract = await contractFactory.deploy(...deploymentParams);
        await contract.waitForDeployment();

        console.log(`${step.contract} deployed to:`, contract.target);
        deployedContracts[step.ref_name] = contract;

        // Verify deployment (optional)
        const code = await ethers.provider.getCode(contract.target);
        if (code === '0x') {
          console.error(`Contract ${step.contract} deployment verification failed. No code at address.`);
        }

      } catch (error: any) {
        console.error(`Error deploying ${step.contract}:`, error.message);
      }
    }
  }

  return deployedContracts;
}

export default deployContracts;
