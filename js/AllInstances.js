import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Table } from 'react-bootstrap';

import { exec } from 'child_process';

class AllInstances extends Component {

  constructor(props) {
    super(props);
    this.state = {
      containers: []
    };
    this.allContainers = this.allContainers.bind(this);
  }

  allContainers() {
    var dockerps = exec('docker ps -a');
    var _containers = [];
    dockerps.stdout.on('data', function(data) {
      var str = data.toString(), lines = str.split(/(\r?\n)/g);
      for (var i=1; i<lines.length; i++) {
        if (lines[i].length == 1 || lines[i] == "") continue;

        console.log(lines[i]);
        var dockerData = lines[i].split(/\  +/);
        console.log(dockerData);
        _containers.push(dockerData);
      }
      console.log(_containers);

    });
    this.setState({ containers: _containers })
  }

  componentDidMount() {
    var intervalId = setInterval(this.allContainers, 2000);
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  render() {
    console.log(this.state.containers);
    return (
      <div className="table-responsive">
        <Table responsive>
          <thead>
            <tr id="headerRowAll">
              <th>
                CONTAINER ID
              </th>
              <th>
                IMAGE
              </th>
              <th>
                COMMAND
              </th>
              <th>
                CREATED
              </th>
              <th>
                STATUS
              </th>
              <th>
                NAMES
              </th>
            </tr>
          </thead>
          <tbody>
            { this.state.containers }
          </tbody>
        </Table>

      </div>
    );
  }
}

export default AllInstances;
