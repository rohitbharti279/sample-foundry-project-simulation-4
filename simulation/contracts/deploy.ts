import { ethers } from "hardhat";
import CounterArtifact from "../../../sample-foundry-project/out/Counter.sol/Counter.json";
import MyTokenArtifact from "../../../sample-foundry-project/out/MyToken.sol/MyToken.json";

export async function deployContracts() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const deploymentSequence = [
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
  ];

  const deployedContracts: { [key: string]: any } = {};

  for (const step of deploymentSequence) {
    if (step.type === "deploy") {
      console.log(`Deploying ${step.contract} contract...`);

      let factory;
      if (step.contract === "MyToken") {
        factory = new ethers.ContractFactory(
          MyTokenArtifact.abi,
          MyTokenArtifact.bytecode,
          deployer
        );
      } else if (step.contract === "Counter") {
        factory = new ethers.ContractFactory(
          CounterArtifact.abi,
          CounterArtifact.bytecode,
          deployer
        );
      } else {
        throw new Error(`Unknown contract type: ${step.contract}`);
      }

      let params = [];
      if (step.params && step.params.length > 0) {
        params = step.params.map((param: any) => {
          if (param.type === "val") {
            return param.value;
          } else {
            return param.value;
          }
        });
      }

      try {
        const contract = await factory.deploy(...params, { gasLimit: 6000000 });
        await contract.waitForDeployment();

        console.log(`${step.contract} contract deployed to: ${contract.target}`);
        deployedContracts[step.ref_name] = contract;
      } catch (error) {
        console.error(`Failed to deploy ${step.contract} contract:`, error);
        throw error; // Re-throw to stop the deployment
      }
    } else {
      throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  return deployedContracts;
}
