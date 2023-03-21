import React, { Component, createRef } from 'react'
import styled from 'styled-components'
import { ReactComponent as LoadingIcon } from '../icons/Loading.svg'
import PropTypes from 'prop-types'

const StyledButton = styled.button`
  position: relative;
  font-size: 20px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.text ? `var(${props.text})` : '#fff'};
  //color: #000;
  width: ${({ block }) => block && '100%'};
  height: ${props => props.height};
  padding: ${props => props.padding || '12px 16px'};
  max-width: ${props => props.width};
  width: ${props => props.staticWidth};
  margin: ${({ margin }) => margin};
  padding: ${({ padding }) => padding};
  border-radius: ${props => props.radius || '50px'};
  background: ${({ color }) => color && color.indexOf('#') !== -1 ? color : `var(--${color})`};

  .circle {
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
    background-color: white;
    opacity: 0;
    transition: opacity .2s
  }

  /* &:focus {
    overflow: initial;
  } */

  &:active {
    overflow: hidden;

    & .circle {
      opacity: .3;
    }
  }

  &:disabled {
    cursor: unset;
    background-color: ${({ disabledColor }) => disabledColor};
    opacity: ${({ disabledOpacity = '.5' }) => disabledOpacity}
  }

  ${({ color, icon, radius = '50px' }) => !icon && `
    &:focus::before {
      height: calc(100% + 6px);
      width: calc(100% + 6px);
      content: '';
      z-index: -1;
      position: absolute;
      border-radius: calc(${radius} + 8px);
      background-color: ${color && color.indexOf('#') !== -1 ? color : `var(--${color})`};
      opacity: .3;
      content: '';
      position: absolute;
    }
  `}

  ${({ icon, width = 'auto', padding = '2px' }) => icon && `
    width: ${width};
    height: ${width};
    padding: 0;
    line-height: calc(${width} - calc(${padding} * 2));
  `}

  @keyframes rotating {
    from {
      -ms-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -ms-transform: rotate(360deg);
      -moz-transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
      -o-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  .loader {
    -webkit-animation: rotating 2s linear infinite;
    -moz-animation: rotating 2s linear infinite;
    -ms-animation: rotating 2s linear infinite;
    -o-animation: rotating 2s linear infinite;
    animation: rotating 2s linear infinite;
    path {
      stroke: white;
    }
  }
`

const StyledRegularButton = styled(StyledButton)`
  border: none;

  &:not(:disabled):hover::before {
    border-radius: ${({ radius = '50px' }) => radius};
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: .1;
  }
`

const StyledOutlinedButton = styled(StyledButton)`
  border: solid 1px transparent;
  background-origin: border-box;
  border-width: ${props => props.borderWidth};

  & > * {
    position: relative;
    mix-blend-mode: multiply;
    z-index: 10;
  }
  &::after {
    border-radius: ${props => props.radius || '50px'};

    position: absolute;
    width: 100%;
    height: 100%;
    background: white;
    content: '';
    z-index: 2;
  }

  &:hover::before {
    border-radius: ${props => props.radius || '50px'};
    position: absolute;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    background: black;
    content: '';
    z-index: 1;
    opacity: .3;
  }
`

const StyledSubtleButton = styled(StyledButton)`
  border: 2px solid #D6D8E7;
`

const StyledTextButton = styled(StyledRegularButton)`
  background: none;
`

export default class Button extends Component {
  
  static propTypes = {
    loading : PropTypes.bool,
    onClick : PropTypes.func,
    outlined: PropTypes.bool,
    subtle  : PropTypes.bool,
    textable: PropTypes.bool,
    regular : PropTypes.bool,
  }
  
  moveCircle(e) {
    e.preventDefault()
    e.stopPropagation()
    const {
      top,
      left
    } = e.currentTarget.getBoundingClientRect()
    const {
      clientY,
      clientX
    } = e
    
    this.setState({ top: clientY - top, left: clientX - left })
  }
  
  state = { top: 0, left: 0 }
  circleRef = createRef()
  
  render() {
    if (this.props.outlined) {
      return (
        <StyledOutlinedButton
          {...this.props}
          onMouseDown={this.moveCircle.bind(this)}
        >
          {this.props.loading ? <LoadingIcon className="loader"/> : this.props.children}
          <span
            style={{
              top: this.state.top,
              left: this.state.left
            }}
            className="circle"
          />
        </StyledOutlinedButton>
      )
    }
    if (this.props.subtle) {
      return (
        <StyledSubtleButton
          {...this.props}
          onMouseDown={this.moveCircle.bind(this)}
        >
          {this.props.loading ? <LoadingIcon className="loader"/> : this.props.children}
          <span
            style={{
              top: this.state.top,
              left: this.state.left
            }}
            className="circle"
          />
        </StyledSubtleButton>
      )
    }
    
    if (this.props.textable) {
      return (
        <StyledTextButton
          {...this.props}
          onMouseDown={this.moveCircle.bind(this)}
        >
          {this.props.loading ? <span>...Loading</span> : this.props.children}
          <span
            style={{
              top: this.state.top,
              left: this.state.left
            }}
            className="circle"
          />
        </StyledTextButton>
      )
    }
    
    if (this.props.regular) {
      return (
        <StyledButton disabled={this.props.loading || undefined} onClick={this.props.onClick}>
          {this.props.loading ? <LoadingIcon className="loader" /> : this.props.children}
          <span
            style={{
              top: this.state.top,
              left: this.state.left
            }}
            className="circle"
          />
        </StyledButton>
      )
    }
    
    return (
      <StyledRegularButton
        {...this.props}
        onMouseDown={this.moveCircle.bind(this)}
      >
        {this.props.loading ? <LoadingIcon className="loader"/> : this.props.children}
        <span
          style={{
            top: this.state.top,
            left: this.state.left
          }}
          className="circle"
        />
      </StyledRegularButton>
    )
  }
}
