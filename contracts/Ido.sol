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
    uint256 public constant MAX_PER_ACCOUNT = 1 * _BNBDECIMALS;
    uint256 public constant MINIMUM_PER_ACCOUNT = (1 * _BNBDECIMALS) / 10;
    uint256 public constant MAX_RAISED_BNB = 100 * _BNBDECIMALS;
    bool public isActive;

    // Raised */
    uint256 public raisedBNB;
    EnumerableSet.AddressSet private addresses;
    mapping(address => uint256) public raisedByAccount;

    function sendBNB() public payable {
        require(isActive == true, 'IDO: Not active');
        require(msg.value >= MINIMUM_PER_ACCOUNT, 'IDO: Minimum is 0.5 bnb');

        raisedBNB += msg.value;
        raisedByAccount[msg.sender] += msg.value;
        addresses.add(msg.sender);

        if (msg.sender != owner()) {
            require(
                raisedByAccount[msg.sender] <= MAX_PER_ACCOUNT,
                'IDO: Max BNB limit is 20'
            );
        }
    }

    function withdrawBNB() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function setIsActive(bool _active) public onlyOwner {
        isActive = _active;
    }

    function getAllocation()
        public
        view
        onlyOwner
        returns (Allocation[] memory)
    {
        Allocation[] memory allocation = new Allocation[](addresses.length());

        for (uint256 i = 0; i < addresses.length(); i++) {
            allocation[i] = Allocation({
                user: addresses.at(i),
                bnb: raisedByAccount[addresses.at(i)]
            });
        }

        return allocation;
    }
}
