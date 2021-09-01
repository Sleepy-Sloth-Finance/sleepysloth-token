import { Bojangles } from '../../typechain/index';
import { ContractFactory } from '../../libs/ContractFactory';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { upgrades } from 'hardhat';

interface InitOptions {
  owner: SignerWithAddress;
}

export interface NFTContracts {
  nft: Bojangles;
}

export async function initNFTContracts({
  owner,
}: InitOptions): Promise<NFTContracts> {
  const nft = (await upgrades.deployProxy(
    await ContractFactory.getBojanglesFactory(),
    ['Bojangles', 'Mr_Bo']
  )) as Bojangles;

  return { nft };
}
