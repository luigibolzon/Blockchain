// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ML {
    struct Product {
        uint256 IDProduct;
        uint256 price;
        string name;
    }

    struct Order {
        uint256 IDOrder;
        uint256 releaseTime;
        string buyerName;
        string status;
    }

    mapping(uint256 => Product) public products;
    mapping(uint256 => Order) private orders;
    mapping(uint256 => bool) private allowedCEPs;

    Order[] private listOrders;
    Product[] public listProducts;

    address private owner;

    event OrderCreated(uint indexed IDOrder, uint256 CEP, string Name);
    event CancelledOrder(uint indexed IDOrder);
    event ProductCreated(uint indexed IDProduct , string Name);

    constructor(uint256[] memory _allowedCEPs) {
        owner = msg.sender;
        for (uint256 x; x < _allowedCEPs.length; x++) {
            allowedCEPs[_allowedCEPs[x]] = true;
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Sender not allowed");
        _;
    }

    modifier allowedCEP(uint256 _cep) {
        require(allowedCEPs[_cep], "CEP not allowed");
        _;
    }

    function addProduct(
        uint256 _id,
        uint256 _price,
        string memory _name
    ) public onlyOwner {
        Product memory newProduct;
        newProduct.IDProduct = _id;
        newProduct.price = _price;
        newProduct.name = _name;
        products[_id] = newProduct;
        listProducts.push(newProduct);
        emit ProductCreated(_id,_name);
    }

    function addOrder(
        uint256 _idOrder,
        uint256 _cep,
        string memory _buyerName
    ) public allowedCEP(_cep) returns (string memory) {
        Order memory newOrder;
        newOrder.IDOrder = _idOrder;
        newOrder.buyerName = _buyerName;
        newOrder.status = "new";
        newOrder.releaseTime = block.number + 5;
        orders[_idOrder] = newOrder;
        listOrders.push(newOrder);
        emit OrderCreated(_idOrder, _cep, _buyerName);
        return "Order Created";
    }

    function cancelOrder(uint256 _idOrder) public onlyOwner {
        orders[_idOrder].status = "cancelled";
        emit CancelledOrder(_idOrder);
    }

    function checkAllowedCEP(uint256 _CEP)
        public
        view
        onlyOwner
        returns (bool)
    {
        return allowedCEPs[_CEP];
    }

    function getOrders() public view onlyOwner returns (Order[] memory) {
        return listOrders;
    }

    function getProducts() public view returns (Product[] memory) {
        return listProducts;
    }
}
