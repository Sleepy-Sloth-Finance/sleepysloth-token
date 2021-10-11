import { makeStyles } from '@mui/styles';
import BG from 'assets/background.png';
import Bamboo from 'assets/bamboo.png';
import BambooSloth from 'assets/bamboo-sloth.png';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    width: '100%',
    backgroundImage: `url(${BG})`,
  },
  header: {
    padding: '24px 0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  links: {
    '& > ul': {
      listStyle: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      '& > li': {
        margin: '0px 18px',
        cursor: 'pointer',
      },
      '& > li:list-child': {
        marginRight: 0,
      },
    },
  },
  socialIcon: {
    marginRight: 12,
    color: '#84A4C5',
  },
  menuItem: {
    margin: '12px 0px !important',
  },
  card: {
    textAlign: 'center',
    padding: 20,
    borderRadius: 10,
    backdropFilter: 'blur(6px)',
    backgroundColor: 'rgba(255, 255, 255, .05)',
    boxShadow: '4px 4px 12px rgb(0 0 0 / 20%)',
    margin: '24px 0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  bamboo: {
    backgroundImage: `url(${Bamboo})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right',
  },
  bambooSloth: {
    backgroundImage: `url(${BambooSloth})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right',
  },
  drawerPaper: {
    backgroundImage: 'none !important',
  },
  drawerLogo: {
    width: '90%',
  },
  drawerLogoDiv: {
    padding: '24px 0px 12px 10px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  field: {
    '& > div': {
      width: '100%',
    },
    width: 310,
    margin: '12px 0px',
    textAlign: 'left',
  },
  footer: {
    textAlign: 'center',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-12px',
    marginLeft: '-12px',
  },
  stack: {
    color: theme.palette.primary.main,
  },
}));

export default useStyles;
