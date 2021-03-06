//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract McNFTenjoyer is ERC721URIStorage {
    address payable owner;
    uint public tokenId;

    constructor() ERC721("McNFTenjoyer", "MFer") {
        owner = payable(msg.sender);
    }

    function mint(string memory tokenURI) public returns(uint) {
        tokenId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "caller is not the owner");
        _;
    }

    function transferOwnership(address payable _newOwner) public virtual onlyOwner {
        owner = _newOwner;
    }
    // do royalties 

}
