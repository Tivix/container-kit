require('../node_modules/bootstrap/less/bootstrap.less')
require('../node_modules/font-awesome/less/font-awesome.less')
require('../less/main.less')


'use strict';

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Tab, Tabs, Row, Col, Nav, NavItem } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

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
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row className="clearfix">
              <Col sm={12}>
                <Nav bsStyle="pills">
                  <NavItem eventKey="first">
                    <h4>Running Containers <FontAwesome name="ship" /></h4>
                  </NavItem>
                  <NavItem eventKey="second">
                    <h4>All Containers <FontAwesome name="car" /></h4>
                  </NavItem>
                  <NavItem eventKey="third">
                    <h4>Toolbox <FontAwesome name="info-circle" /></h4>
                  </NavItem>
                </Nav>
              </Col>
              <Col sm={12}>
                <Tab.Content animation>
                  <Tab.Pane eventKey="first">
                    <Containers listAll={false}/>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <Containers listAll={true}/>
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <Toolbox />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
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
