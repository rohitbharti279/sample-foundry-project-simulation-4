import { Action, Actor, Account } from "@svylabs/ilumina";
import type { RunContext } from "@svylabs/ilumina";
import { Snapshot } from "@svylabs/ilumina";
import { Contract} from "ethers";


import { TransferMytokenAction } from "../actions/mytoken_transfer_mytoken";


export function createMytokenUserActor(account: Account, contracts: Record<string, Contract>): Actor {
    let actor;
    const actions: Action[] = [];
    let action;
    
    action = new TransferMytokenAction(contracts.myToken);
    actions.push({action: action, probability: 0.8});
    
    actor = new Actor(
        "MytokenUser",
        account,
        actions,
    );
    return actor;
}