import dotenv from 'dotenv';
dotenv.config();

import { network } from 'hardhat';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { SaveToDynamo } from '../libs/helpers';
const csvtojson = require('csvtojson');
const ADDRESSES = require('../deployed-addresses/vesting.json');
const EthCrypto = require('eth-crypto');

const testSigner = Web3.utils.toChecksumAddress(process.env.DEPLOYER_ADDRESS!);
const testSignerPriv = process.env.DEPLOYER_SECRET;
const getMessageHash = (encodeTypes, args) => {
  const encoder = ethers.utils.defaultAbiCoder;

  let encoded = encoder.encode(encodeTypes, args);
  return ethers.utils.sha256(encoded);
};

const sign = (address, pkey, messageParamsTypes, messageParams) => {
  const messageHash = getMessageHash(messageParamsTypes, messageParams);
  return EthCrypto.sign(pkey, messageHash);
};

/**
 * INIT CONTRACTS (After deployment / snapshot restoration)
 **/
const SCRIPT_NAME = 'CUSTOM SETTERS';
const VESTING_TABLE = 'AxionTodayProd-VestingTable-1A91FKRSAH9RY';

const main = async () => {
  const networkName = network.name;

  const records = await csvtojson().fromFile('scripts/snaphots/owners.csv');

  try {
    console.log(
      `============================ ${SCRIPT_NAME} ===============================`
    );
    console.log(`Running on network: ${networkName}`);

    const { NETWORK, VESTING } = ADDRESSES;

    if (NETWORK !== networkName) {
      throw new Error('Network does not match');
    }

    [NETWORK, VESTING].forEach((address) => {
      if (!address) {
        throw new Error('Please check migration-output/address.json file');
      }
    });

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const _address = Web3.utils.toChecksumAddress(record.address);
      const signature = sign(
        testSigner,
        testSignerPriv,
        ['address', 'uint256'],
        [_address, record.amount]
      );

      await SaveToDynamo(
        VESTING_TABLE,
        'Vesting',
        `${_address}|${record.name}`,
        {
          ...record,
          address: _address,
          signature,
        }
      );
    }

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
