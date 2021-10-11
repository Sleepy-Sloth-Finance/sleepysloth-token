import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import fs from 'fs';
import { network, upgrades } from 'hardhat';
import { ContractFactory } from '../libs/ContractFactory';
import { JanglesLPool, JanglesToken } from '../typechain';
import { getDeployedContracts } from './utils/contracts';
import { ethers } from 'ethers';

/**
 * Deploy upgradable contracts
 **/
const SCRIPT_NAME = 'DEPLOY LPool';

const main = async () => {
  const networkName = network.name;
  const addresses = require(`../deployed-addresses/addresses-${networkName}-nft.json`);

  try {
    console.log(
      `============================ ${SCRIPT_NAME} ===============================`
    );
    console.log(`Running on network: ${networkName}`);

    const { DEPLOYER_ADDRESS } = process.env;

    [DEPLOYER_ADDRESS].forEach((value) => {
      if (!value) {
        throw new Error('Please set the value in .env file');
      }
    });

    const contracts = await getDeployedContracts(networkName);

    console.log('Approving');
    console.log(contracts.lpool?.address);
    const approve = await contracts.pair?.approve(
      contracts.lpool!.address,
      ethers.utils.parseEther('50000000')
    );
    await approve?.wait();

    console.log(
      `============================ ${SCRIPT_NAME}: DONE ===============================`
    );
  } catch (e) {
    console.error(
      `============================ ${SCRIPT_NAME}: FAILED ===============================`
    );
    throw e;
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
