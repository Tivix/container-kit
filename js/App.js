require('../node_modules/bootstrap/less/bootstrap.less')
require('../node_modules/font-awesome/less/font-awesome.less')
require('../less/main.less')


'use strict';

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import FontAwesome from 'react-fontawesome'

import {Tabs, Tab} from 'material-ui/Tabs'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

import Containers from './Containers'
import Toolbox from './Toolbox'


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


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
      <MuiThemeProvider>
        <div className="myDiv center">
          <div className="center">
            <img src={'../imgs/logo.png'} />
          </div>
          <div className="container">
            <Tabs>
              <Tab icon={<FontAwesome name="ship" />} label="Running Containers">
                <Containers listAll={false}/>
              </Tab>
              <Tab icon={<FontAwesome name="car" />} label="All Containers">
                <Containers listAll={true}/>
              </Tab>
              <Tab icon={<FontAwesome name="info-circle" />} label="IMAGES">
                <Toolbox />
              </Tab>
            </Tabs>
          </div>
        </div>
      </MuiThemeProvider>
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
