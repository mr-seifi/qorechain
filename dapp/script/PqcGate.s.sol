// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {PqcGate} from "../src/PqcGate.sol";

/// Deploys PqcGate. The sender needs a registered ML-DSA-87 key and a live EVM window.
///   forge script script/PqcGate.s.sol --rpc-url qorechain_testnet --broadcast
contract PqcGateScript is Script {
    function run() external returns (PqcGate gate) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerKey);
        gate = new PqcGate();
        vm.stopBroadcast();
        console.log("PqcGate deployed at", address(gate));
    }
}
