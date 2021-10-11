// SPDX-License-Identifier: MIT
/**

   o__ __o      o                                                   
   /v     v\    <|>                                                  
  />       <\   / \                                                  
 _\o____        \o/    o__  __o     o__  __o   \o_ __o     o      o  
      \_\__o__   |    /v      |>   /v      |>   |    v\   <|>    <|> 
            \   / \  />      //   />      //   / \    <\  < >    < > 
  \         /   \o/  \o    o/     \o    o/     \o/     /   \o    o/  
   o       o     |    v\  /v __o   v\  /v __o   |     o     v\  /v   
   <\__ __/>    / \    <\/> __/>    <\/> __/>  / \ __/>      <\/>    
                                               \o/            /      
                                                |            o       
                                               / \        __/>       

                    o__ __o      o                 o       o         
                   /v     v\    <|>               <|>     <|>        
                  />       <\   / \               < >     / >        
                 _\o____        \o/    o__ __o     |      \o__ __o   
                      \_\__o__   |    /v     v\    o__/_   |     v\  
                            \   / \  />       <\   |      / \     <\ 
                  \         /   \o/  \         /   |      \o/     o/ 
                   o       o     |    o       o    o       |     <|  
                   <\__ __/>    / \   <\__ __/>    <\__   / \    / \ 
                                                     
                                                     
 */

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';

contract IDO is Ownable {
    using Address for address;
    using EnumerableSet for EnumerableSet.AddressSet;
    /** Structs */
    struct Allocation {
        address user;
        uint256 bnb;
    }

    // Constants */
    uint256 private constant _BNBDECIMALS = 10**uint256(18);
    uint256 public constant PER_ACCOUNT = (2 * _BNBDECIMALS) / 10;
    uint256 public constant MAX_RAISED_BNB = 23 * _BNBDECIMALS;
    bool public isActive;

    // Raised */
    uint256 public raisedBNB;
    EnumerableSet.AddressSet private addresses;
    mapping(address => bool) public raisedByAccount;
    mapping(address => bool) public whitelist;

    function sendBNB() public payable {
        require(isActive == true, 'IDO: Not active');
        require(
            whitelist[msg.sender] == true,
            'IDO: Account is not whitelisted'
        );
        require(msg.value == PER_ACCOUNT, 'IDO: 0.2 BNB is max/min limit');
        require(
            raisedByAccount[msg.sender] == false,
            'BEP: Account already sent'
        );
        raisedBNB += msg.value;
        require(
            raisedBNB <= MAX_RAISED_BNB,
            'IDO: Max Raised BNB is 23, this amount goes above 23'
        );

        raisedByAccount[msg.sender] = true;
        addresses.add(msg.sender);
    }

    function withdrawBNB() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function setIsActive(bool _active) external onlyOwner {
        isActive = _active;
    }

    function getAllocation()
        external
        view
        onlyOwner
        returns (Allocation[] memory)
    {
        Allocation[] memory allocation = new Allocation[](addresses.length());

        for (uint256 i = 0; i < addresses.length(); i++) {
            allocation[i] = Allocation({
                user: addresses.at(i),
                bnb: PER_ACCOUNT
            });
        }

        return allocation;
    }

    function getAddresses() external view onlyOwner returns (address[] memory) {
        address[] memory _addresses = new address[](addresses.length());
        for (uint256 i = 0; i < addresses.length(); i++) {
            _addresses[i] = addresses.at(i);
        }

        return _addresses;
    }

    function setWhitelist(address[] calldata accounts) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            address account = accounts[i];
            whitelist[account] = true;
        }
    }
}
