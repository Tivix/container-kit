// Containers.js


import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import FontAwesome from 'react-fontawesome'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import { initialize, formatPorts, removeContainer, stopContainer, SET_INTERVAL_TIME } from './scripts'


const faStyle = {
  margin: 5
}

const hintStyle = {
  zIndex: 99999999,
  overflow: 'visible'
}

const tdStyle = {
  paddingLeft: 15,
  paddingRight: 15
}

const circleStyle = {
  display: 'none'
}


class Containers extends Component {

  constructor(props) {
    super(props)
    this.state = {
      containers: [],
      intervalId: null
    };
    this.allContainers = this.allContainers.bind(this)
    //this.removeContainer = this.removeContainer.bind(this)
  }


  /**
   * allContainers
   *
   * List all running/stopped containers
   */
  allContainers() {
    let c = [],
        self = this,
        docker = initialize()

    docker.listContainers({all: true}, (err, containers) => {
      containers.forEach((containerInfo) => {
        let timeago = require('time-ago')(),
            newDate = timeago.ago(new Date(containerInfo.Created * 1000)),
            ports = formatPorts(containerInfo.Ports),
            running = false

        if(containerInfo.State === 'running') running = true

        c.push({
          id: containerInfo.Id.substring(0,11),
          image: containerInfo.Image,
          command: containerInfo.Command,
          created: newDate,
          status: containerInfo.Status,
          ports: ports,
          running: running
        })
      })

      self.setState({containers: c})
    })
  }


  /**
   * isRunning
   * @param  {Boolean}   run     Container running or not
   * @return  {String}           Css class for red/green left row border
   */
  isRunning(run) {
    if(run) return "running"
    else return "not-running"
  }

  // change these two
  componentDidMount() {
    let intervalId = setInterval(this.allContainers, SET_INTERVAL_TIME)
    this.setState({intervalId: intervalId})
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  render() {
    return (
      <div>
        <Table>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}>
            <TableRow>
              <TableHeaderColumn>CONTAINER ID</TableHeaderColumn>
              <TableHeaderColumn>IMAGE</TableHeaderColumn>
              <TableHeaderColumn>COMMAND</TableHeaderColumn>
              <TableHeaderColumn>CREATED</TableHeaderColumn>
              <TableHeaderColumn>STATUS</TableHeaderColumn>
              <TableHeaderColumn>PORTS</TableHeaderColumn>
              <TableHeaderColumn>OPTIONS</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              this.state.containers.map( (container, index) => (
                <TableRow key={index} className={this.isRunning(container.running)}>
                  <TableRowColumn style={tdStyle}>{container.id}</TableRowColumn>
                  <TableRowColumn style={tdStyle}>{container.image}</TableRowColumn>
                  <TableRowColumn style={tdStyle}>{container.command}</TableRowColumn>
                  <TableRowColumn style={tdStyle}>{container.created}</TableRowColumn>
                  <TableRowColumn style={tdStyle}>{container.status}</TableRowColumn>
                  <TableRowColumn style={tdStyle}>{container.ports}</TableRowColumn>
                  <TableRowColumn style={tdStyle}>
                    {/* Need to figure out why these are auto firing...preventDefault for now */}
                    <FloatingActionButton
                      id={container.id+"-delete-button"}
                      mini={true}
                      onTouchTap={(e) => {e.preventDefault(); removeContainer(container.id);}} style={faStyle} disabled={container.running}>
                      <FontAwesome name="trash" size="2x" />
                    </FloatingActionButton>
                    <FloatingActionButton
                      id={container.id+"-stop-button"}
                      mini={true}
                      onTouchTap={(e) => {e.preventDefault(); stopContainer(container.id);}} style={faStyle} disabled={!container.running}>
                      <FontAwesome name="stop-circle-o" size="2x" />
                    </FloatingActionButton>
                    <FontAwesome id={container.id+"-circle-progress"} style={circleStyle} className="fa-pulse" size="3x" name="spinner" spin />
                  </TableRowColumn>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default Containers;
