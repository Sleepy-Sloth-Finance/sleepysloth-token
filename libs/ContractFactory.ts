import { ethers } from 'hardhat';

import {
  Token,
  Token__factory,
  Bojangles,
  Bojangles__factory,
  IDO,
  Airdrop,
  Airdrop__factory,
  IDO__factory,
} from '../typechain';

enum Contracts {
  Airdrop = 'Airdrop',
  BillionToken = 'BillionToken',
  Token = 'Token',
  Bojangles = 'Bojangles',
  IDO = 'IDO',
}

export class ContractFactory {
  static getIDOFactory(): Promise<IDO__factory> {
    return ethers.getContractFactory(Contracts.IDO) as Promise<IDO__factory>;
  }

  static getIDOAt(address: string): Promise<IDO> {
    return ethers.getContractAt(Contracts.IDO, address) as Promise<IDO>;
  }

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
