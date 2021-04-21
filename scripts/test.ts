import dotenv from 'dotenv';
dotenv.config();

import { network } from 'hardhat';
import path from 'path';
import fs from 'fs';
import { ContractFactory } from '../libs/ContractFactory';
import { ethers } from 'hardhat';

/**
 * Deploy upgradable contracts
 **/
const SCRIPT_NAME = 'DEPLOY SLEEPY CONTRACTS';

const main = async () => {
  const networkName = network.name;

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

    // Sleepy
    const ido = await ContractFactory.getIDOAt(
      '0x0Cf02BF787abF4f99610559E1eBd2B74993c2C6b'
    );
    const balance = await ethers.provider.getBalance(ido.address);
    console.log('balance', balance.toString());

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
