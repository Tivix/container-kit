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
      imageArray: []
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
        <div className="table-responsive">
          <Table responsive>
            <thead>
              <tr id="headerRow">
                <th>
                  <span>
                    REPO:TAG
                  </span>
                </th>
                <th>
                  <span>
                    IMAGE ID
                  </span>
                </th>
                <th>
                  <span>
                    CREATED
                  </span>
                </th>
                <th>
                  <span>
                    SIZE
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.imageArray.map((image, i) => (
                  <tr>
                    <td>{image.id}</td>
                    <td>{image.imageTag}</td>
                    <td>{image.size}</td>
                    <td>{image.created}</td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </div>
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
        errStrArray = [],
        messageOptions = {
          title: "errr",
          type: "warning",
          buttons: ['Stop/Remove', 'Cancel']
        }

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
              //dialog.showMessageBox('Removing Images', errStrArray.join('\n\n'))
              dialog.showMessageBox(messageOptions, () => { })
            }
          }
        })
      })
    })
  }

  runToolbox() {

    let docker = initialize(),
        imageArray = [],
        totalBytes = 0,
        self = this

    docker.listImages({all: true})
      .then((images) => {
        images.forEach((imageInfo) => {
          if (imageInfo.RepoTags && imageInfo.RepoTags.length > 0 && imageInfo.RepoTags[0].toString() !== '<none>:<none>') {
            console.log(imageInfo)
            let ta = require('time-ago')(),
                newDate = ta.ago(new Date(imageInfo.Created * 1000))

            imageArray.push({
              created: newDate,
              imageTag: imageInfo.RepoTags[0],
              size: bytes(imageInfo.Size),
              id: imageInfo.Id.split(':')[1].substring(0,11)
            })

            self.setState({imageArray:imageArray})
          }
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
