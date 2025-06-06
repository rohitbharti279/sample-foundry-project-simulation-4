import { Action, Actor, Account } from "@svylabs/ilumina";
import type { RunContext } from "@svylabs/ilumina";
import { Snapshot } from "@svylabs/ilumina";
import { Contract} from "ethers";


import { DeployCounterContractAction } from "../actions/counter_deploy_counter_contract";


export function createCounterDeployerActor(account: Account, contracts: Record<string, Contract>): Actor {
    let actor;
    const actions: Action[] = [];
    let action;
    
    action = new DeployCounterContractAction(contracts.counter);
    actions.push({action: action, probability: 1.0});
    
    actor = new Actor(
        "CounterDeployer",
        account,
        actions,
    );
    return actor;
}