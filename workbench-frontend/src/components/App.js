import React, { Component } from "react";
import styles from "./App.module.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Header from "@components/Header/Header";
import Login from "@components/Login/Login";
import Menu from "@components/Menu/Menu";
import Composition from "@components/Composition/Composition";
import Notifications from "@components/Notifications/Notifications";
import {
  doFetchComposition,
  doRaiseNotification,
  doGetSchemasNames,
} from "@reducers/stagesActions";
import GatherComponents from "@components/GatherComponents/GatherComponents";
import RevisionsTracker from "@components/RevisionsTracker/RevisionsTracker";
import { Modal } from "@components/Modal/Modal";
import CloseActionButton from "./CloseActionButton/CloseActionButton";
import RepeatCloseActionButton from "./RepeatCloseActionButton/RepeatCloseActionButton";
import { push } from "connected-react-router";
import { withSnackbar } from "notistack";
import ReloadButton from "./ReloadButton/ReloadButton";

export default withSnackbar(
  withTranslation()(
    connect(
      (store) => ({
        location: store.router.location.pathname,
      }),
      (dispatch) => ({
        raiseNotification: (notificationMessage) =>
          doRaiseNotification(dispatch, notificationMessage),
        goToMenu: () => dispatch(push("/menu")),
        goToGatheringComponents: () => dispatch(push("/gatherComponents")),
        goToComposition: () => dispatch(push("/composition")),
        doGetSchemasNames: (successChecker, errorChecker) =>
            doGetSchemasNames(dispatch, successChecker, errorChecker),
        doFetchComposition: (composition) =>
          doFetchComposition(dispatch, composition),
      })
    )(
      class App extends Component {
        static propTypes = {
          location: PropTypes.string.isRequired,

          goToMenu: PropTypes.func.isRequired,
          goToGatheringComponents: PropTypes.func.isRequired,
          goToComposition: PropTypes.func.isRequired,
          doFetchComposition: PropTypes.func.isRequired,
        };

        routes = [
          ["^/$", () => <Login />],
          ["^/menu", () => <Menu />],
          ["^/composition", () => <Composition />],
          ["^/gatherComponents", () => <GatherComponents />],
        ];

        constructor(props) {
          super(props);
        }

        state = {
          eventSource: null,
          reconnectInterval: 10,
          SSEErrorFlag: false,
        };

        setupSSEConnection = () => {
          if (
            this.state.eventSource !== null &&
            this.state.eventSource !== undefined
          ) {
            this.state.eventSource.close();
            this.setState({ eventSrouce: null });
            clearTimeout(this.state.reconnectTimer);
          }
          const eventSource = new EventSource(
            `${process.env.APPLICATION_SOCKET}/workbench/status/stream`
          );
          eventSource.onmessage = (e) => {
            let res = JSON.parse(e.data);

            this.props.doFetchComposition(res);
            let location = this.props.location.split("/")[1];
            switch (res.state) {
              case "ProductionStageOngoing":
                // console.log("PRODUCTION__ONGOING")
                if (location !== "composition") this.props.goToComposition();
                break;
              case "GatherComponents":
                // console.log("GATHER__COMPONENTS")
                if (location !== "gatherComponents")
                  this.props.goToGatheringComponents();
                break;
              case "AwaitLogin":
                // console.log("AWAIT__LOGIN")
                break;
              case "AuthorizedIdling":
                if (location !== "menu") {
                  this.props.goToMenu();
                  // console.log("==ROUTER== redirect to menu");
                }
                // console.log("AUTHORIZED__IDLING")
                break;
              case "UnitAssignedIdling":
                // console.log('UNIT__ASSIGNED__IDLING')
                if (location !== "composition") this.props.goToComposition();
                break;
              default:
                break;
            }
          };
          eventSource.onerror = (e) => {
            this.setState({ SSEErrorFlag: true });
            const errorEvent = this.props.enqueueSnackbar(
              `Cannot establish connection to the server. Retrying in ${this.state.reconnectInterval} seconds`,
              {
                variant: "error",
                persist: true,
                action: RepeatCloseActionButton.bind({
                  action: this.setupSSEConnection,
                  actionName: "Retry",
                }),
                preventDuplicate: true,
              }
            );
            this.setState({ errorEvent });
            this.state.eventSource.close();

            this.newReconnectSSE();
          };

          eventSource.onopen = (e) => {
            this.props.closeSnackbar(this.state.errorEvent);

            if (this.state.SSEErrorFlag) {
              this.props.enqueueSnackbar(
                "Connection to server restored.",
                {
                  variant: "success",
                  persist: false,
                  action: CloseActionButton,
                  preventDuplicate: false,
                }
              );
            } else {
              this.props.enqueueSnackbar("Server connection established", {
                variant: "success",
                persist: false,
                action: CloseActionButton,
                preventDuplicate: false,
              });
            }
          };
          this.setState({ eventSource });
        };

        newReconnectSSE = () => {
          if (
            this.state.errorEvent !== null &&
            this.state.errorEvent !== undefined
          ) {
            this.state.eventSource.close();
          }
          const reconnectTimer = setTimeout(() => {
            this.setupSSEConnection();
          }, 10000);

          this.setState({ reconnectTimer });
        };

        reconnectNotificationsSSE = () => {
          if (
            this.state.notificationsEventSource !== null &&
            this.state.notificationsEventSource !== undefined
          ) {
            this.state.notificationsEventSource.close();
          }
          const notificationsReconnectTimer = setTimeout(() => {
            this.setupNotificationsSSEConnection();
          }, 1000);
          this.setState({ notificationsReconnectTimer });
        };

        setupNotificationsSSEConnection = () => {
          if (
            this.state.notificationsEventSource !== null &&
            this.state.notificationsEventSource !== undefined
          ) {
            this.state.notificationsEventSource.close();
            this.setState({ notificationsEventSource: null });
            clearTimeout(this.state.notificationsReconnectTimer);
          }
          const notificationsEventSourse = new EventSource(
            `${process.env.APPLICATION_SOCKET}/notifications`
          );
          notificationsEventSourse.onmessage = (message) => {
            const res = JSON.parse(message.data);
            if (res.persist) {
              res.action = CloseActionButton;
            }
            this.props.enqueueSnackbar(res.message, { ...res });
          };
          notificationsEventSourse.onerror = () => {
            this.state.notificationsEventSourse.close();
            this.reconnectNotificationsSSE();
          };
          this.setState({ notificationsEventSourse });
        };

        componentDidMount() {
          this.setupSSEConnection();
          this.setupNotificationsSSEConnection();

          // Get all schemas list with their names
          this.props.doGetSchemasNames((res) => {
            if (res.status_code === 200) {
              if (
                res.available_schemas.length === 0 &&
                this.props.authorized
              ) {
                this.props.enqueueSnackbar(
                  "Warning! 0 assembly schemas available. Contact your administrator.",
                  { variant: "warning" }
                );
              }
              return true;
            } else {
              return false;
            }
          }, null);

        }

        route = (path) =>
          this.routes.find((r) => path.match(r[0]) !== null)?.[1]?.();

        render() {
          return (
            <>
              <Modal />
              <div
                className={styles.appWrapper}
                style={{ paddingBottom: "50px" }}
              >
                <div className={styles.header}>
                  <Header />
                </div>
                <div className={styles.pageWrapper}>
                  {this.route(this.props.location)}
                </div>
                <div className={styles.NotificationsWrapper}>
                  <Notifications />
                  {this.props.location !== "/" && <RevisionsTracker />}
                </div>
                <div className={styles.ReloadButtonWrapper}>
                  <ReloadButton />
                </div>
              </div>
            </>
          );
        }
      }
    )
  )
);
