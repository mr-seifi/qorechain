// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {PqcGate} from "../src/PqcGate.sol";

/// Stand-ins for the QoreChain precompiles on Foundry's local EVM, which has none.
/// A signature counts as valid here when it equals keccak256("ok", key, message).
contract MockPqc {
    bool public registered = true;
    bool public proven = true;
    bytes public key = hex"c0ffee";

    function pqcVerify(bytes calldata pubkey, bytes calldata signature, bytes calldata message)
        external pure returns (bool)
    {
        return keccak256(signature) == keccak256(abi.encodePacked(keccak256(abi.encodePacked("ok", pubkey, message))));
    }

    function pqcKeyStatus(address) external view returns (bool, uint8, bytes memory, bool) {
        return (registered, 1, registered ? key : bytes(""), proven);
    }
}

contract PqcGateTest is Test {
    address constant PQC_VERIFY = 0x0000000000000000000000000000000000000a01;
    address constant PQC_KEYS = 0x0000000000000000000000000000000000000a02;

    PqcGate gate;
    address alice = makeAddr("alice");

    function setUp() public {
        MockPqc impl = new MockPqc();
        vm.etch(PQC_VERIFY, address(impl).code);
        vm.etch(PQC_KEYS, address(impl).code);
        setKey(true, true);
        gate = new PqcGate();
    }

    function setKey(bool registered, bool proven) internal {
        uint256 packed = (registered ? 1 : 0) + (proven ? 256 : 0); // slot 0: registered at byte 0, proven at byte 1
        vm.store(PQC_KEYS, bytes32(uint256(0)), bytes32(packed));
        // key = hex"c0ffee" (short bytes layout: data left-aligned, length*2 in the last byte)
        vm.store(PQC_KEYS, bytes32(uint256(1)), bytes32(hex"c0ffee0000000000000000000000000000000000000000000000000000000006"));
    }

    function sign(address who, uint256 n) internal view returns (bytes memory) {
        return abi.encodePacked(keccak256(abi.encodePacked("ok", hex"c0ffee", gate.attestationMessage(who, n))));
    }

    function test_quantumReadyReadsTheRegistry() public {
        assertTrue(gate.isQuantumReady(alice));
        setKey(true, false);
        assertFalse(gate.isQuantumReady(alice));
        setKey(false, false);
        assertFalse(gate.isQuantumReady(alice));
    }

    function test_attestWithValidSignature() public {
        bytes memory sig = sign(alice, 0); // computed before the prank: sign() itself makes an external call
        vm.prank(alice);
        gate.attest(sig);
        assertEq(gate.attestedAt(alice), block.number);
        assertEq(gate.nonces(alice), 1);
    }

    function test_signatureWorksOnce() public {
        bytes memory sig = sign(alice, 0);
        vm.prank(alice);
        gate.attest(sig);
        vm.prank(alice);
        vm.expectRevert(PqcGate.BadPqcSignature.selector);
        gate.attest(sig);
    }

    function test_signatureIsBoundToSender() public {
        bytes memory sig = sign(alice, 0);
        vm.prank(makeAddr("mallory"));
        vm.expectRevert(PqcGate.BadPqcSignature.selector);
        gate.attest(sig);
    }

    function test_revertsWithoutRegisteredKey() public {
        setKey(false, false);
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(PqcGate.KeyNotRegistered.selector, alice));
        gate.attest(hex"00");
    }

    function test_revertsWithoutProofOfPossession() public {
        setKey(true, false);
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(PqcGate.KeyNotProven.selector, alice));
        gate.attest(hex"00");
    }
}
