import { ContractFactory } from '../../libs/ContractFactory';
import { network } from 'hardhat';
const ADDRESSES = require(`../../deployed-addresses/addresses-${network.name}-nft.json`);

export async function getDeployedContracts(network: string) {
  const { NETWORK, BOJANGLES, JANGLES, PAIR, LPOOL } = ADDRESSES;

  if (NETWORK !== network) {
    throw new Error('Network does not match');
  }

  [NETWORK].forEach((address) => {
    if (!address) {
      throw new Error('Please check migration-output/address.json file');
    }
  });

  const bojangles = BOJANGLES
    ? await ContractFactory.getBojanglesAt(BOJANGLES)
    : null;
  const jangles = JANGLES
    ? await ContractFactory.getJanglesTokenAt(JANGLES)
    : null;
  const lpool = LPOOL ? await ContractFactory.getBojanglesAt(LPOOL) : null;
  const pair = PAIR ? await ContractFactory.getERC20At(PAIR) : null;

  return {
    bojangles,
    jangles,
    lpool,
    pair,
  };
}
