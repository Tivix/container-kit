import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Table } from 'react-bootstrap';

import { exec } from 'child_process';


class Toolbox extends Component {

  constructor(props) {
    super(props);
    this.runToolbox = this.runToolbox.bind(this);
  }

  componentDidMount() {
    console.log('mounted');
    this.runToolbox();
  }

  render() {
    return (
      <div id="total">

      </div>
    )
  }

  runToolbox() {
    var Docker = require('../node_modules/dockerode/lib/docker')
    var fs     = require('fs');
    var bytes = require('bytes');

    var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
    var stats  = fs.statSync(socket);

    if (!stats.isSocket()) {
      throw new Error('Are you sure the docker is running?');
    }

    console.log('run toolboz');
    var docker = new Docker({ socketPath: socket });
    var total = 0;

    docker.listImages({all: true}, function(err, images) {
      images.forEach(function (imageInfo) {
        if (imageInfo.RepoTags && imageInfo.RepoTags.length > 0) console.log(imageInfo.RepoTags[0]);
        total = total + imageInfo.Size;
        console.log(imageInfo.Size);
      });
      var t = document.getElementById('total');
      t.innerHTML = bytes(total);
    });
  }
}

export default Toolbox;
