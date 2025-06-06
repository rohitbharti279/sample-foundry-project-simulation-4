import { Action, Actor, Account } from "@svylabs/ilumina";
import type { RunContext } from "@svylabs/ilumina";
import { Snapshot } from "@svylabs/ilumina";
import { Contract} from "ethers";


import { SetANewNumberAction } from "../actions/counter_set_a_new_number";

import { IncrementTheNumberAction } from "../actions/counter_increment_the_number";


export function createCounterUserActor(account: Account, contracts: Record<string, Contract>): Actor {
    let actor;
    const actions: Action[] = [];
    let action;
    
    action = new SetANewNumberAction(contracts.counter);
    actions.push({action: action, probability: 0.5});
    
    action = new IncrementTheNumberAction(contracts.counter);
    actions.push({action: action, probability: 0.7});
    
    actor = new Actor(
        "CounterUser",
        account,
        actions,
    );
    return actor;
}