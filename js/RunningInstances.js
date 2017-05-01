import React, { Component } from 'react';
import ReactDOM from 'react-dom';


class RunningInstances extends Component {
  render() {
    return (
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr id="headerRowRun">
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
                PORTS
              </th>
              <th>
                NAMES
              </th>
            </tr>
          </thead>
        </table>
      </div>
    );
  }
}

export default RunningInstances;
