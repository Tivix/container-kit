import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import fetchDockerContainerList from '../actions/fetchDockerContainerList';

import Containers from '../components/Containers';


const mapStateToProps = (state) => {
  return {
    dockerContainers: state.dockerContainers.data
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({fetchDockerContainerList}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Containers);
