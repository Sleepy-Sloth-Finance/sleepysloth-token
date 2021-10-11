import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  typography: {
    fontFamily: 'Nunito, Roboto',
    subtitle1: {
      color: 'rgba(255,255,255,0.7)',
    },
    subtitle2: {
      color: 'rgba(255,255,255,0.7)',
    },
    body1: {
      color: 'rgba(255,255,255,0.7)',
    },
    body2: {
      color: 'rgba(255,255,255,0.7)',
    },
    h4: {
      fontWeight: '700',
      color: 'rgba(255,255,255,0.9)',
    },
    h3: {
      fontWeight: '700',
      color: 'rgba(255,255,255,0.9)',
    },
    h5: {
      fontWeight: '700',
      color: 'rgba(255,255,255,0.9)',
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      paper: '#101627',
      default: '#101627',
    },
  },
  components: {
    MuiPaper: {
      root: {
        backgroundImage: 'none !important',
      },
    },
    MuiDrawer: {
      paper: {
        backgroundImage: 'none !important',
      },
      root: {
        backgroundImage: 'none !important',
      },
    },
  },
});

export default theme;
