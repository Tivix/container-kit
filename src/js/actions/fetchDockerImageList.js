// fetchDockerImageList.js


import bytes from 'bytes'

import loadDockerImageList from '../actions/loadDockerImageList';

// Helpers
export const initialize = () => {
  var Docker = require('../../../node_modules/dockerode/lib/docker')
  var fs     = require('fs');

  var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock'
  var stats  = fs.statSync(socket);

  if (!stats.isSocket()) {
    throw new Error('Are you sure the docker is running?')
  }

  var docker = new Docker({ socketPath: socket })

  return docker
}


export default function() {
  return (dispatch) => {

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

            //self.setState({imageArray:imageArray})
          }
          totalBytes = totalBytes + imageInfo.Size;
        })
        console.log(imageArray);
        dispatch(loadDockerImageList(imageArray));

        // self.setState({
        //   total: bytes(totalBytes),
        //   errorMessage: '',
        //   imageArray: imageArray
        // })
      })
      .catch( (err) => {
        // self.setState({
        //   errorMessage: err.message,
        // })
      });
  }
}
