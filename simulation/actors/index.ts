import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Action, Actor, Account } from "@svylabs/ilumina";
import type { RunContext } from "@svylabs/ilumina";
import { Snapshot } from "@svylabs/ilumina";
import { Contract} from "ethers";


import { createMytokenDeployerActor } from "./mytoken_deployer";

import { createMytokenUserActor } from "./mytoken_user";

import { createCounterDeployerActor } from "./counter_deployer";

import { createCounterUserActor } from "./counter_user";


export function setupActors(config: any, addrs: HardhatEthersSigner[], contracts: Record<string, Contract>): Actor[] {
   let idx = 0;
   const actors: Actor[] = [];

   
    for (let i = 0; i < config.actors.MytokenDeployer; i++) {
        const account: Account = {
            address: addrs[idx].address,
            type: "key",
            value: addrs[idx]
        };
        idx++;
        const actor = createMytokenDeployerActor(account, contracts);
        actors.push(actor);
    }
   
    for (let i = 0; i < config.actors.MytokenUser; i++) {
        const account: Account = {
            address: addrs[idx].address,
            type: "key",
            value: addrs[idx]
        };
        idx++;
        const actor = createMytokenUserActor(account, contracts);
        actors.push(actor);
    }
   
    for (let i = 0; i < config.actors.CounterDeployer; i++) {
        const account: Account = {
            address: addrs[idx].address,
            type: "key",
            value: addrs[idx]
        };
        idx++;
        const actor = createCounterDeployerActor(account, contracts);
        actors.push(actor);
    }
   
    for (let i = 0; i < config.actors.CounterUser; i++) {
        const account: Account = {
            address: addrs[idx].address,
            type: "key",
            value: addrs[idx]
        };
        idx++;
        const actor = createCounterUserActor(account, contracts);
        actors.push(actor);
    }
   
   return actors;
}