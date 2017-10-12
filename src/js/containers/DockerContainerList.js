// DockerContainerList.js


import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { deleteContainer } from '../actions/deleteContainer';
import fetchDockerContainerList from '../actions/fetchDockerContainerList';

import Containers from '../components/Containers';


const mapStateToProps = (state) => {
  return {
    dockerContainers: state.dockerContainers.data
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({fetchDockerContainerList, deleteContainer}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Containers);
