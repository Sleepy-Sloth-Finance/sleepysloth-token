import dotenv from 'dotenv';
dotenv.config();

import { network, upgrades } from 'hardhat';
import path from 'path';
import fs from 'fs';
import { ContractFactory } from '../libs/ContractFactory';
import { Bojangles } from '../typechain';

/**
 * Deploy upgradable contracts
 **/
const SCRIPT_NAME = 'DEPLOY BOJANGLES';

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

    const nft = (await upgrades.deployProxy(
      await ContractFactory.getBojanglesFactory(),
      ['Bojangles', 'Mr_Bo']
    )) as Bojangles;
    console.log('Deployed: NFT address', nft.address);

    const verifyScriptPath = path.join(
      __dirname,
      '..',
      'verify-contracts',
      'verify-nft'
    );

    fs.writeFileSync(
      verifyScriptPath,
      `
        npx hardhat verify --network ${networkName} ${nft.address}
      `
    );

    const addressFilePath = path.join(
      __dirname,
      '..',
      'deployed-addresses',
      'addresses-nft.json'
    );

    fs.writeFileSync(
      addressFilePath,
      JSON.stringify(
        {
          NETWORK: networkName,
          TOKEN_ADDRESS: nft.address,
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
