import { Bojangles, JanglesToken, JanglesLPool } from '../../typechain/index';
import { ContractFactory } from '../../libs/ContractFactory';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { upgrades } from 'hardhat';

interface InitOptions {
  owner: SignerWithAddress;
}

export interface NFTContracts {
  nft: Bojangles;
  token: JanglesToken;
  lPool: JanglesLPool;
}

export async function initNFTContracts({
  owner,
}: InitOptions): Promise<NFTContracts> {
  const nft = (await upgrades.deployProxy(
    await ContractFactory.getBojanglesFactory(),
    ['Bojangles', 'Mr_Bo']
  )) as Bojangles;

  const token = (await upgrades.deployProxy(
    await ContractFactory.getJanglesTokenFactory(),
    ['Jangles', 'Jangle', nft.address]
  )) as JanglesToken;

  /** Reward token and Stakedtoken = same same */
  const lPool = (await upgrades.deployProxy(
    await ContractFactory.getJanglesLPoolFactory(),
    [token.address, token.address]
  )) as JanglesLPool;

  return { nft, token, lPool };
}
