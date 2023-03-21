import React from "react";
import ReactDOM, { render } from "react-dom";
import App from "./components/App.js";
import { Provider } from "react-redux";
import store, { history } from './reducers/main'
import $ from 'jquery'
import './index.scss'
import { ConnectedRouter } from "connected-react-router";
import './i18n'
import { createTheme, ThemeProvider } from "@mui/material";
import ModalProvider from "@reducers/context/ModalProvider";
import { SnackbarProvider } from 'notistack'


const theme = createTheme({
  palette: {
    primary: {
      main: '#17183B',
    },
    secondary: {
      main: '#FF6B35'
    }
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: {size: 'small'},
          style: {
            minWidth: '100px',
            maxWidth: '100px'
          }
        },
        {
          props: {size: 'medium'},
          style: {
            minWidth: '200px',
            maxWidth: '200px'
          }
        },
        {
          props: {size: 'large'},
          style: {
            minWidth: '300px',
            maxWidth: '300px'
          }

        }
      ],
      styleOverrides: {
        root: {
          width: '100%',
          borderRadius: '15px',
          minHeight: '60px',
          fontSize: '14pt',
          minWidth: '300px',
          maxWidth: '300px'
        }
      }
    },
  }
})


const build = () => render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          <SnackbarProvider maxSnack={5}>
            <ModalProvider>
              <App/>
            </ModalProvider>
          </SnackbarProvider>
        </ConnectedRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)

$(window).on('load', build)

