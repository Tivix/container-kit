// Containers.js


import PropTypes from 'prop-types';

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


const defaultProps = {
  dockerContainers: [],
  fetchDockerContainerList() {},
  deleteContainer() {}
};

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

const marginTp = {
  marginTop: '3em'
}


class Containers extends Component {

  constructor(props) {
    super(props);

    this.state = { };

    //this.fetchDockerContainerList = this.props.fetchDockerContainerList.bind(this);
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

  // emptyCheck() {
  //   if(this.state.containers.length === 0) {
  //     return (
  //       <div className="center" style={marginTp}>
  //         <FontAwesome name="battery-quarter" size="4x" />
  //       </div>
  //     )
  //   }
  // }

  componentDidMount() {
    let intervalId = setInterval(this.props.fetchDockerContainerList(), 1000);
    //this.setState({intervalId: intervalId})
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
              this.props.dockerContainers.map( (container, index) => (
                <TableRow key={index} className={this.isRunning(container.running)}>
                  <TableRowColumn style={tdStyle}>{container.id}</TableRowColumn>
                  <TableRowColumn style={tdStyle}>{container.image}</TableRowColumn>
                  <TableRowColumn style={tdStyle}>{container.command}</TableRowColumn>
                  <TableRowColumn style={tdStyle}>{container.created}</TableRowColumn>
                  <TableRowColumn style={tdStyle}>{container.status}</TableRowColumn>
                  <TableRowColumn style={tdStyle}>{container.ports}</TableRowColumn>
                  <TableRowColumn style={tdStyle}>
                    <FloatingActionButton
                      disabled={container.running}
                      mini={true}
                      onTouchTap={(e) => {e.preventDefault(); console.log('pressed delete button for', container.id); this.props.deleteContainer(container.id);}}
                      style={faStyle}>
                      <FontAwesome name="trash" size="2x" />
                    </FloatingActionButton>
                    <FloatingActionButton
                      disabled={!container.running}
                      mini={true}>
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

Containers.propTypes = {
  dockerContainers: PropTypes.array.isRequired,
  fetchDockerContainerList: PropTypes.func.isRequired,
  deleteContainer: PropTypes.func.isRequired
};

Containers.defaultProps = defaultProps;

export default Containers;
