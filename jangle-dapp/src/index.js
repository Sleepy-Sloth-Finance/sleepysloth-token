import * as React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/styles';
import { UseWalletProvider } from 'use-wallet';
import { ThemeProvider as MaterialThemeProvider } from '@mui/material/styles';
import App from 'containers/App/App';
import theme from './theme';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import './utils/string';

ReactDOM.render(
  <UseWalletProvider
    connectors={{
      injected: {
        chainId: [1, 3],
      },
    }}
  >
    <MaterialThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <App />
      </ThemeProvider>
    </MaterialThemeProvider>
  </UseWalletProvider>,
  document.querySelector('#root')
);
