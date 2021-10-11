// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol';
import './interfaces/IToken.sol';
import './abstracts/Pausable.sol';

contract JanglesStake is OwnableUpgradeable, Pausable {
    event WithdrawRewards(address account, uint256 reward);
    event WithdrawNFTs(address account, uint16[] tokenIds);
    event DepositNFTs(address account, uint16[] tokenIds);

    struct User {
        uint128 rewardDebt;
        uint128 lastActionTime;
        uint16[] tokenIds;
    }

    uint256 rewardPerDay;
    IToken rewardToken;
    IERC721Upgradeable bojangles;
    mapping(address => User) users;

    //** Initialize functions */
    function initialize(
        address _rewardToken,
        address _bojangles,
        uint256 _rewardPerDay
    ) public initializer {
        rewardToken = IToken(_rewardToken);
        bojangles = IERC721Upgradeable(_bojangles);
        rewardPerDay = _rewardPerDay;
    }

    function deposit(uint16[] calldata tokenIds) public whenNotPaused {
        User storage user = users[msg.sender];

        if (user.lastActionTime != 0) {
            user.rewardDebt = uint128(
                getReward(
                    user.lastActionTime,
                    user.tokenIds.length,
                    user.rewardDebt
                )
            );
        }
        user.lastActionTime = uint64(block.timestamp);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(
                bojangles.ownerOf(tokenIds[i]) == msg.sender,
                'You do not own this token'
            );
            bojangles.safeTransferFrom(msg.sender, address(this), tokenIds[i]);
            user.tokenIds.push(tokenIds[i]);
        }

        emit DepositNFTs(msg.sender, tokenIds);
    }

    function withdrawNfts() public whenNotPaused {
        User storage user = users[msg.sender];
        require(user.tokenIds.length != 0, 'No nfts to withdraw');

        user.rewardDebt = uint128(
            getReward(
                user.lastActionTime,
                user.tokenIds.length,
                user.rewardDebt
            )
        );

        for (uint256 i = 0; i < user.tokenIds.length; i++) {
            bojangles.safeTransferFrom(
                address(this),
                msg.sender,
                user.tokenIds[i]
            );
        }

        emit WithdrawNFTs(msg.sender, user.tokenIds);

        delete user.tokenIds;
        user.lastActionTime = uint64(block.timestamp);
    }

    function withdrawAll() public whenNotPaused {
        withdrawNfts();
        withdrawRewards();
    }

    function withdrawRewards() public whenNotPaused {
        User storage user = users[msg.sender];
        require(user.tokenIds.length != 0 || user.rewardDebt != 0, 'No user');

        uint256 rewardAmount =
            getRewardInternal(
                uint256(user.lastActionTime),
                uint256(user.tokenIds.length),
                uint256(user.rewardDebt)
            );

        require(rewardAmount > 0, 'No rewards to withdraw');

        user.rewardDebt = 0;
        user.lastActionTime = uint64(block.timestamp);

        rewardToken.mint(msg.sender, rewardAmount);

        emit WithdrawRewards(msg.sender, rewardAmount);
    }

    function getUser(address _addy) public view returns (User memory) {
        return users[_addy];
    }

    function getRewardInternal(
        uint256 lastActionTime,
        uint256 principle,
        uint256 rewardDebt
    ) internal view returns (uint256) {
        uint256 reward =
            (((block.timestamp - lastActionTime) / 86400) * rewardPerDay) *
                principle;

        return reward + rewardDebt;
    }

    function getReward(
        uint256 lastActionTime,
        uint256 principle,
        uint256 rewardDebt
    ) public view returns (uint256) {
        return getRewardInternal(lastActionTime, principle, rewardDebt);
    }
}
