// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MarketFactory {
    address public conditionalTokens;

    event MarketCreated(
        bytes32 indexed marketId,
        string question,
        address indexed creator,
        address oracle,
        uint256 endTime,
        bytes32 conditionId
    );

    constructor(address _conditionalTokens) {
        conditionalTokens = _conditionalTokens;
    }

    function createMarket(
        string calldata question,
        uint256 endTime,
        uint256 numOutcomes,
        address oracle
    ) external returns (bytes32 conditionId) {
        conditionId = keccak256(abi.encodePacked(oracle, question, numOutcomes));
        bytes32 marketId = keccak256(abi.encodePacked(conditionId, block.timestamp));
        
        emit MarketCreated(marketId, question, msg.sender, oracle, endTime, conditionId);
    }
}
