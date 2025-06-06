import { Action, Actor, Account } from "@svylabs/ilumina";
import type { RunContext } from "@svylabs/ilumina";
import { Snapshot } from "@svylabs/ilumina";
import { Contract} from "ethers";


import { DeployMytokenContractAction } from "../actions/mytoken_deploy_mytoken_contract";

import { ReceiveInitialTokenSupplyAction } from "../actions/mytoken_receive_initial_token_supply";


export function createMytokenDeployerActor(account: Account, contracts: Record<string, Contract>): Actor {
    let actor;
    const actions: Action[] = [];
    let action;
    
    action = new DeployMytokenContractAction(contracts.myToken);
    actions.push({action: action, probability: 1.0});
    
    action = new ReceiveInitialTokenSupplyAction(contracts.myToken);
    actions.push({action: action, probability: 1.0});
    
    actor = new Actor(
        "MytokenDeployer",
        account,
        actions,
    );
    return actor;
}