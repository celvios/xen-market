export const ConditionalTokensABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "stakeholder",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "collateralToken",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "parentCollectionId",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "conditionId",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "uint256[]",
                "name": "partition",
                "type": "uint256[]"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "PositionSplit",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "collateralToken",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "parentCollectionId",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "conditionId",
                "type": "bytes32"
            },
            {
                "internalType": "uint256[]",
                "name": "partition",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "splitPosition",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "collateralToken",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "parentCollectionId",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "conditionId",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "getPositionId",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    }
];
