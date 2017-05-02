// Toolbox.js


// import { ipcRenderer, dialog } from 'electron';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table, Button } from 'react-bootstrap';

import bytes from 'bytes'

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
        <div>
          Total image disk space:
          <h2>{this.state.errorMessage === '' ? this.state.total : this.state.errorMessage}</h2>
        </div>

        <div className="well">
          <Button id="remove-images-btn" onClick={this.removeAllImages} bsStyle="primary" bsSize="large" block>Remove All Images</Button>
        </div>
      </div>
    )
  }

  removeAllImages() {
    let docker = initialize(),
        errStrArray = []

    const removeImagesBtn = document.getElementById('remove-images-btn')
    const dialog = require('electron').remote.dialog

    docker.listImages({all: true}, (err, images) => {
      images.forEach((imageInfo, idx, array) => {
        docker.getImage(imageInfo.Id).remove((er, img) => {
          if(er) {

            let splitStr = er.toString().split('-'),
                s = splitStr[splitStr.length - 1]

            if(!errStrArray.includes(s)) errStrArray.push(s)

            if(idx === array.length - 1) {
              dialog.showErrorBox('Removing Images', errStrArray.join('\n\n'))
            }
          }
        })
      })
    })
  }

  runToolbox() {

    let docker = initialize(),
        totalBytes = 0,
        self = this

    docker.listImages({all: true})
      .then((images) => {
        images.forEach((imageInfo) => {
          if (imageInfo.RepoTags && imageInfo.RepoTags.length > 0) console.log(imageInfo.RepoTags[0]);
          totalBytes = totalBytes + imageInfo.Size;
          console.log(imageInfo.Size);
        })

        self.setState({
          total: bytes(totalBytes),
          errorMessage: '',
        })
      }, (err) => {
        self.setState({
          errorMessage: err.message,
        })
      })
  }
}

export default Toolbox
