import { initTestSmartContracts } from './utils/InitTestContracts';

import { Token, IDO } from '../typechain/index';
import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('Token', async () => {
  let token: Token;
  let ido: IDO;
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

    token._setBurnFee('200');
    token._setTaxFee('300');
  });

  describe('initialize', () => {
    it('should allow to send BNB less then or equal to 20', async () => {
      const [account1, account2] = accounts;

      await ido.connect(account1).sendBNB({
        value: ethers.utils.parseEther('0.5'),
      });
      await ido.connect(account2).sendBNB({
        value: ethers.utils.parseEther('9'),
      });
      await ido.connect(account2).sendBNB({
        value: ethers.utils.parseEther('1'),
      });

      const set = await ido.connect(_owner).getAllocation();
    });
    it('should not be able to send more then 20 bnb per account', async () => {
      const [account1] = accounts;
      await expect(
        ido.connect(account1).sendBNB({
          value: ethers.utils.parseEther('21'),
        })
      ).to.be.revertedWith('Max BNB limit is 20');
    });

    it('should init the contract correctly', async () => {
      const name = await token.name();
      const symbol = await token.symbol();
      const supply = await token.totalSupply();
      const decimals = await token.decimals();
      const owner = await token.owner();
      const balanceOfOwner = await token.balanceOf(owner);

      expect(name).to.be.equal('Sleepy Sloth');
      expect(symbol).to.be.equal('SLEEPY');
      expect(decimals.toString()).to.be.equal('8');
      expect(supply.toString()).to.be.equal('100000000000000000000000');
      expect(owner).to.be.equal(_owner.address);
      expect(balanceOfOwner.toString()).to.be.equal(supply.toString());
    });

    it('should exclude account', async () => {
      const [account1] = accounts;
      const supply = await token.totalSupply();
      await token.connect(_owner).excludeAccount(_owner.address);

      const isExcluded = await token.connect(_owner).isExcluded(_owner.address);

      // /** Set Transfers */
      await token.connect(_owner).transfer(account1.address, '100');
      const ownerBalance = await token.balanceOf(_owner.address);
      const account1Balance = await token.balanceOf(account1.address);

      expect(ownerBalance.toString()).to.be.equal(supply.sub('100').toString());
      expect(account1Balance.toString()).to.be.equal('98');
    });

    it('should frictionless yield to accounts that own SLEEPY but not to accounts that do not', async () => {
      const [account1, account2, account3, account4] = accounts;
      await token.connect(_owner).excludeAccount(_owner.address);

      await token.connect(_owner).transfer(account1.address, '1000');
      await token.connect(_owner).transfer(account2.address, '1000');
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
  });
});
