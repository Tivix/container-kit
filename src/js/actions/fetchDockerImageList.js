// fetchDockerImageList.js


import bytes from 'bytes'

import { initialize } from '../utils/scripts';

import loadDockerImageList from '../actions/loadDockerImageList';
import setTotalBytes from '../actions/setTotalBytes';


export default function() {
  return (dispatch) => {

    let docker = initialize(),
        imageArray = [],
        self = this;

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
