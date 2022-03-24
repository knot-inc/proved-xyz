//SPDX-License-Identifier: 0BSD
// Copyright Knot, inc.
// Author tomo@knot.inc

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract ProofContract is Initializable, AccessControlUpgradeable {
    event AddProof(
        address indexed owner,
        string internalId,
        uint256 proofId,
        uint256 endorseKey
    );
    event UpdateProof(address indexed owner, uint256 proofId);
    event EndorseProof(address indexed owner, address prover, uint256 proofId);

    bytes32 public constant AUTH_ROLE = keccak256("AUTH_ROLE");

    struct Proof {
        string internalId;
        address firstProver;
        uint256 proverCnt;
        uint256 start;
        uint256 end;
    }

    struct Endorsement {
        address prover;
        string contentURI;
    }

    // endorsements[hash(owner, key)]
    mapping(uint256 => Endorsement[]) private endorsements;

    // work proofs  proofs[owner]
    mapping(address => Proof[]) public proofs;

    function initialize() public initializer {
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(AUTH_ROLE, msg.sender);
    }

    /*
     * functions
     */

    /**
     * @dev add proof
     * @param internalProofId proofId used for check existence
     * @param prover prover address
     * @param start unixtimestamp
     * @param end unixtimestamp
     * @param contentURI content of proof "endorsement/detail"
     * @param owner owner of proof
     */
    function addProof(
        string memory internalProofId,
        address prover,
        uint256 start,
        uint256 end,
        string memory contentURI,
        address owner
    ) public {
        require(hasRole(AUTH_ROLE, msg.sender), "No Auth");
        // check that proof does not exist
        for (uint256 i = 0; i < proofs[owner].length; i++) {
            if (matches(proofs[owner][i].internalId, internalProofId)) {
                revert("Proof exists");
            }
        }

        uint256 key = hash(owner, proofs[owner].length);
        endorsements[key].push(
            Endorsement({prover: prover, contentURI: contentURI})
        );

        proofs[owner].push(
            Proof({
                internalId: internalProofId,
                start: start,
                end: end,
                proverCnt: 1,
                firstProver: prover
            })
        );
        emit AddProof(owner, internalProofId, proofs[owner].length - 1, key);
    }

    /**
     * @dev update proof date
     * @param proofId proofId
     * @param start unixtimestamp
     * @param end unixtimestamp
     * @param owner owner of proof
     */
    function updateProofDateRange(
        uint256 proofId,
        uint256 start,
        uint256 end,
        address owner
    ) public {
        require(hasRole(AUTH_ROLE, msg.sender), "No Auth");
        require(proofId < proofs[owner].length, "Out of Bound");
        Proof storage proof = proofs[owner][proofId];
        if (start != 0) {
            proof.start = start;
        }
        if (end != 0) {
            proof.end = end;
        }
        emit UpdateProof(owner, proofId);
    }

    /*
     * @dev add the prover
     * @param proofId
     * @param prover address
     * @param owner owner of proof
     * @param content
     */
    function endorseProof(
        uint256 proofId,
        address prover,
        address owner,
        string memory contentURI
    ) public {
        require(hasRole(AUTH_ROLE, msg.sender), "No Auth");
        // TODO: prover should have AUTH_ROLE
        // require(hasRole(AUTH_ROLE, prover), "No Auth");
        uint256 key = hash(owner, proofId);
        require(endorsements[key].length > 0, "No Proof");

        // check that proof does not exist
        for (uint256 i = 0; i < endorsements[key].length; i++) {
            if (endorsements[key][i].prover == prover) {
                revert("Endorse exists");
            }
        }

        endorsements[key].push(
            Endorsement({prover: prover, contentURI: contentURI})
        );
        proofs[owner][proofId].proverCnt += 1;
        emit EndorseProof(owner, prover, proofId);
    }

    /*
     * @dev Gets the array of proofs
     * @param owner address owning the proofs
     * @return proofs
     */
    function proofsOfOwner(address owner) public view returns (Proof[] memory) {
        return proofs[owner];
    }

    /*
     * @dev Gets the array of provers
     * @param owner address, the id of proof
     * @return provers
     */
    function proversByProof(address owner, uint256 proofId)
        public
        view
        returns (Endorsement[] memory)
    {
        uint256 key = hash(owner, proofId);
        return endorsements[key];
    }

    /*
     * Admin Only
     */

    function grantAuth(address user) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setupRole(AUTH_ROLE, user);
    }

    function revokeAuth(address user) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(AUTH_ROLE, user);
    }

    function removeProof(address user, uint256 proofId)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(proofId < proofs[user].length, "Out of Bound");
        for (uint256 i = proofId; i < proofs[user].length - 1; i++) {
            proofs[user][i] = proofs[user][i + 1];
        }
        proofs[user].pop();
        uint256 key = hash(user, proofId);
        delete endorsements[key];
    }

    /*
     * Utility
     */

    function hash(address addr, uint256 num)
        internal
        pure
        returns (uint256 key)
    {
        return uint256(keccak256(abi.encodePacked(num, addr)));
    }

    function matches(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}
