import dotenv from 'dotenv';
dotenv.config();

import { network } from 'hardhat';
import { ContractFactory } from '../libs/ContractFactory';
const airdropAddresses = require('./json/airdrop.json');
const DeployedAddreses = require('../deployed-addresses/addresses.json');

/**
 * Deploy upgradable contracts
 **/
const SCRIPT_NAME = 'DEPLOY SLEEPY CONTRACTS';
const decimals = 100000000;

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

    const b1 = await token._setBlackListedAddress(
      '0x723F53aE51052294716B9FE6Bb5Ba09Fcb84bD7e',
      true
    );
    await b1.wait();
    const b2 = await token._setBlackListedAddress(
      '0xA3867f7D90094F16E12BfB1A9fdfcA64E8ae9856',
      true
    );
    await b2.wait();
    const b3 = await token._setBlackListedAddress(
      '0x22f7f0D7273B8d8567b3C1923E6998fBa2f3c920',
      true
    );
    await b3.wait();

    // const airdrop = await ContractFactory.getAirdropAt(
    //   '0x30AA1015979Ef305b9AF0ba3F62168A91a504aA1'
    // );

    // while (airdropAddresses.length) {
    //   const payoutsToSend = airdropAddresses.splice(0, 100);
    //   const addresses = [];
    //   const amounts = [];
    //   for (let i = 0; i < payoutsToSend.length; i++) {
    //     const record = payoutsToSend[i];
    //     addresses.push(record.address);
    //     amounts.push('500000000000000000');
    //   }
    //   console.log(
    //     'Sending',
    //     addresses.length,
    //     '|',
    //     airdropAddresses.length,
    //     'records left'
    //   );
    //   const bulkSend = await airdrop.bulkSendToken(
    //     token.address,
    //     addresses,
    //     amounts
    //   );
    //   await bulkSend.wait();

    //   console.log('Last Address processed', addresses[addresses.length - 1]);
    // }

    // console.log(bulkSend);

    // for (var i = 0; i < addresses.length; i++) {
    //   const address = addresses[i];

    //   console.log(i, 'of', addresses.length);
    //   console.log(
    //     'sending',
    //     new BigNumber(address[1]).div(decimals).toString(),
    //     'to',
    //     address[0]
    //   );

    //   const transfer = await token.transfer(address[0], `${address[1]}`);
    //   await transfer.wait();
    // }

    // await token._setTimeLimited(true);

    // await token._setPair('0x473E87BBEb8e893096DF91EAAA7391fcDDd91136');
    // const pause = await token._setPaused(false);
    // await pause.wait();
    // await token._setTimeLimited(false);
    // await token._setMaxTxSize('10000000000000000000000');
    // const addresses = await ido.getAddresses();
    // console.log(JSON.stringify(addresses));
    // await ido.setIsActive(true);
    // await ido.setWhitelist(addresses);
    // await token._setPair('0xf63774a69101e532b773058d87d9D64d1A888088');
    // const burn = await token._setBurnFee(500);
    // await burn.wait();
    // await token._setTaxFee(300);
    // await token._setPaused(false);
    // await token._setMaxTxSize('100000000000000');
    // await token._setTimeLimited(false);

    // await token._setBlackListedAddress(
    //   '0xD4191AAACb303b105BCcA2D38a0507622f8AE920',
    //   false
    // );
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
