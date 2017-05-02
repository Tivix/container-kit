require('../node_modules/bootstrap/less/bootstrap.less')
require('../less/main.less')


'use strict';

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Tab, Tabs } from 'react-bootstrap'

import Containers from './Containers'
import Toolbox from './Toolbox'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // Takes active tab from props if it is defined there
      activeTab: props.activeTab || 1
    }

    // Bind the handleSelect function already here (not in the render function)
    this.handleSelect = this.handleSelect.bind(this)
  }

  render() {
    return (
      <div className="myDiv center">
        <div className="center">
          <img src={'../imgs/logo.png'} />
        </div>
        <div className="container">
          <Tabs activeKey={this.state.activeTab} onSelect={this.handleSelect} id="menu">
            <Tab id="running" eventKey={1} title="Running Instances"><Containers listAll={false}/></Tab>
            <Tab id="all" eventKey={2} title="All Instances"><Containers listAll={true}/></Tab>
            <Tab id="toolbox" eventKey={3} title="Toolbox"><Toolbox /></Tab>
          </Tabs>
        </div>
      </div>
    );
  }

  handleSelect(selectedTab) {
    // The active tab must be set into the state so that
    // the Tabs component knows about the change and re-renders.
    this.setState({
      activeTab: selectedTab
    })
  }
}

ReactDOM.render(
  <App activeTab={1} />,
  document.getElementById('root')
);
