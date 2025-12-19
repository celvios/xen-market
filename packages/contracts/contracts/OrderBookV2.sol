// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OrderBookV2 {
    struct Order {
        address maker;
        uint256 marketId;
        uint256 outcomeId;
        uint256 amount;
        uint256 price;
        bool isBuy;
        bool filled;
    }

    Order[] public orders;
    mapping(uint256 => bool) public cancelled;

    event OrderPlaced(
        uint256 indexed orderId,
        address indexed maker,
        uint256 marketId,
        uint256 outcomeId,
        uint256 amount,
        uint256 price,
        bool isBuy
    );
    
    event OrderCancelled(uint256 indexed orderId);
    event OrderFilled(uint256 indexed orderId);

    function placeOrder(
        uint256 marketId,
        uint256 outcomeId,
        uint256 amount,
        uint256 price,
        bool isBuy
    ) external returns (uint256) {
        orders.push(Order({
            maker: msg.sender,
            marketId: marketId,
            outcomeId: outcomeId,
            amount: amount,
            price: price,
            isBuy: isBuy,
            filled: false
        }));
        
        uint256 orderId = orders.length - 1;
        emit OrderPlaced(orderId, msg.sender, marketId, outcomeId, amount, price, isBuy);
        return orderId;
    }

    function cancelOrder(uint256 orderId) external {
        require(orders[orderId].maker == msg.sender, "Not order maker");
        require(!orders[orderId].filled, "Order already filled");
        cancelled[orderId] = true;
        emit OrderCancelled(orderId);
    }

    function getOrder(uint256 orderId) external view returns (Order memory) {
        return orders[orderId];
    }

    function getOrderCount() external view returns (uint256) {
        return orders.length;
    }
}
