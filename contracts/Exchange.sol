//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Exchange is Ownable, ReentrancyGuard {

    address payable owner;
    uint public feePercentage;

    constructor(uint _feePercentage) {
        owner = payable(msg.sender);
        feePercentage = _feePercentage;
    }

    function changeFee(uint _newFeePercentage) public onlyOwner() {
        feePercentage = _newFeePercentage;
    }

    struct Items {
        address nftContract;
        uint tokenId;
        address payable seller;
        address payable owner;
        uint price;
        bool listed;
    }

    event itemListed (
        address indexed nftContract,
        uint indexed tokenId,
        address seller,
        address owner,
        uint price,
        bool listed
    );

    event itemSold (
        address indexed nftContract,
        uint indexed tokenId,
        address seller,
        address buyer,
        address owner,
        uint price,
        bool listed
    );

    mapping(address => mapping(uint => Items)) private mapItems;

    // struct for items 

    // list function / event
    function listItem(address _nftContract, uint _tokenId, uint _price) public {
        mapItems[_nftContract][_tokenId] = Items (
            _nftContract,
            _tokenId,
            payable(msg.sender),
            payable(address(this)),
            _price,
            true
        );

        _nftContract.setApprovalForAll(address(this), true);
        _nftContract.transferFrom(msg.sender, address(this), _tokenId);

        emit itemListed (
            _nftContract,
            _tokenId,
            msg.sender,
            address(this),
            _price,
            true
        );
    }

    // sale function / event w buyer
    function sale(address _nftContract, uint _tokenId) public payable {
        Items thisItem = mapItems[_nftContract][_tokenId];
        uint fee = (thisItem.price * feePercentage) / 100;
        uint price = thisItem.price;
        address seller = thisItem.seller;
        require(msg.value == price + fee, "please submit the asking price");

        payable(owner).transfer(fee);
        payable(seller).transfer(price);
        _nftContract.transferFrom(address(this), msg.sender, _tokenId);

        emit sold (
            _nftContract,
            _tokenId,
            seller,
            msg.sender,
            msg.sender,
            price,
            false
        );
    }

    // fetch all items in an nft collection function

    /* fetch all marketitems (buy now) in an nft collection function 
    make a 'listed' prop in the struct, know the array size always */


}

monkey.setapprovalforall()
mayc.setapprovalforall()
mayc.tranfserfrom()
