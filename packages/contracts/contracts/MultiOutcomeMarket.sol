// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ConditionalTokens.sol";

contract MultiOutcomeMarket {
    struct Market {
        string question;
        string[] outcomes;
        uint256 endTime;
        address oracle;
        bool resolved;
        uint256 winningOutcome;
        MarketType marketType;
    }

    enum MarketType { BINARY, CATEGORICAL, SCALAR }

    mapping(bytes32 => Market) public markets;
    mapping(bytes32 => mapping(uint256 => uint256)) public outcomePrices;
    
    ConditionalTokens public conditionalTokens;
    
    event MarketCreated(bytes32 indexed marketId, string question, MarketType marketType, uint256 outcomeCount);
    event MarketResolved(bytes32 indexed marketId, uint256 winningOutcome);

    constructor(address _conditionalTokens) {
        conditionalTokens = ConditionalTokens(_conditionalTokens);
    }

    function createCategoricalMarket(
        string calldata question,
        string[] calldata outcomes,
        uint256 endTime,
        address oracle
    ) external returns (bytes32 marketId) {
        require(outcomes.length >= 3, "Categorical markets need 3+ outcomes");
        
        marketId = keccak256(abi.encodePacked(question, block.timestamp, msg.sender));
        
        markets[marketId] = Market({
            question: question,
            outcomes: outcomes,
            endTime: endTime,
            oracle: oracle,
            resolved: false,
            winningOutcome: 0,
            marketType: MarketType.CATEGORICAL
        });

        emit MarketCreated(marketId, question, MarketType.CATEGORICAL, outcomes.length);
    }

    function createScalarMarket(
        string calldata question,
        uint256 minValue,
        uint256 maxValue,
        uint256 endTime,
        address oracle
    ) external returns (bytes32 marketId) {
        marketId = keccak256(abi.encodePacked(question, block.timestamp, msg.sender));
        
        string[] memory scalarOutcomes = new string[](2);
        scalarOutcomes[0] = string(abi.encodePacked("Below ", uint2str(minValue)));
        scalarOutcomes[1] = string(abi.encodePacked("Above ", uint2str(maxValue)));
        
        markets[marketId] = Market({
            question: question,
            outcomes: scalarOutcomes,
            endTime: endTime,
            oracle: oracle,
            resolved: false,
            winningOutcome: 0,
            marketType: MarketType.SCALAR
        });

        emit MarketCreated(marketId, question, MarketType.SCALAR, 2);
    }

    function resolveMarket(bytes32 marketId, uint256 winningOutcome) external {
        Market storage market = markets[marketId];
        require(msg.sender == market.oracle, "Only oracle can resolve");
        require(!market.resolved, "Already resolved");
        require(winningOutcome < market.outcomes.length, "Invalid outcome");
        
        market.resolved = true;
        market.winningOutcome = winningOutcome;
        
        emit MarketResolved(marketId, winningOutcome);
    }

    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}