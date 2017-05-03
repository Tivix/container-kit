import React, { Component } from 'react'
import ReactDOM from 'react-dom'
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


class Containers extends Component {

  constructor(props) {
    super(props)
    this.state = {
      containers: []
    };
    this.allContainers = this.allContainers.bind(this)
  }

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

        console.log(containerInfo)
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

  isRunning(run) {
    if(run) return "running"
    else return "not-running"
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
