import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import fetchDockerImageList from '../actions/fetchDockerImageList';

import Images from '../components/Images';


const mapStateToProps = (state) => {
  return {
    dockerImages: state.dockerImages.data
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({fetchDockerImageList}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Images);
