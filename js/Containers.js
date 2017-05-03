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

import { initialize, formatPorts } from './scripts'


const faStyle = {
  margin: 5
}

class Containers extends Component {

  constructor(props) {
    super(props)
    this.state = {
      containers: [],
      intervalId: null
    };
    this.allContainers = this.allContainers.bind(this)
    this.removeContainer = this.removeContainer.bind(this)
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


  /**
   * removeContainer
   * @param  {String}   containerId     Id of container
   *
   * Removes container by id
   */
  removeContainer(containerId) {
    let docker = initialize()

    docker.getContainer(containerId).remove()
  }

  /**
   * stopContainer
   * @param  {String}   containerId     Id of container
   *
   * Stops container by id
   */
  stopContainer(containerId) {
    let docker = initialize()

    docker.getContainer(containerId).stop()
  }

  // change these two
  componentDidMount() {
    let intervalId = setInterval(this.allContainers, 2000)
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
                  <TableRowColumn>{container.id}</TableRowColumn>
                  <TableRowColumn>{container.image}</TableRowColumn>
                  <TableRowColumn>{container.command}</TableRowColumn>
                  <TableRowColumn>{container.created}</TableRowColumn>
                  <TableRowColumn>{container.status}</TableRowColumn>
                  <TableRowColumn>{container.ports}</TableRowColumn>
                  <TableRowColumn>
                    <FloatingActionButton
                      mini={true}
                      onTouchTap={(e) => {e.preventDefault(); this.removeContainer(container.id);}} style={faStyle} disabled={container.running}>
                      <FontAwesome name="trash" size="2x" />
                    </FloatingActionButton>
                    <FloatingActionButton
                      mini={true}
                      onTouchTap={(e) => {e.preventDefault(); this.stopContainer(container.id);}} style={faStyle} disabled={!container.running}>
                      <FontAwesome name="stop-circle-o" size="2x" />
                    </FloatingActionButton>
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
