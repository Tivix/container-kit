import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Table, Button } from 'react-bootstrap';

import { exec } from 'child_process';

import { initialize } from './scripts';


class Toolbox extends Component {

  constructor(props) {
    super(props);

    this.state = {
      total: '0 bytes',
      errorMessage: '',
    };

    this.runToolbox = this.runToolbox.bind(this);
    this.removeAllImages = this.removeAllImages.bind(this);
  }

  componentDidMount() {
    console.log('mounted');
    this.runToolbox();
  }

  render() {
    return (
      <div>
        <h2>{this.state.errorMessage === '' ? this.state.total : this.state.errorMessage}</h2>
        <div className="well">
          <Button onClick={this.removeAllImages} bsStyle="primary" bsSize="large" block>Remove All Images</Button>
        </div>
      </div>
    )
  }

  removeAllImages() {
    var docker = initialize();
    docker.listImages({all: true}, function(err, images) {
      images.forEach(function (imageInfo) {
        docker.getImage(imageInfo.Id).remove();
        console.log('removing image');
      });
    });
  }

  runToolbox() {

    var docker = initialize();
    var bytes = require('bytes');
    var totalBytes = 0;
    var self = this;

    docker.listImages({all: true})
      .then(function(images) {
        images.forEach(function (imageInfo) {
          if (imageInfo.RepoTags && imageInfo.RepoTags.length > 0) console.log(imageInfo.RepoTags[0]);
          totalBytes = totalBytes + imageInfo.Size;
          console.log(imageInfo.Size);
        });

        self.setState({
          total: bytes(totalBytes),
          errorMessage: '',
        });
      }, function(err) {
        self.setState({
          errorMessage: err.message,
        });
      });
  }
}

export default Toolbox;
