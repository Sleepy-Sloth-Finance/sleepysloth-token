import React, { useEffect, useState } from 'react';
// Utils
import useWallet from 'use-wallet';
import Web3 from 'web3';
import { MaxUint256 } from 'ethers/constants';
import CONTRACTS from 'service/abi.json';
import clsx from 'clsx';
// Components
import NumberFormatField from 'components/NumberFormatField';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Hidden,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import Dropdown from 'components/Dropdown/Dropdown';
// Icons
import { Menu } from '@mui/icons-material';
import { AiOutlineTwitter } from 'react-icons/ai';
import { MdDashboard } from 'react-icons/md';
import { GiUnicorn } from 'react-icons/gi';
import { FaDiscord, FaGithub, FaTelegram, FaRoad } from 'react-icons/fa';
import { RiCoinFill } from 'react-icons/ri';
import { BiCoinStack } from 'react-icons/bi';
import NotificationMessage from 'components/NotificationMessage';
// Images
import { ReactComponent as Logo } from 'assets/logo.svg';
// Styles
import useStyles from './styles';

const etherscanTX = 'https://etherscan.io/tx/';

const links = [
  { name: 'Home', link: 'https://sleepysloth.finance', icon: MdDashboard },
  {
    name: 'Roadmap',
    link: 'https://sleepysloth.finance/#roadmap',
    icon: FaRoad,
  },
  {
    name: 'Charity',
    link: 'https://sleepysloth.finance/#charity',
    icon: RiCoinFill,
  },
  { name: 'Buy Jangles', link: 'https://uniswap.org', icon: GiUnicorn },
];
const socials = [
  { name: 'Twitter', link: '', icon: AiOutlineTwitter },
  { name: 'Discord', link: '', icon: FaDiscord },
  { name: 'Github', link: '', icon: FaGithub },
  { name: 'Telegram', link: '', icon: FaTelegram },
];

