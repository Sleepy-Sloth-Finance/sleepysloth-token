import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import fs from 'fs';
import { network, upgrades } from 'hardhat';
import { ContractFactory } from '../libs/ContractFactory';
import { JanglesToken } from '../typechain';

/**
 * Deploy upgradable contracts
 **/
const SCRIPT_NAME = 'DEPLOY SLEEPY CONTRACTS';

const main = async () => {
  const networkName = network.name;
  const addresses = require(`../deployed-addresses/addresses-${networkName}-nft.json`);

  try {
    console.log(
      `============================ ${SCRIPT_NAME} ===============================`
    );
    console.log(`Running on network: ${networkName}`);

    const { BOJANGLES } = addresses;
    const { DEPLOYER_ADDRESS } = process.env;

    [DEPLOYER_ADDRESS].forEach((value) => {
      if (!value) {
        throw new Error('Please set the value in .env file');
      }
    });

    const token = (await upgrades.deployProxy(
      await ContractFactory.getJanglesTokenFactory(),
      ['Jangles', 'Jangles', BOJANGLES],
      {
        unsafeAllowCustomTypes: true,
        unsafeAllowLinkedLibraries: true,
      }
    )) as JanglesToken;
    await token.deployed();
    console.log('Jangles Deployed', token.address);

    const addressFilePath = path.join(
      __dirname,
      '..',
      'deployed-addresses',
      `addresses-${networkName}-nft.json`
    );

    fs.writeFileSync(
      addressFilePath,
      JSON.stringify(
        {
          NETWORK: networkName,
          BOJANGLES,
          JANGLES: token.address,
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
