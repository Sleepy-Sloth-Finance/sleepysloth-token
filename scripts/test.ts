import dotenv from 'dotenv';
dotenv.config();

import { network } from 'hardhat';
import { ContractFactory } from '../libs/ContractFactory';
import { ethers } from 'hardhat';
const DeployedAddreses = require('../deployed-addresses/addresses.json');

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
    const token = await ContractFactory.getTokenAt(
      DeployedAddreses.TOKEN_ADDRESS
    );
    await token.setTransferTime(20);
    // await token._setPair('0xEc87C145958AFC4BD65EeCA9c0A35F0Dd7f59e33');
    // await token._setPaused(false);
    // await token._setMaxTxSize('100000000000000');

    // await token._setPaused(false);
    // await set.wait();

    // const router = await token.router();
    // const pair = await token.pair();

    // console.log(router, pair);

    // const pauser = await token.pauser();
    // const owner = await token.owner();

    // console.log(pauser, owner);

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
