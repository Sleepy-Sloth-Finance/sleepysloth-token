import { initNFTContracts, NFTContracts } from './utils/InitNFT';

import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { TestUtil } from './utils/TestUtil';
import Web3 from 'web3';

describe('NFT', async () => {
  let _owner: SignerWithAddress;
  let _user: SignerWithAddress;
  let contracts: NFTContracts;

  beforeEach(async () => {
    const [owner, user] = await ethers.getSigners();
    _owner = owner;
    _user = user;
    contracts = await initNFTContracts({
      owner,
    });
    await contracts.nft.connect(_owner).setIsActive(true);
    await contracts.nft
      .connect(_owner)
      .setRevealedBaseURI('https://google.com/');
  });

  async function runExpects(amount) {
    const owed = await contracts.token.userOwed(_user.address);
    expect(parseFloat(Web3.utils.fromWei(owed.toString()))).to.be.closeTo(
      amount,
      0.01
    );

    await contracts.token.mintForUser(_user.address);
    const tokenBalance = await contracts.token.balanceOf(_user.address);
    expect(
      parseFloat(Web3.utils.fromWei(tokenBalance.toString()))
    ).to.be.closeTo(amount, 0.01);

    const owedAfter = await contracts.token.userOwed(_user.address);
    expect(parseFloat(Web3.utils.fromWei(owedAfter.toString()))).to.be.closeTo(
      0,
      0.01
    );
  }

  describe('One offs', () => {
    it('should not allow a user with no nfts to mint anything....', async () => {
      for (let i = 0; i < 20; i++) {
        TestUtil.increaseTime(86400 * i);
        await runExpects(0);
      }
    });
  });

  describe('Normals N Rare', () => {
    it('should mint correct for 1 rare 1 normal', async () => {
      await contracts.nft.connect(_user).purchase(1, {
        value: ethers.utils.parseEther('0.04'),
      });

      const balance = await contracts.nft.balanceOf(_user.address);
      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await contracts.nft.tokenOfOwnerByIndex(
          _user.address,
          i
        );
        await contracts.token.addRare(tokenId);
      }

      await contracts.nft.connect(_user).purchase(1, {
        value: ethers.utils.parseEther('0.04'),
      });

      TestUtil.increaseTime(86400);

      await runExpects(3.3);
    });
    it('should mint correct for 2 rare 2 normal', async () => {
      await contracts.nft.connect(_user).purchase(2, {
        value: ethers.utils.parseEther('0.08'),
      });

      const balance = await contracts.nft.balanceOf(_user.address);
      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await contracts.nft.tokenOfOwnerByIndex(
          _user.address,
          i
        );
        await contracts.token.addRare(tokenId);
      }

      await contracts.nft.connect(_user).purchase(2, {
        value: ethers.utils.parseEther('0.08'),
      });

      TestUtil.increaseTime(86400);

      await runExpects(7.8);
    });
  });

  describe('Rare Nfts', () => {
    it('should mint correctly for rare nft', async () => {
      await contracts.nft.connect(_user).purchase(1, {
        value: ethers.utils.parseEther('0.04'),
      });

      const balance = await contracts.nft.balanceOf(_user.address);
      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await contracts.nft.tokenOfOwnerByIndex(
          _user.address,
          i
        );
        await contracts.token.addRare(tokenId);
      }

      TestUtil.increaseTime(86400);

      await runExpects(2);
    });

    it('should mint correctly for rare 3 nft', async () => {
      await contracts.nft.connect(_user).purchase(3, {
        value: ethers.utils.parseEther('0.12'),
      });

      const balance = await contracts.nft.balanceOf(_user.address);
      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await contracts.nft.tokenOfOwnerByIndex(
          _user.address,
          i
        );
        await contracts.token.addRare(tokenId);
      }

      TestUtil.increaseTime(86400);

      await runExpects(7.2);
    });

    it('should mint correctly for rare 5 nft', async () => {
      await contracts.nft.connect(_user).purchase(5, {
        value: ethers.utils.parseEther('0.20'),
      });

      const balance = await contracts.nft.balanceOf(_user.address);
      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await contracts.nft.tokenOfOwnerByIndex(
          _user.address,
          i
        );
        await contracts.token.addRare(tokenId);
      }

      TestUtil.increaseTime(86400);

      await runExpects(14);
    });

    it('should mint correctly for rare 11 nft', async () => {
      await contracts.nft.connect(_user).purchase(11, {
        value: ethers.utils.parseEther('0.44'),
      });

      const balance = await contracts.nft.balanceOf(_user.address);
      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await contracts.nft.tokenOfOwnerByIndex(
          _user.address,
          i
        );
        await contracts.token.addRare(tokenId);
      }

      TestUtil.increaseTime(86400);

      await runExpects(44);
    });
  });

  describe('Normal Nfts', () => {
    it('should mint correctly for normal nft', async () => {
      await contracts.nft.connect(_user).purchase(1, {
        value: ethers.utils.parseEther('0.04'),
      });

      TestUtil.increaseTime(86400);

      await runExpects(1);
    });

    it('should mint correctly for 3 normal nft', async () => {
      await contracts.nft.connect(_user).purchase(3, {
        value: ethers.utils.parseEther('0.12'),
      });

      TestUtil.increaseTime(86400);

      await runExpects(3.6);
    });

    it('should mint correctly for 5 normal nft', async () => {
      await contracts.nft.connect(_user).purchase(5, {
        value: ethers.utils.parseEther('0.20'),
      });

      TestUtil.increaseTime(86400);

      await runExpects(7);
    });

    it('should mint correctly for 11 normal nft', async () => {
      await contracts.nft.connect(_user).purchase(11, {
        value: ethers.utils.parseEther('0.44'),
      });

      TestUtil.increaseTime(86400);

      await runExpects(22);
    });
  });
});
