import { ethers } from 'hardhat';

import {
  // Jangles
  Bojangles,
  Bojangles__factory,
  JanglesStake,
  JanglesStake__factory,
  JanglesLPool,
  JanglesLPool__factory,
  JanglesToken,
  JanglesToken__factory,
  ERC20,
  ERC20__factory,
  // Archive
  Token,
  Token__factory,
  IDO,
  Airdrop,
  Airdrop__factory,
  IDO__factory,
} from '../typechain';

enum Contracts {
  Airdrop = 'Airdrop',
  BillionToken = 'BillionToken',
  Token = 'Token',
  IDO = 'IDO',
  ERC20 = 'ERC20',
  Bojangles = 'Bojangles',
  JanglesStake = 'JanglesStake',
  JanglesLPool = 'JanglesLPool',
  JanglesToken = 'JanglesToken',
}

export class ContractFactory {
  static getBojanglesFactory(): Promise<Bojangles__factory> {
    return ethers.getContractFactory(
      Contracts.Bojangles
    ) as Promise<Bojangles__factory>;
  }

  static getBojanglesAt(address: string): Promise<Bojangles> {
    return ethers.getContractAt(
      Contracts.Bojangles,
      address
    ) as Promise<Bojangles>;
  }

  static getJanglesStakeFactory(): Promise<JanglesStake__factory> {
    return ethers.getContractFactory(
      Contracts.JanglesStake
    ) as Promise<JanglesStake__factory>;
  }

  static getJanglesStakeAt(address: string): Promise<JanglesStake> {
    return ethers.getContractAt(
      Contracts.JanglesStake,
      address
    ) as Promise<JanglesStake>;
  }

  static getJanglesLPoolFactory(): Promise<JanglesLPool__factory> {
    return ethers.getContractFactory(
      Contracts.JanglesLPool
    ) as Promise<JanglesLPool__factory>;
  }

  static getJanglesLPoolAt(address: string): Promise<JanglesLPool> {
    return ethers.getContractAt(
      Contracts.JanglesLPool,
      address
    ) as Promise<JanglesLPool>;
  }

  static getJanglesTokenFactory(): Promise<JanglesToken__factory> {
    return ethers.getContractFactory(
      Contracts.JanglesToken
    ) as Promise<JanglesToken__factory>;
  }

  static getJanglesTokenAt(address: string): Promise<JanglesToken> {
    return ethers.getContractAt(
      Contracts.JanglesToken,
      address
    ) as Promise<JanglesToken>;
  }

  static getERC20Factory(): Promise<ERC20__factory> {
    return ethers.getContractFactory(
      Contracts.ERC20
    ) as Promise<ERC20__factory>;
  }

  static getERC20At(address: string): Promise<ERC20> {
    return ethers.getContractAt(Contracts.ERC20, address) as Promise<ERC20>;
  }

  // Contract
  static getIDOFactory(): Promise<IDO__factory> {
    return ethers.getContractFactory(Contracts.IDO) as Promise<IDO__factory>;
  }

  static getIDOAt(address: string): Promise<IDO> {
    return ethers.getContractAt(Contracts.IDO, address) as Promise<IDO>;
  }

  static getTokenFactory(): Promise<Token__factory> {
    return ethers.getContractFactory(
      Contracts.Token
    ) as Promise<Token__factory>;
  }

  static getTokenAt(address: string): Promise<Token> {
    return ethers.getContractAt(Contracts.Token, address) as Promise<Token>;
  }

  static getAirdropFactory(): Promise<Airdrop__factory> {
    return ethers.getContractFactory(
      Contracts.Airdrop
    ) as Promise<Airdrop__factory>;
  }

  static getAirdropAt(address: string): Promise<Airdrop> {
    return ethers.getContractAt(Contracts.Airdrop, address) as Promise<Airdrop>;
  }
}
