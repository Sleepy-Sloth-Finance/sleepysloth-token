import { initNFTContracts, NFTContracts } from './utils/InitNFT';

import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';

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

  describe('initialize', () => {
    it('should initialize', async () => {
      await contracts.nft.connect(_user).purchase(3, {
        value: ethers.utils.parseEther('0.12'),
      });

      const value = await contracts.nft.tokenURI(1);
      expect(value.toString()).to.be.equal('https://google.com/1');

      const name = await contracts.nft.name();
      expect(name.toString()).to.be.equal('Bojangles');

      const symbol = await contracts.nft.symbol();
      expect(symbol.toString()).to.be.equal('Mr_Bo');
    });

    it('should only sell as many as allowedMint', async () => {
      await contracts.nft.connect(_owner).setAllowedMint(1);

      await expect(
        contracts.nft.connect(_user).purchase(3, {
          value: ethers.utils.parseEther('0.12'),
        })
      ).to.be.revertedWith('Purchase would exceed AllowedMint');

      await contracts.nft.connect(_owner).setAllowedMint(3);

      await contracts.nft.connect(_user).purchase(3, {
        value: ethers.utils.parseEther('0.12'),
      });

      const supply = await contracts.nft.totalSupply();
      expect(supply.toString()).to.be.equal('3');
    });

    it.only('should only mint 6969', async () => {
      await contracts.nft.connect(_owner).setAllowedMint(90000);
      await contracts.nft.connect(_owner).setPurchaseLimit(7000);

      for (var i = 0; i < 205; i += 51) {
        console.log(i);
        await contracts.nft.connect(_user).purchase(51, {
          value: ethers.utils.parseEther(`${0.04 * 51}`),
        });
      }

      const supply = await contracts.nft.totalSupply();
      console.log('supply', supply);
    });
  });
});
