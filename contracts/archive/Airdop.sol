// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
/** OpenZeppelin Dependencies Upgradeable */
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

/** Local Interfaces */

contract Airdrop {
    function bulkSendToken(
        address tokenAddr,
        address[] calldata addresses,
        uint256[] calldata amounts
    ) public payable returns (bool success) {
        IERC20 token = IERC20(tokenAddr);

        // transfer token to addresses
        for (uint8 j = 0; j < addresses.length; j++) {
            token.transferFrom(msg.sender, addresses[j], amounts[j]);
        }
        return true;
    }
}
