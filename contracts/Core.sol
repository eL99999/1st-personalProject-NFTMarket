//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Core is ReentrancyGuard {

    uint public creatorCount;

    // struct for items
    struct Item {
        address nftContract;
        uint tokenId;
        address payable creator;
        address payable owner;
        uint price;
        bool listed;
    }

    // struct for creators?
    struct Creator {
        uint creatorId;
        address payable creator;


    }

    // mapping for creators / items
    mapping(uint256 => Creator) private idtoCreator;
    mapping(uint256 => Item) private idtoItem;

    mapping(address => mapping(uint256 => Item)) private idtoExternalItem;


    // change ownership for creators


    // create fan page
    function createPage() public {
        creatorCount++;
        // log this into the mapping, basically everything onchain is too keep record, what needs to be recorded?
    }

    function fetchAllCreatorPages() public view returns (Creator[] memory) {
        Creator[] memory creators = new Creator[](creatorCount);
        for (uint i = 0; i < creatorCount; i++) {
            creators[i] = idtoCreator[i + 1];
        }
        return creators;

    }
    // list item / cancel listing

    // sale 

    // sorting: nfts owned, transaction history, manage listings/bids
}