import { initTestSmartContracts } from './utils/InitTestContracts';

import { Token, IDO, Airdrop } from '../typechain/index';
import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { TestUtil } from './utils/TestUtil';

describe('Token', async () => {
  let token: Token;
  let ido: IDO;
  let airdrop: Airdrop;
  let _owner: SignerWithAddress;
  let accounts: SignerWithAddress[];

  beforeEach(async () => {
    const [
      owner,
      account1,
      account2,
      account3,
      account4,
    ] = await ethers.getSigners();
    accounts = [account1, account2, account3, account4];
    const contracts = await initTestSmartContracts({
      owner,
    });
    _owner = owner;
    token = contracts.token;
    ido = contracts.ido;
    airdrop = contracts.airdrop;

    token._setPaused(false);
    token._setTimeLimited(false);
    token._setBurnFee('200');
    token._setTaxFee('300');
  });

  describe('initialize', () => {
    it.only('should multisend', async () => {
      await token
        .connect(_owner)
        .approve(airdrop.address, ethers.utils.parseEther('100000000000'));

      const balanceBfore = await token.balanceOf(accounts[0].address);
      expect(balanceBfore.toString()).to.eq('0');

      await airdrop
        .connect(_owner)
        .bulkSendToken(
          token.address,
          [accounts[0].address, accounts[1].address, accounts[2].address],
          [1000, 1000, 1000]
        );

      const balance = await token.balanceOf(accounts[0].address);

      expect(balance.toNumber()).to.be.greaterThan(0);
      console.log(balance.toString());
      console.log(balanceBfore.toString());
    });

    it('should only allow 0.2 bnb transfer', async () => {
      const [account1, account2] = accounts;

      await expect(
        ido.connect(account1).sendBNB({
          value: ethers.utils.parseEther('0.2'),
        })
      ).to.be.revertedWith('Account is not whitelisted');

      await expect(
        ido.connect(account1).setWhitelist([account1.address])
      ).to.be.revertedWith('caller is not the owner');

      await ido
        .connect(_owner)
        .setWhitelist([account1.address, account2.address]);

      await expect(
        ido.connect(account1).sendBNB({
          value: ethers.utils.parseEther('20'),
        })
      ).to.be.revertedWith('0.2 BNB is max/min limit');
      await expect(
        ido.connect(account1).sendBNB({
          value: ethers.utils.parseEther('0.1'),
        })
      ).to.be.revertedWith('0.2 BNB is max/min limit');

      await ido.connect(account1).sendBNB({
        value: ethers.utils.parseEther('0.2'),
      });
      await ido.connect(account2).sendBNB({
        value: ethers.utils.parseEther('0.2'),
      });

      await expect(
        ido.connect(account1).sendBNB({
          value: ethers.utils.parseEther('0.2'),
        })
      ).to.be.revertedWith('Account already sent');

      const addresses = await ido.connect(_owner).getAddresses();
      console.log(addresses);
    });

    it('should get allocation with 100s of wallets', async () => {
      const accounts = await ethers.getSigners();

      for (let i = 0; i < accounts.length; i++) {
        console.log(i);
        await ido.connect(accounts[i]).sendBNB({
          value: ethers.utils.parseEther('2'),
        });
      }

      const allo = await ido.connect(_owner).getAllocation();
    });

    // it('should allow to send BNB less then or equal to 20', async () => {
    //   const [account1, account2] = accounts;

    //   await ido.connect(account1).sendBNB({
    //     value: ethers.utils.parseEther('0.5'),
    //   });
    //   await ido.connect(account2).sendBNB({
    //     value: ethers.utils.parseEther('0.5'),
    //   });
    //   await ido.connect(account2).sendBNB({
    //     value: ethers.utils.parseEther('0.2'),
    //   });

    //   const set = await ido.connect(_owner).getAllocation();
    // });
    // it('should not be able to send more then 1 bnb per account', async () => {
    //   const [account1] = accounts;
    //   await expect(
    //     ido.connect(account1).sendBNB({
    //       value: ethers.utils.parseEther('1.1'),
    //     })
    //   ).to.be.revertedWith('Max BNB limit is 1');
    // });

    it('should init the contract correctly', async () => {
      // const name = await token.name();
      // const symbol = await token.symbol();
      const supply = await token.totalSupply();
      const decimals = await token.decimals();
      const owner = await token.owner();
      const balanceOfOwner = await token.balanceOf(owner);

      // expect(name).to.be.equal('Sleepy Sloth');
      // expect(symbol).to.be.equal('SLEEPY');
      expect(decimals.toString()).to.be.equal('8');
      expect(supply.toString()).to.be.equal('100000000000000000000000');
      expect(owner).to.be.equal(_owner.address);
      expect(balanceOfOwner.toString()).to.be.equal(supply.toString());
    });

    it('should exclude account', async () => {
      const [account1] = accounts;
      const supply = await token.totalSupply();
      await token.connect(_owner).excludeAccount(_owner.address);

      // /** Set Transfers */
      await token.connect(_owner).transfer(account1.address, '100');
      const ownerBalance = await token.balanceOf(_owner.address);
      const account1Balance = await token.balanceOf(account1.address);

      expect(ownerBalance.toString()).to.be.equal(supply.sub('100').toString());
      expect(account1Balance.toString()).to.be.equal('98');
    });

    it('ecxlusion', async () => {
      const [account1, account2, account3, account4] = accounts;

      await token.excludeAccount(_owner.address);
      await token.excludeAccount(account1.address);
      await token.excludeAccount(account2.address);
      await token.excludeAccount(account3.address);
      await token.excludeAccount(account4.address);

      await token.connect(_owner).transfer(account1.address, '100');

      // const balanceOf = await token.balanceOf(account1.address);
    });

    it('should frictionless yield to accounts that own SLEEPY but not to accounts that do not', async () => {
      const [account1, account2, account3, account4] = accounts;
      await token.connect(_owner)._setPaused(false);

      await token.connect(_owner).excludeAccount(_owner.address);

      await token.connect(_owner).transfer(account1.address, '1000');
      TestUtil.increaseTime(900);
      await token.connect(_owner).transfer(account2.address, '1000');
      TestUtil.increaseTime(900);
      await token.connect(account1).transfer(account3.address, '100');

      const balanceOf1 = await token.balanceOf(account1.address);
      const balanceOf2 = await token.balanceOf(account2.address);
      const balanceOf3 = await token.balanceOf(account3.address);
      const balanceOf4 = await token.balanceOf(account4.address);

      expect(balanceOf1.toString()).to.be.equal('896');
      expect(balanceOf2.toString()).to.be.equal('966');
      expect(balanceOf3.toString()).to.be.equal('95');
      expect(balanceOf4.toString()).to.be.equal('0');
    });

    it('should fail on blacklisted accounts transferring', async () => {
      const [account1, account2] = accounts;

      await token.connect(_owner)._setPaused(false);
      await token.connect(_owner).transfer(account1.address, '1000');
      await token
        .connect(_owner)
        ._setBlackListedAddress(account1.address, true);

      await expect(
        token.connect(account1).transfer(account2.address, '100')
      ).to.be.revertedWith('Account is blacklisted from transferring');
    });
  });
});
