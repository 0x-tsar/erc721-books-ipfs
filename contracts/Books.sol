// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Books is ERC721Enumerable {
    address public admin;
    uint256 nextTokenId;

    struct BookStruct {
        string title;
        uint256 id;
        uint256 price;
        address owner;
    }

    event bookCreated(string name, uint256 id, uint256 price, address owner);

    mapping(address => mapping(uint256 => BookStruct)) public booksByOwner;

    constructor() ERC721("Books", "BOOK") {}

    function createNewBook(string memory _title, uint256 _price)
        external
        returns (BookStruct memory)
    {
        _safeMint(address(this), nextTokenId);

        BookStruct memory bs = BookStruct({
            title: _title,
            id: nextTokenId,
            price: _price,
            owner: address(this)
        });

        nextTokenId = nextTokenId + 1;
        return bs;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    // retrieve funds?
}
