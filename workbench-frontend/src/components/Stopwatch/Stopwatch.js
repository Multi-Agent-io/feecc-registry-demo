import React from 'react';
import PropTypes from "prop-types";

export default class Stopwatch extends React.Component {
  static propTypes = {
    setStepDuration: PropTypes.func
  }

  constructor(props) {
    super(props);

    this.state = {
      running: false,
      currentTimeMs: 0,
      currentTimeSec: 0,
      currentTimeMin: 0,
      currentTimeHrs: 0
    };
  }

  componentWillUnmount() {
    clearInterval(this.watch)
  }

  isRunning = () => {
    return this.state.running
  }

  sendTime = () => {
    this.props.setStepDuration && this.props.setStepDuration(this.state.currentTimeSec + this.state.currentTimeMin * 60 + this.state.currentTimeHrs * 3600)
  }

  start = () => {
    if (!this.state.running) {
      this.setState({ running: true });
      this.watch = setInterval(() => this.pace(), 100);
    }
  };

  stop = () => {
    this.setState({ running: false });
    clearInterval(this.watch);
  };

  pace = () => {
    this.setState({ currentTimeMs: this.state.currentTimeMs + 100 });
    if (this.state.currentTimeMs >= 1000) {
      this.setState({ currentTimeSec: this.state.currentTimeSec + 1, currentTimeMs: 0 });
    }
    if (this.state.currentTimeSec >= 60) {
      this.setState({ currentTimeMin: this.state.currentTimeMin + 1, currentTimeSec: 0 });
    }
    if (this.state.currentTimeMin >= 60) {
      this.setState({ currentTimeHrs: this.state.currentTimeHrs + 1, currentTimeMin: 0})
    }
    this.sendTime()
  };

  reset = () => {
    this.setState({
      currentTimeMs: 0,
      currentTimeSec: 0,
      currentTimeMin: 0,
      currentTimeHrs: 0
    });
  };

  render() {
    return (
      <div className={'stopwatch'}>
        {(`0${this.state.currentTimeHrs}`).slice(-2)}:{(`0${ this.state.currentTimeMin }`.slice(-2))}:{(`0${this.state.currentTimeSec}`).slice(-2)}
      </div>
    );
  }
}
