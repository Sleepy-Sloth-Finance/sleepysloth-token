import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import fs from 'fs';
import { network } from 'hardhat';
import { ContractFactory } from '../libs/ContractFactory';
import Web3 from 'web3';

const deployedAddresses = require('../deployed-addresses/addresses.json');
console.log(deployedAddresses);
/**
 * Deploy upgradable contracts
 **/
const SCRIPT_NAME = 'GET PRESALE';

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
    const ido = await ContractFactory.getIDOAt(deployedAddresses.IDO_ADDRESS);
    const presalers = await ido.getAllocation();

    const _presalers = [];
    let totalAmount = 0;
    for (var i = 0; i < presalers.length; i++) {
      const presale = presalers[i] as any;
      const user = presale.user;
      const amount =
        parseFloat(Web3.utils.fromWei(presale.bnb.toString())) * 650000000000;
      totalAmount += amount;
      _presalers.push([user, amount]);
    }

    const preSalerPath = path.join(
      __dirname,
      '..',
      'presalers',
      'presale.json'
    );

    fs.writeFileSync(preSalerPath, JSON.stringify(_presalers));

    console.log('TOTAL AMOUNT', totalAmount);
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
