// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

/// QoreChain post-quantum precompiles (active on the qorechain-diana testnet).
interface IQorePQC {
    /// ML-DSA-87 (FIPS 204) verification: 2592-byte key, 4627-byte signature.
    function pqcVerify(bytes calldata pubkey, bytes calldata signature, bytes calldata message)
        external view returns (bool valid);

    /// The ML-DSA-87 key an account registered on chain, and whether it proved possession.
    function pqcKeyStatus(address account)
        external view returns (bool registered, uint8 algorithmId, bytes memory pubkey, bool possessionProven);
}

/// @title PqcGate
/// @notice A small on-chain gate that answers "is this account quantum-ready?"
///         and lets an account prove, with its ML-DSA-87 key, that it controls
///         more than a classical secp256k1 key.
///
/// `isQuantumReady` reads the chain's key registry through the pqcKeyStatus
/// precompile. `attest` verifies an ML-DSA-87 signature through the pqcVerify
/// precompile over a message bound to this chain, this contract, the sender and
/// a per-account nonce, so a signature works once and nowhere else.
contract PqcGate {
    IQorePQC internal constant PQC_VERIFY = IQorePQC(0x0000000000000000000000000000000000000a01);
    IQorePQC internal constant PQC_KEYS = IQorePQC(0x0000000000000000000000000000000000000a02);

    /// Block number of each account's latest successful attestation (0 = never).
    mapping(address => uint256) public attestedAt;
    /// Per-account attestation counter, mixed into the signed message.
    mapping(address => uint256) public nonces;

    event Attested(address indexed account, uint256 nonce, uint256 blockNumber);

    error KeyNotRegistered(address account);
    error KeyNotProven(address account);
    error BadPqcSignature();

    /// @notice True when `account` has a registered ML-DSA-87 key with a proof of possession.
    function isQuantumReady(address account) public view returns (bool) {
        (bool registered,, bytes memory pubkey, bool proven) = PQC_KEYS.pqcKeyStatus(account);
        return registered && pubkey.length != 0 && proven;
    }

    /// @notice The exact bytes an account must sign with ML-DSA-87 to attest.
    function attestationMessage(address account, uint256 nonce) public view returns (bytes memory) {
        return abi.encodePacked("PqcGate.attest", block.chainid, address(this), account, nonce);
    }

    /// @notice Prove control of the sender's registered ML-DSA-87 key.
    /// @param mldsaSignature ML-DSA-87 signature over `attestationMessage(msg.sender, nonces[msg.sender])`.
    function attest(bytes calldata mldsaSignature) external {
        (bool registered,, bytes memory pubkey, bool proven) = PQC_KEYS.pqcKeyStatus(msg.sender);
        if (!registered || pubkey.length == 0) revert KeyNotRegistered(msg.sender);
        if (!proven) revert KeyNotProven(msg.sender);

        uint256 n = nonces[msg.sender];
        if (!PQC_VERIFY.pqcVerify(pubkey, mldsaSignature, attestationMessage(msg.sender, n))) revert BadPqcSignature();

        nonces[msg.sender] = n + 1;
        attestedAt[msg.sender] = block.number;
        emit Attested(msg.sender, n, block.number);
    }

    /// @notice Raw ML-DSA-87 verification through the precompile, for other contracts and tools.
    function verify(bytes calldata pubkey, bytes calldata signature, bytes calldata message) external view returns (bool) {
        return PQC_VERIFY.pqcVerify(pubkey, signature, message);
    }
}
