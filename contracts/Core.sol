//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Core is ReentrancyGuard {

    uint256 public creatorCount;
    uint256 public tokenCount;
    address payable public owner;
    uint8 public feePercentage;


    constructor(uint8 _feePercentage) {
        owner = payable(msg.sender);
        feePercentage = _feePercentage;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "caller is not the owner");
        _;
    }

    function transferOwnership(address payable _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    function changeFee(uint8 _newFeePercentage) public onlyOwner() {
        feePercentage = _newFeePercentage;
    }

    // struct for items
    struct Item {
        uint itemId;
        IERC721 nftAddress;
        uint tokenId;
        address payable creator;
        address payable seller;
        address owner;
        uint price;
        bool listed;
    }

    // struct for creators?
    struct Creator {
        uint creatorId;
        uint currentItemId;
        address payable creator;
        bool hasOwnPage;
    }

    event AddCreator (
        uint creatorId,
        address indexed creator,
        bool hasOwnPage
    );

    event AddOwnPage (
        uint creatorId,
        address indexed creator
    );


    // mapping for creators / items
    mapping(uint256 => Creator) private idToCreator;
    mapping(address => Creator) private addressToCreator;
    mapping(uint256 => Item) private idToItem;
 
    mapping(address => mapping(uint256 => Item)) private creatorToItem;


    // change ownership for creators


    // create fan page
    function registerCreator() public {
        creatorCount++;
        idToCreator[creatorCount] = Creator (
            creatorCount,
            0,
            payable(msg.sender),
            false
        );
        addressToCreator[msg.sender] = Creator (
            creatorCount,
            0,
            payable(msg.sender),
            false
        );
        emit AddCreator (
            creatorCount,
            payable(msg.sender),
            false
        );
        // log this into the mapping, basically everything onchain is too keep record, what needs to be recorded?
    }

    function registerCreatorOwnPage() public {
        addressToCreator[msg.sender].hasOwnPage = true;
        uint creatorId = addressToCreator[msg.sender].creatorId;
        idToCreator[creatorId].hasOwnPage = true;

        emit AddOwnPage (
            creatorId,
            msg.sender
        );
    }

    function listItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        registerCreator();
        tokenCount++;
        idToItem[tokenCount] = Item (
            tokenCount,
            _nft,
            _tokenId,
            payable(msg.sender),
            payable(msg.sender),
            msg.sender,
            _price,
            true
        );
        Creator storage creator = addressToCreator[msg.sender];
        creator.currentItemId++;
        creatorToItem[msg.sender][creator.currentItemId] = Item (
            tokenCount,
            _nft,
            _tokenId,
            payable(msg.sender),
            payable(msg.sender),
            msg.sender,
            _price,
            true
        );

        _nft.transferFrom(msg.sender, address(this), tokenCount);
    }

    function cancelListing(uint _tokenId) public {
        idToItem[_tokenId].listed = false;
    }

    function sale(address _nft, uint _tokenId) payable public {
        Item storage item = idToItem[_tokenId];
        require(item.listed == true, "not listed");
        uint price = item.price;
        uint fee = (price * feePercentage) / 100;
        require(msg.value == price + fee, "not enough balance");
        payable(item.seller).transfer(price);
        payable(owner).transfer(fee);
        IERC721(_nft).transferFrom(address(this), msg.sender, _tokenId);
        item.owner = msg.sender;
        item.listed = false;
    }

    // list item / cancel listing

    // sale 

    // sorting: nfts owned, transaction history, manage listings/bids

    function fetchBrowse() public view returns (Item[] memory) {
        Item[] memory items = new Item[](tokenCount);
        for (uint i = 0; i < tokenCount; i++) {
            if (idToItem[i + 1].listed == true) {
                items[i] = idToItem[i + 1];
            }
        }
        return items;
    }

    function fetchMyNFTs(address _address) public view returns (Item[] memory) {
        Creator storage creator = addressToCreator[_address];
        Item[] memory items = new Item[](creator.currentItemId);
        for (uint i = 0; i < creator.currentItemId; i++) {
            if (creatorToItem[_address][i + 1].owner == _address) {
                items[i] = creatorToItem[_address][i + 1];
            }
        }
        return items;
    }

}