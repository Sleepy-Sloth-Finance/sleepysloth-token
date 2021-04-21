import { ethers } from 'hardhat';

import { Token, Token__factory, IDO, IDO__factory } from '../typechain';

enum Contracts {
  Token = 'Token',
  IDO = 'IDO',
}

export class ContractFactory {
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
}
