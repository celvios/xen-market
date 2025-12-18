// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract ConditionalTokens is ERC1155 {
    mapping(bytes32 => uint256) public totalSupplies;

    event PositionSplit(
        address indexed stakeholder,
        address indexed collateralToken,
        bytes32 indexed parentCollectionId,
        bytes32 conditionId,
        uint256[] partition,
        uint256 amount
    );

    constructor() ERC1155("") {}

    function splitPosition(
        address collateralToken,
        bytes32 parentCollectionId,
        bytes32 conditionId,
        uint256[] calldata partition,
        uint256 amount
    ) external {
        for (uint256 i = 0; i < partition.length; i++) {
            bytes32 positionId = keccak256(abi.encodePacked(collateralToken, parentCollectionId, conditionId, partition[i]));
            _mint(msg.sender, uint256(positionId), amount, "");
            totalSupplies[positionId] += amount;
        }

        emit PositionSplit(msg.sender, collateralToken, parentCollectionId, conditionId, partition, amount);
    }

    function getPositionId(
        address collateralToken,
        bytes32 parentCollectionId,
        bytes32 conditionId,
        uint256 index
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(collateralToken, parentCollectionId, conditionId, index));
    }
}
