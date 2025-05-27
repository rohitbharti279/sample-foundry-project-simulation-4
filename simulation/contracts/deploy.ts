import { ethers } from "hardhat";

const contractArtifacts = {
    "Counter": require("../../../sample-foundry-project/out/Counter.sol/Counter.json"),
    "MyToken": require("../../../sample-foundry-project/out/MyToken.sol/MyToken.json")
};

async function deployContracts() {
    const [deployer] = await ethers.getSigners();

    console.log(`Deploying contracts with the account: ${deployer.address}`);

    const deploymentSequence = [
        {
            "type": "deploy",
            "contract": "MyToken",
            "constructor": "constructor(uint256 initialSupply) ERC20(\"MyToken\", \"MTK\") {\n        _mint(msg.sender, initialSupply);\n    }",
            "function": "constructor",
            "ref_name": "myToken",
            "params": [{
                "name": "initialSupply",
                "value": "1000000000000000000000",
                "type": "val"
            }]
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

            try {
                // Load contract factory
                if (step.contract === "MyToken") {
                    // Create contract factory for MyToken
                    factory = new ethers.ContractFactory(
                        contractArtifacts[step.contract].abi,
                        contractArtifacts[step.contract].bytecode,
                        deployer
                    );

                    // Extract initial supply from parameters
                    const initialSupply = step.params[0].value;

                    // Deploy the contract
                    console.log(`Deploying MyToken with initialSupply: ${initialSupply}`);
                    const contract = await factory.deploy(initialSupply);
                    deployedContracts[step.ref_name] = contract;

                    // Wait for the contract to be deployed
                    await contract.waitForDeployment();

                    console.log(`MyToken deployed to: ${contract.target}`);

                    // Wait for 5 confirmations
                    const tx = await contract.deploymentTransaction()!.wait(5);

                    console.log("Contract deployment confirmed.");

                } else if (step.contract === "Counter") {
                    // Create contract factory for Counter
                    factory = new ethers.ContractFactory(
                        contractArtifacts[step.contract].abi,
                        contractArtifacts[step.contract].bytecode,
                        deployer
                    );

                    // Deploy the contract
                    const contract = await factory.deploy();
                    deployedContracts[step.ref_name] = contract;

                    // Wait for the contract to be deployed
                    await contract.waitForDeployment();

                    console.log(`Counter deployed to: ${contract.target}`);

                    // Wait for 5 confirmations
                    const tx = await contract.deploymentTransaction()!.wait(5);

                    console.log("Contract deployment confirmed.");

                } else {
                    throw new Error(`Unknown contract: ${step.contract}`);
                }

            } catch (error: any) {
                console.error(`Error deploying ${step.contract}:`, error);
                throw error; // Re-throw the error to halt the deployment
            }
        }
    }

    return deployedContracts;
}

export { deployContracts };