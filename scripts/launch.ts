import dotenv from 'dotenv';
dotenv.config();

import { network } from 'hardhat';
import path from 'path';
import fs from 'fs';
import { ContractFactory } from '../libs/ContractFactory';

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
    const tokenFactory = await ContractFactory.getTokenFactory();
    const token = await tokenFactory.deploy();
    console.log('Deployed: Token', token.address);
    // const idoFactory = await ContractFactory.getIDOFactory();
    // const ido = await idoFactory.deploy();
    // console.log('Deployed: ido', ido.address);

    const verifyScriptPath = path.join(
      __dirname,
      '..',
      'verify-contracts',
      'verify'
    );

    fs.writeFileSync(
      verifyScriptPath,
      `
        npx hardhat verify --network ${networkName} ${token.address}
      `
    );

    const addressFilePath = path.join(
      __dirname,
      '..',
      'deployed-addresses',
      'addresses.json'
    );

    fs.writeFileSync(
      addressFilePath,
      JSON.stringify(
        {
          NETWORK: networkName,
          TOKEN_ADDRESS: token.address,
        },
        null,
        2
      )
    );
    console.log('Contracts addresses saved to', addressFilePath.toString());

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
