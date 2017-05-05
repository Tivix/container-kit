// Images.js


import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import FontAwesome from 'react-fontawesome'

import CircularProgress from 'material-ui/CircularProgress';
import FloatingActionButton from 'material-ui/FloatingActionButton'
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

import {
  initialize,
  removeContainer,
  stopContainer,
  purge,
  removeImage,
  SET_INTERVAL_TIME
} from './scripts'


const style = {
  margin: 12,
};

const faStyle = {
  margin: 5
}

const marginTp = {
  marginTop: '3em'
}

const circleStyle = {
  display: 'none'
}

const paperStyle = {
  height: 'auto',
  width: '100%',
  textAlign: 'center',
  display: 'inline-block',
  marginTop: '2em'
};

const tdStyle = {
  paddingLeft: 15,
  paddingRight: 15
}


class Images extends Component {

  constructor(props) {
    super(props);

    this.state = {
      total: '0B',
      errorMessage: '',
      imageArray: []
    };

    this.runImages = this.runImages.bind(this);
    this.deleteButton = this.deleteButton.bind(this);
  }

  componentDidMount() {
    let intervalId = setInterval(this.runImages, SET_INTERVAL_TIME)
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
              <TableHeaderColumn>OPTIONS</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              this.state.imageArray.map( (image, index) => (
                <TableRow key={index}>
                  <TableRowColumn>{image.imageTag}</TableRowColumn>
                  <TableRowColumn>{image.id}</TableRowColumn>
                  <TableRowColumn>{image.created}</TableRowColumn>
                  <TableRowColumn>{image.size}</TableRowColumn>
                  <TableRowColumn style={tdStyle}>
                    {/* Need to figure out why these are auto firing...preventDefault for now */}
                    <FloatingActionButton
                      id={image.id+"-delete-button"}
                      mini={true}
                      style={faStyle}
                      onTouchTap={ (e) => { e.preventDefault(); this.deleteButton(image.id);}}>
                      <FontAwesome name="trash" size="2x" />
                    </FloatingActionButton>
                    <FontAwesome id={image.id+"-circle-progress"} style={circleStyle} className="fa-pulse" size="3x" name="spinner" spin />
                  </TableRowColumn>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        {this.emptyCheck()}
        <Paper style={paperStyle} zDepth={3}>
          <h1>Total image disk space: {this.state.errorMessage === '' ? this.state.total : this.state.errorMessage}</h1>
        </Paper>
      </div>
    )
  }

  emptyCheck() {
    if(this.state.imageArray.length === 0) {
      return (
        <div className="center" style={marginTp}>
          <FontAwesome name="battery-quarter" size="4x" />
        </div>
      )
    }
  }

  deleteButton(iid) {
    document.getElementById(iid+'-delete-button').disabled = true
    document.getElementById(iid+'-circle-progress').style.display = 'inline-block'
    removeImage(iid)
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
          imageArray: imageArray
        })
      }, (err) => {
        self.setState({
          errorMessage: err.message,
        })
      })
  }
}

export default Images
