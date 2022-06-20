//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Exchange is ReentrancyGuard {
    address payable owner;
    uint public feePercentage;

    constructor(uint _feePercentage) {
        feePercentage = _feePercentage;
        owner = payable(msg.sender);
    }

    function changeFee(uint _newFeePercentage) public onlyOwner() {
        feePercentage = _newFeePercentage;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "caller is not the owner");
        _;
    }

    function transferOwnership(address payable _newOwner) public virtual onlyOwner {
        owner = _newOwner;
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

        IERC721(_nftContract).setApprovalForAll(address(this), true);
        IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);

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
        Items memory thisItem = mapItems[_nftContract][_tokenId];
        uint fee = (thisItem.price * feePercentage) / 100;
        uint price = thisItem.price;
        address seller = thisItem.seller;
        require(msg.value == price + fee, "please submit the asking price");

        owner.transfer(fee);
        payable(seller).transfer(price);
        IERC721(_nftContract).transferFrom(address(this), msg.sender, _tokenId);


        emit itemSold (
            _nftContract,
            _tokenId,
            seller,
            msg.sender,
            msg.sender,
            price,
            false
        );
    }

    // fetch all items in an nft collection function, this should be done in the client side, 

    /* fetch all marketitems (buy now) in an nft collection function 
    make a 'listed' prop in the struct, know the array size always */

    // still deciding whether to pass in nft/no.of nfts, or just pass in an array, think array is better.
    function buyNow(address _nftContract, uint _totalNfts) public view returns(Items[] memory) {
        //find all listed-true items and filter by nft contract, get the array size
        uint arraySize = 0;
        for (uint i = 1; i < _totalNfts; i++) {
            if (mapItems[_nftContract][i].listed == true) {
                arraySize++;
            }
        }

        // declare memory array 
        Items[] memory items = new Items[](arraySize);

        // return buyNow array, map overthem in JS clientside 
        uint currentIndex = 0;

        for (uint i = 1; i <= _totalNfts; i++) {
            if (mapItems[_nftContract][i].listed == true) {
                items[currentIndex] = mapItems[_nftContract][i];
                currentIndex++;
            }
        }

        return items;
    }


}