require('../../node_modules/bootstrap/less/bootstrap.less')
require('../../node_modules/font-awesome/less/font-awesome.less')
require('../less/main.less')


'use strict';


import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import FontAwesome from 'react-fontawesome'

import {Tabs, Tab} from 'material-ui/Tabs'
import {cyan500, grey500} from 'material-ui/styles/colors'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import injectTapEventPlugin from 'react-tap-event-plugin'

import Containers from './Containers'
import Images from './Images'


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


// This replaces the textColor value on the palette
// and then update the keys for each component that depends on it.
// More on Colors: http://www.material-ui.com/#/customization/colors
const muiTheme = getMuiTheme({
  palette: {
    textColor: cyan500,
    accent1Color: '#212121',
    pickerHeaderColor: grey500,
    primary1Color: grey500,
    primary2Color: grey500
  },
  appBar: {
    height: 50,
  },
});


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
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="myDiv center">
          <div className="center">
            <img src={'../src/imgs/logo.png'} />
          </div>
          <Tabs>
            <Tab icon={<FontAwesome name="ship" />} label="CONTAINERS">
              <Containers />
            </Tab>
            <Tab icon={<FontAwesome name="file-image-o" />} label="IMAGES">
              <Images />
            </Tab>
          </Tabs>
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
  <App />,
  document.getElementById('root')
);
