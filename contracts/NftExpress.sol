// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract NftExpress is ERC1155 {
    uint fTokenId;
    uint nfTokenId;
    address owner;
    uint sellingFTokenIndex;

    struct FTMetaData {
        uint tokenId;
        uint timestamp;
        string name;
        string symbol;
        uint supply;
        uint price;
        uint usersOwned;
        uint available;
    }

    struct NFTMetaData {
        address owner;
        uint tokenId;
        uint timestamp;
        string tokenUri;
        uint price;
        bool isDeleted;
        bool sell;
    }

    struct FToken {
        uint id;
        address owner;
        string name;
        uint tokenId;
        uint amount;
        bool sell;
        bool isBuyer;
        address buyer;
    }

    mapping(uint => FTMetaData) public FTokens;
    mapping(uint => NFTMetaData) public NFTokens;
    mapping(address => string) public names;
    mapping(address => bool) public register;
    mapping(address => mapping(uint => FToken)) public sellingFTokens;
    mapping(uint => FToken) public sellingFTokensData;

    mapping(address => NFTMetaData[]) public NFTOwnershipRecord;
    mapping(uint => string) public nftUri;

    modifier IsOwner {
        require(owner == msg.sender, "You are not owner!");
        _;
    }
    
    modifier IsAuthenticated  {
        require(register[msg.sender], "User has to register first!");
        _;
    }

    constructor(string memory _baseTokenUri) ERC1155(_baseTokenUri) {
        owner = msg.sender;
        FTokens[0] = FTMetaData(0, block.timestamp, "PixelCoin", "PXC", 100, 20000, 0, 100);
        FTokens[1] = FTMetaData(1, block.timestamp, "StarDust", "STD", 200, 10000, 0, 200);
        FTokens[2] = FTMetaData(2, block.timestamp, "CrystalBit", "CBT", 50, 30000, 0, 50);
        fTokenId = 3;
        nfTokenId = 0;
    }

    function registerUser(string memory _name) public returns(string memory) {
        require(!register[msg.sender], "User already has an account!");
        names[msg.sender] = _name;
        register[msg.sender] = true;
        return _name;
    }

    function loginUser() public view returns(string memory) {
        require(register[msg.sender], "User doesn't have an account!");
        return names[msg.sender];
    }

    function addNft(string memory _uri, uint _price) public {
        require(_price != 0, "Price cannot be 0");
        NFTokens[nfTokenId] = NFTMetaData(msg.sender, nfTokenId, block.timestamp, _uri, _price, false, false);
        NFTOwnershipRecord[msg.sender].push(NFTMetaData(msg.sender, nfTokenId, block.timestamp, _uri, _price, false, false));
        nfTokenId++;
    }

    function buyToken(uint _tokenId, uint _amount) public payable IsAuthenticated{
        require(fTokenId > _tokenId, "No such token exist!");
        FTMetaData memory fToken = FTokens[_tokenId];
        require(fToken.available >= _amount, "Insufficient token balance!");

        uint payableAmount = fToken.price * _amount;
        require(payableAmount <= msg.value, "Not enough money to buy tokens!" );

        FTokens[_tokenId].available -= _amount;
        FTokens[_tokenId].usersOwned += _amount;
        (bool sent, ) = payable(address(this)).call{ value: payableAmount}("");
        _mint(msg.sender, _tokenId, _amount, "");

        if(msg.value > payableAmount) {
            payable(msg.sender).transfer(msg.value - payableAmount);
        }
    }

    function getFTokens() public view returns(FTMetaData[] memory) {
        FTMetaData[] memory fungibleTokens = new FTMetaData[](fTokenId);
        for(uint i=0; i<fTokenId; i++){
            fungibleTokens[i] = FTokens[i];
        }
        return fungibleTokens;
    }

    function getNFTokens() public view returns(NFTMetaData[] memory) {
        NFTMetaData[] memory nonFungibleTokens = new NFTMetaData[](nfTokenId);
        for(uint i=0; i<nfTokenId; i++){
            nonFungibleTokens[i] = NFTokens[i];
        }
        return nonFungibleTokens;
    }

    function getSellingNFts() public view returns(NFTMetaData[] memory) {
        uint actualLength = 0;
        for(uint i=0; i<nfTokenId; i++){
            if(NFTokens[i].sell) actualLength++;
        }
        NFTMetaData[]  memory filteredNftMetaData = new NFTMetaData[](actualLength);
        uint count = 0;
        for(uint i=0; i<nfTokenId; i++){
            if(NFTokens[i].sell){
                filteredNftMetaData[count++] = NFTokens[i];
            }
        }
        return filteredNftMetaData;
    } 

    function sellMyNft(uint _nfTokenId, uint _price) public {
        require(_nfTokenId < nfTokenId, "No such token exist!");
        require(NFTokens[_nfTokenId].owner == msg.sender, "You are not the owner of this token!");

        NFTokens[_nfTokenId].sell = true;
        NFTokens[_nfTokenId].price = _price;
    }

    function getMyNFTokens() public view returns(NFTMetaData[] memory) {
        uint actualLength = 0;
        for(uint i=0; i<nfTokenId; i++){
            if(NFTokens[i].owner == msg.sender) actualLength++;
        }
        NFTMetaData[]  memory filteredNftMetaData = new NFTMetaData[](actualLength);
        uint count = 0;
        for(uint i=0; i<nfTokenId; i++){
            if(NFTokens[i].owner == msg.sender){
                filteredNftMetaData[count++] = NFTokens[i];
            }
        }
        return filteredNftMetaData;
    }

    function cancelSellNft(uint _nfTokenId) public {
        require(_nfTokenId < nfTokenId, "No such token exist!");
        require(NFTokens[_nfTokenId].owner == msg.sender, "You don't have such NFT!");
        NFTokens[_nfTokenId].sell = false;
    }

    function buyNft(uint _nfTokenId) public payable {
        require(_nfTokenId < nfTokenId, "No such token exist!");
        NFTMetaData memory nft = NFTokens[_nfTokenId];
        require(nft.price <= msg.value, "You don't have enough money to purchase!");
        (bool sent, ) = payable(address(nft.owner)).call{ value: nft.price}("");
        NFTokens[_nfTokenId].owner = msg.sender;
        NFTokens[_nfTokenId].sell = false;

        if(msg.value > nft.price) {
            payable(msg.sender).transfer(msg.value - nft.price);
        }
    }

    function getMyBalance(uint _tokenId) public IsAuthenticated view returns(uint) {
        require(fTokenId > _tokenId, "No such token exist!");
        return balanceOf(msg.sender, _tokenId);
    }

    function sellFToken(uint _tokenId, uint _amount) public {
        require(_tokenId < fTokenId, "No such token exist!");
        require(balanceOf(msg.sender, _tokenId) >= _amount, "Insufficient token balance!");
        require(!sellingFTokens[msg.sender][_tokenId].sell, "You are already selling this token");

        FToken memory ftoken = FToken(sellingFTokenIndex, msg.sender, names[msg.sender], _tokenId, _amount, true, false, msg.sender);
        sellingFTokens[msg.sender][_tokenId] = ftoken;

        sellingFTokensData[sellingFTokenIndex] = ftoken;
        sellingFTokenIndex++;
    }

    function cancelSellFToken(uint _tokenId) public {
        require(_tokenId < fTokenId, "No such token exist!");
        sellingFTokens[msg.sender][_tokenId].sell = false;

        for(uint i=0; i<sellingFTokenIndex; i++){
            if(sellingFTokensData[i].owner == msg.sender && sellingFTokensData[i].tokenId == _tokenId) {
                sellingFTokensData[i].sell = false;
            }
        }
    }

    function getMySellingFts() public view returns(FToken[] memory){
        uint length = 0;

        for(uint i=0; i<sellingFTokenIndex; i++){
            if(sellingFTokensData[i].owner == msg.sender && ( sellingFTokensData[i].sell || sellingFTokensData[i].isBuyer)) {
                length++;
            }
        }

        FToken[] memory ftokenData = new FToken[](length);
        uint index = 0;
        for(uint i=0; i<sellingFTokenIndex; i++){
            if(sellingFTokensData[i].owner == msg.sender && ( sellingFTokensData[i].sell || sellingFTokensData[i].isBuyer)) {
                ftokenData[index++] = sellingFTokensData[i];
            }
        }

        return ftokenData;
    }

    function acceptTransaction(uint _sellingFTokenIndex, bool isAccept) public {
        FToken memory ftoken = sellingFTokensData[_sellingFTokenIndex];
        require(ftoken.owner == msg.sender, "You are not the owner!");
        require(ftoken.buyer != msg.sender, "no buyer!");

        sellingFTokensData[_sellingFTokenIndex].sell = false;
        sellingFTokensData[_sellingFTokenIndex].isBuyer = false;
        sellingFTokens[msg.sender][ftoken.tokenId].sell = false;
        sellingFTokens[msg.sender][ftoken.tokenId].isBuyer = false;

        if(isAccept) {
            safeTransferFrom(msg.sender, ftoken.buyer, ftoken.tokenId, ftoken.amount, "");
            payable(msg.sender).transfer(ftoken.amount * FTokens[ftoken.tokenId].price);
        }else {
            payable(sellingFTokens[msg.sender][ftoken.tokenId].buyer).transfer(ftoken.amount * FTokens[ftoken.tokenId].price);
        }

    }

    function buyTokenFromSeller(address payable _seller, uint _tokenId) public payable {
        FToken memory tokenData = sellingFTokens[_seller][_tokenId];
        require(tokenData.sell, "The seller is not selling this token!");

        uint price = FTokens[tokenData.tokenId].price * tokenData.amount;
        require(price <= msg.value, "Insufficient eth to buy tokens!");

        (bool sent, ) = payable(address(this)).call{ value: price}("");

        sellingFTokens[_seller][_tokenId].sell = false;
        sellingFTokens[_seller][_tokenId].isBuyer = true;
        sellingFTokens[_seller][_tokenId].buyer = msg.sender;

        for(uint i=0; i<sellingFTokenIndex; i++){
            if(sellingFTokensData[i].owner == _seller && sellingFTokensData[i].tokenId == _tokenId) {
                sellingFTokensData[i].sell = false;
                sellingFTokensData[i].isBuyer = true;
                sellingFTokensData[i].buyer = msg.sender;
            }
        }

        if(msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }

    function getSellingFts() public view returns(FToken[] memory) {
        uint length = 0;
        for(uint i=0; i<sellingFTokenIndex; i++){
            if(sellingFTokensData[i].sell){
                length++;
            }
        }

        FToken[] memory ftokenData = new FToken[](length);
        uint index = 0;
        
        for(uint i=0; i<sellingFTokenIndex; i++){
            if(sellingFTokensData[i].sell){
                ftokenData[index++] = sellingFTokensData[i];
            }
        }

        return ftokenData;
    }
}
