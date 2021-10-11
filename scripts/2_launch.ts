import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import fs from 'fs';
import { network, upgrades } from 'hardhat';
import { ContractFactory } from '../libs/ContractFactory';
import { JanglesLPool, JanglesToken } from '../typechain';

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

    const { BOJANGLES, JANGLES, PAIR } = addresses;
    const { DEPLOYER_ADDRESS } = process.env;

    [DEPLOYER_ADDRESS].forEach((value) => {
      if (!value) {
        throw new Error('Please set the value in .env file');
      }
    });

    const Lpool = (await upgrades.deployProxy(
      await ContractFactory.getJanglesLPoolFactory(),
      [JANGLES, PAIR],
      {
        unsafeAllowCustomTypes: true,
        unsafeAllowLinkedLibraries: true,
      }
    )) as JanglesLPool;
    await Lpool.deployed();
    console.log('Lpool Deployed', Lpool.address);

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
          JANGLES,
          PAIR,
          LPOOL: Lpool.address,
        },
        null,
        2
      )
    );
    // console.log('Contracts addresses saved to', addressFilePath.toString());

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
