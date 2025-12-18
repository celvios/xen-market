// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OrderBook {
    struct Order {
        address maker;
        bytes32 positionId;
        uint256 amount;
        uint256 price; // Price in collateral (e.g. 0.5 USDC)
        bool isBuy;
    }

    Order[] public orders;
    mapping(uint256 => bool) public cancelled;

    event OrderPlaced(uint256 indexed orderId, address indexed maker, bytes32 indexed positionId, uint256 amount, uint256 price, bool isBuy);
    event OrderCancelled(uint256 indexed orderId);

    function placeOrder(bytes32 positionId, uint256 amount, uint256 price, bool isBuy) external {
        orders.push(Order({
            maker: msg.sender,
            positionId: positionId,
            amount: amount,
            price: price,
            isBuy: isBuy
        }));
        emit OrderPlaced(orders.length - 1, msg.sender, positionId, amount, price, isBuy);
    }

    function cancelOrder(uint256 orderId) external {
        require(orders[orderId].maker == msg.sender, "Not order maker");
        cancelled[orderId] = true;
        emit OrderCancelled(orderId);
    }
}
