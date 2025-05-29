import { ethers } from "hardhat";
import * as fs from 'fs';

// Define contract artifact paths from the provided mapping
const artifactPaths: { [contractName: string]: string } = {
  "Counter": "../../../sample-foundry-project/out/Counter.sol/Counter.json",
  "MyToken": "../../../sample-foundry-project/out/MyToken.sol/MyToken.json"
};

// Define the deployment sequence
const deploymentSequence = {
  "sequence": [
    {
      "type": "deploy",
      "contract": "MyToken",
      "constructor": "constructor(uint256 initialSupply) ERC20(\"MyToken\", \"MTK\") {\n        _mint(msg.sender, initialSupply);\n    }",
      "function": "constructor",
      "ref_name": "myToken",
      "params": [
        {
          "name": "initialSupply",
          "value": "1000000000000000000000",
          "type": "val"
        }
      ]
    },
    {
      "type": "deploy",
      "contract": "Counter",
      "constructor": "null",
      "function": "constructor",
      "ref_name": "counter",
      "params": []
    }
  ]
};


async function deployContracts() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", balance.toString());

  const deployedContracts: { [refName: string]: any } = {};

  // Function to deploy a contract with its artifact
  async function deployContract(contractName: string, artifactPath: string, constructorArgs: any[] = []) {
    console.log(`Deploying ${contractName} from artifact: ${artifactPath}`);

    try {
      // Dynamically import the artifact
      const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf-8'));
      const ContractFactory = await ethers.getContractFactory(artifact.abi, artifact.bytecode, deployer);

      const contract = await ContractFactory.deploy(...constructorArgs);
      await contract.waitForDeployment();

      console.log(`${contractName} deployed to:`, contract.target);
      return contract;
    } catch (error) {
      console.error(`Error deploying ${contractName}:`, error);
      throw error; // Re-throw the error to halt the deployment
    }
  }

  // Iterate through the deployment sequence
  for (const step of deploymentSequence.sequence) {
    if (step.type === "deploy") {
      const artifactPath = artifactPaths[step.contract];
      if (!artifactPath) {
        throw new Error(`Artifact path not found for contract: ${step.contract}`);
      }

      const constructorArgs = step.params.map(param => param.value);

      const contract = await deployContract(step.contract, artifactPath, constructorArgs);
      deployedContracts[step.ref_name] = contract;
    }
  }

  return deployedContracts;
}

export { deployContracts };