import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import fetchDockerContainerList from '../actions/fetchDockerContainerList';

//import Containers from '../components/Containers';


class DockerContainerList extends Component {

  createListItems() {
    console.log('asdf')
    var asdf = this.props.fetchDockerContainerList()
    console.log(asdf)
    return asdf.data.map( (dc) => {
      <li key={dc.id}>{ dc.id }</li>
    });
  }

  render() {
    return (

      <ul>
        <li onClick={() => this.props.fetchDockerContainerList()}>test</li>
        {/* {setInterval(this.createListItems.bind(this), 1000)} */}
      </ul>
    );
  }
}

function mapStateToProps(state) {
  return {
    dockerContainers: state.dockerContainers.data
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchDockerContainerList}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DockerContainerList);
