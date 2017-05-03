// Images.js


// import { ipcRenderer, dialog } from 'electron';

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'

import bytes from 'bytes'

import { initialize } from './scripts'


const style = {
  margin: 12,
};

const paperStyle = {
  height: 'auto',
  width: '100%',
  textAlign: 'center',
  display: 'inline-block',
  marginTop: '2em'
};


class Images extends Component {

  constructor(props) {
    super(props);

    this.state = {
      total: '0 bytes',
      errorMessage: '',
      imageArray: []
    };

    this.runImages = this.runImages.bind(this);
    this.removeAllImages = this.removeAllImages.bind(this);
  }

  componentDidMount() {
    let intervalId = setInterval(this.runImages, 2000)
    this.setState({intervalId: intervalId})
  }

  render() {
    return (
      <div>
        <Table>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}>
            <TableRow>
              <TableHeaderColumn>REPO:TAG</TableHeaderColumn>
              <TableHeaderColumn>IMAGE ID</TableHeaderColumn>
              <TableHeaderColumn>CREATED</TableHeaderColumn>
              <TableHeaderColumn>SIZE</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              this.state.imageArray.map( (image, index) => (
                <TableRow key={index}>
                  <TableRowColumn>{image.imageTag}</TableRowColumn>
                  <TableRowColumn>{image.id}</TableRowColumn>
                  <TableRowColumn>{image.size}</TableRowColumn>
                  <TableRowColumn>{image.created}</TableRowColumn>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        <Paper style={paperStyle} zDepth={3}>
          <h2>Total image disk space: {this.state.errorMessage === '' ? this.state.total : this.state.errorMessage}</h2>
          <RaisedButton id="remove-images-btn" onTouchTap={this.removeAllImages} label="Remove All Images" primary={true} style={style} />
        </Paper>
      </div>
    )
  }


  /**
   * removeAllImages
   *
   * Remove all images if they are stopped/not running
   */
  removeAllImages() {
    let docker = initialize(),
        errStrArray = [],
        messageOptions = {
          title: "errr",
          type: "warning",
          buttons: ['Stop/Remove', 'Cancel']
        },
        self = this

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
              dialog.showMessageBox(messageOptions, (response) => {
                //if(response === 0) self.stopRemoveContainers()
              })
            }
          }
        })
      })
    })
  }


  /**
   * runImages
   *
   * get detail of images and list them
   */
  runImages() {

    let docker = initialize(),
        imageArray = [],
        totalBytes = 0,
        self = this

    docker.listImages({all: true})
      .then((images) => {
        images.forEach((imageInfo) => {
          if (imageInfo.RepoTags && imageInfo.RepoTags.length > 0 && imageInfo.RepoTags[0].toString() !== '<none>:<none>') {
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

export default Images