export default function App() {
  const wallet = useWallet();
  const classes = useStyles();
  const refreshInterval = React.useRef(null);
  const [drawer, setDrawer] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [contracts, setContracts] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [user, setUser] = useState(null);
  const [approving, setApproving] = useState(false);
  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [claimingRewards, setClaimingRewards] = useState(false);
  const [claimingJangles, setClaimingJangles] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (window.ethereum?.selectedAddress) {
        wallet.connect('injected');
      }
    }, 2500);
  }, []);

  const handleConnect = () => {
    if (wallet.status === 'connected') {
      return wallet.reset();
    }
    wallet.connect('injected');
  };

  useEffect(() => {
    if (wallet.ethereum) setupWeb3();
  }, [wallet.ethereum]);

  async function setupWeb3() {
    if (!wallet.ethereum) return;
    const _web3 = new Web3(wallet.ethereum);
    setWeb3(_web3);
  }

  useEffect(() => {
    if (web3) connect();

    // eslint-disable-next-line
  }, [web3, wallet.account]);

  function connect() {
    const _contracts = {};

    _contracts.bojangles = new web3.eth.Contract(
      CONTRACTS.Bojangles.ABI,
      CONTRACTS.Bojangles.Address[wallet.chainId]
    );
    _contracts.jangles = new web3.eth.Contract(
      CONTRACTS.Jangles.ABI,
      CONTRACTS.Jangles.Address[wallet.chainId]
    );
    _contracts.lPool = new web3.eth.Contract(
      CONTRACTS.JanglesLPool.ABI,
      CONTRACTS.JanglesLPool.Address[wallet.chainId]
    );
    _contracts.pair = new web3.eth.Contract(
      CONTRACTS.UniswapPairERC20.ABI,
      CONTRACTS.UniswapPairERC20.Address[wallet.chainId]
    );

    setContracts(_contracts);
  }

  useEffect(() => {
    if (contracts) {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
        refreshInterval.current = null;
      }

      getData();
      const seconds = 60;
      refreshInterval.current = setInterval(async () => {
        await getData();
      }, seconds * 1000);
    }

    return () => clearInterval(refreshInterval.current);
  }, [contracts]);

  async function getData() {
    if (!wallet.account) return;
    const supplyOfBojangles = await contracts.bojangles.methods
      .balanceOf(wallet.account)
      .call();
    const userOwedJangles = await contracts.jangles.methods
      .userOwed(wallet.account)
      .call();
    const supplyOfPair = await contracts.pair.methods
      .balanceOf(wallet.account)
      .call();
    const supplyOfPool = await contracts.lPool.methods
      .balanceOf(wallet.account)
      .call();
    const poolRewards = await contracts.lPool.methods
      .earned(wallet.account)
      .call();
    const lpTotalSupply = await contracts.lPool.methods.totalSupply().call();
    const allowance = await contracts.pair.methods
      .allowance(wallet.account, contracts.lPool.options.address)
      .call();
    const rewardPerToken = await contracts.lPool.methods
      .rewardPerToken()
      .call();

    console.log(rewardPerToken.web3ReadableFixed());

    setUser({
      lpTotalSupply,
      allowance,
      supplyOfBojangles,
      userOwedJangles,
      supplyOfPair,
      supplyOfPool,
      poolRewards,
    });
  }

  async function handleApprove() {
    setApproving(true);
    try {
      const tx = await contracts.pair.methods
        .approve(contracts.lPool.options.address, MaxUint256)
        .send({ from: wallet.account });
      await getData();
      successToast(
        'Approved! You may now pool your LP tokens.',
        etherscanTX + tx.transactionHash
      );
    } catch (error) {
      console.log(error);
      errorToast(error.message);
    }
    setApproving(false);
  }

  async function handleDeposit() {
    if (parseFloat(stakeAmount || 0) <= 0.0) return;
    const _amount = web3.utils.toWei(stakeAmount);

    setDepositing(true);
    try {
      const tx = await contracts.lPool.methods.stake(_amount).send({
        from: wallet.account,
        value: '0',
      });
      await getData();
      successToast(
        'Thank you for depositing! Enjoy the rewards!',
        etherscanTX + tx.transactionHash
      );
    } catch (error) {
      console.log(error);
      errorToast(error.message);
    }
    setDepositing(false);
  }

  async function handleClaimAndWithdraw() {
    setWithdrawing(true);
    try {
      const tx = await contracts.lPool.methods.exit().send({
        from: wallet.account,
        value: '0',
      });
      await getData();
      successToast(
        'Rewards have been claimed, and LP tokens returned safely!',
        etherscanTX + tx.transactionHash
      );
    } catch (error) {
      console.log(error);
      errorToast(error.message);
    }
    setWithdrawing(false);
  }

  async function handleClaimRewards() {
    setClaimingRewards(true);
    try {
      const tx = await contracts.lPool.methods.getReward().send({
        from: wallet.account,
      });
      await getData();
      successToast(
        'Rewards have been claimed!',
        etherscanTX + tx.transactionHash
      );
    } catch (error) {
      console.log(error);
      errorToast(error.message);
    }
    setClaimingRewards(false);
  }

  async function handleClaimJangle() {
    setClaimingJangles(true);
    try {
      const tx = await contracts.jangles.methods
        .mintForUser(wallet.account)
        .send({
          from: wallet.account,
        });
      await getData();
      successToast(
        'Rewards have been claimed!',
        etherscanTX + tx.transactionHash
      );
    } catch (error) {
      console.log(error);
      errorToast(error.message);
    }
    setClaimingJangles(false);
  }

  function successToast(message, link) {
    toast.success(<NotificationMessage title={message} link={link} />, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,

      draggable: true,
      progress: undefined,
    });
  }

  function errorToast(message, link) {
    toast.error(<NotificationMessage title={message} link={link} />, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,

      draggable: true,
      progress: undefined,
    });
  }

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={() => setDrawer(false)}
      onKeyDown={() => setDrawer(false)}
    >
      <div className={classes.drawerLogoDiv}>
        <Logo className={classes.drawerLogo} />
      </div>
      <Divider />
      <List>
        {links.map((link, index) => (
          <ListItem button key={link.name}>
            <ListItemIcon>
              <link.icon />
            </ListItemIcon>
            <ListItemText primary={link.name} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {socials.map((social, index) => (
          <ListItem button key={social.name}>
            <ListItemIcon>
              <social.icon />
            </ListItemIcon>
            <ListItemText primary={social.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className={classes.root}>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Container maxWidth={'lg'}>
        <div className={classes.header}>
          <Logo />
          <Hidden mdDown>
            <div className={classes.links}>
              <ul>
                <li>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://sleepysloth.finance"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://sleepysloth.finance/#roadmap"
                  >
                    Roadmap
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://sleepysloth.finance/#charity"
                  >
                    Charity
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://uniswap.org"
                  >
                    Buy Jangles
                  </a>
                </li>
                <li>
                  <Dropdown title={'Socials'}>
                    {socials.map((social, idx) => {
                      return (
                        <MenuItem
                          key={idx}
                          classes={{ root: classes.menuItem }}
                        >
                          <social.icon className={classes.socialIcon} />
                          {social.name}
                        </MenuItem>
                      );
                    })}
                  </Dropdown>
                </li>
              </ul>
            </div>
          </Hidden>
          <Hidden mdUp>
            <Button onClick={() => setDrawer(true)}>
              <Menu />
            </Button>
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              anchor={'right'}
              open={drawer}
              onClose={() => setDrawer(false)}
            >
              {list('right')}
            </Drawer>
          </Hidden>
        </div>
      </Container>
      <Container maxWidth={'md'} sx={{ textAlign: 'center' }}>
        <div className={clsx(classes.card)}>
          <Typography variant="h4">Collect your $JANGLE</Typography>
          <Typography variant="subtitle1">
            Mr. Bojangle owners receive 5 $JANGLE per day for each Mr. Bo they
            own.
            <br />
            View the token contract{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://etherscan.io/address/${CONTRACTS.JanglesLPool.Address[1]}`}
            >
              <span className="bold">here</span>
            </a>
            .
          </Typography>
          {/* <img src={JanglesToken} className={classes.jangleToken} /> */}
          <Typography sx={{ marginTop: 2 }} variant="body1">
            You have{' '}
            <span className="bold-small">{user?.supplyOfBojangles ?? 0}</span>{' '}
            Mr. Bo
          </Typography>
          <Typography sx={{ marginBottom: 3 }} variant="body1">
            You have{' '}
            <span className="bold-small">
              {user?.userOwedJangles?.web3ReadableFixed() ?? 0}
            </span>{' '}
            pending $JANGLE
          </Typography>
          {wallet.status === 'connected' ? (
            <Button
              onClick={handleClaimJangle}
              disabled={claimingJangles}
              variant="contained"
            >
              {claimingJangles && (
                <CircularProgress size={24} className={classes.loader} />
              )}
              Claim
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleConnect}
            >
              Connect Metamask
            </Button>
          )}
        </div>
        <div className={clsx(classes.card, classes.bambooSloth)}>
          <Typography variant="h4">$JANGLE-ETH LP Pool</Typography>
          <Typography variant="subtitle1">
            Pool your $JANGLE LP and receive!
          </Typography>
          <Typography sx={{ marginBottom: 2 }} variant="subtitle1">
            Total Liquidity: {user?.lpTotalSupply?.web3ReadableFixed() ?? 0}
          </Typography>
          <div className={classes.field}>
            <TextField
              id="outlined-basic"
              label="Pool Your LP"
              variant="outlined"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              InputProps={{
                inputComponent: NumberFormatField,
                endAdornment: (
                  <InputAdornment position="end">
                    {user?.allowance === '0' ? (
                      <Button disabled={approving} onClick={handleApprove}>
                        {approving && (
                          <CircularProgress
                            size={24}
                            className={classes.loader}
                          />
                        )}
                        Approve
                      </Button>
                    ) : (
                      <Button disabled={depositing} onClick={handleDeposit}>
                        {depositing && (
                          <CircularProgress
                            size={24}
                            className={classes.loader}
                          />
                        )}
                        Deposit
                      </Button>
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="subtitle2">
              Your available LP: {user?.supplyOfPair?.web3ReadableFixed() ?? 0}
            </Typography>
          </div>
          <div className={classes.field}>
            <TextField
              id="outlined-basic"
              label="Your Pooled LP"
              variant="outlined"
              value={user?.supplyOfPool.web3Readable() ?? 0}
              disabled={true}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                inputComponent: NumberFormatField,
                endAdornment: (
                  <InputAdornment position="end">
                    <BiCoinStack className={classes.stack} />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <Typography sx={{ marginBottom: 3 }} variant="h4">
            Available:{' '}
            <span className="bold">
              {user?.poolRewards?.web3ReadableFixed() ?? 0}
            </span>
          </Typography>
          {wallet.status === 'connected' ? (
            <div className={classes.actions}>
              <Button
                onClick={handleClaimRewards}
                disabled={claimingRewards || withdrawing}
                sx={{ marginRight: 2 }}
                variant="contained"
              >
                {(claimingRewards || withdrawing) && (
                  <CircularProgress size={24} className={classes.loader} />
                )}
                Claim
              </Button>
              <Button
                onClick={handleClaimAndWithdraw}
                disabled={claimingRewards || withdrawing}
                sx={{ marginLeft: 2 }}
                variant="contained"
              >
                {(claimingRewards || withdrawing) && (
                  <CircularProgress size={24} className={classes.loader} />
                )}
                Claim & Withdraw
              </Button>{' '}
            </div>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleConnect}
            >
              Connect Metamask
            </Button>
          )}
        </div>
      </Container>
      <Container maxWidth={'md'}>
        <div className={classes.footer}>
          {wallet.status === 'connected' && (
            <Typography variant="body1" sx={{ marginBottom: 3 }}>
              Connected with:{' '}
              <a
                href={`https://etherscan.io/address/${wallet.account}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="bold">
                  {wallet?.account?.shortenAddress?.()}
                </span>
              </a>
            </Typography>
          )}
          <Typography variant="subtitle2">
            <span className="bold">DISCLAIMER: </span>$JANGLE is NOT an
            investment and has NO economic value. It will be earned by active
            holding within the Mr. Bojangles ecosystem. Each Mr. Bojangles will
            be eligible to claim tokens at a rate of 5 $JANGLE per day for the
            next 10 years.
          </Typography>
        </div>
      </Container>
    </div>
  );
}
