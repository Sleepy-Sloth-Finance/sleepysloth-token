import { ethers, upgrades } from 'hardhat';
import { Token, IDO } from '../../typechain/index';
import { ContractFactory } from '../../libs/ContractFactory';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';

interface InitOptions {
  owner: SignerWithAddress;
}

interface Contracts {
  token: Token;
  ido: IDO;
}

export async function initTestSmartContracts({
  owner,
}: InitOptions): Promise<Contracts> {
  const tokenFactory = await ContractFactory.getTokenFactory();
  const token = await tokenFactory.connect(owner).deploy();

  const idoFactory = await ContractFactory.getIDOFactory();
  const ido = await idoFactory.connect(owner).deploy();
  ido.connect(owner).setIsActive(true);

  return { token, ido };
}
