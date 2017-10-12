// fetchDockerContainerList.js

import { initialize } from '../utils/scripts';
import loadDockerContainerList from '../actions/loadDockerContainerList';


export default () => {
  return (dispatch) => {
    console.log('entered fetch')
    let c = [],
        docker = initialize()

    docker.listContainers({all: true})
      .then( (containers) => {
        containers.forEach((containerInfo) => {
          let timeago = require('time-ago')(),
              newDate = timeago.ago(new Date(containerInfo.Created * 1000)),
              ports = formatPorts(containerInfo.Ports),
              running = false;

          if(containerInfo.State === 'running') running = true;

          c.push({
            id: containerInfo.Id.substring(0,11),
            image: containerInfo.Image,
            command: containerInfo.Command,
            created: newDate,
            status: containerInfo.Status,
            ports: ports,
            running: running
          })
        })
        console.log('getting list');
        dispatch(loadDockerContainerList(c));
      })
      .catch( (err) => {
        console.log('failed getting list');
      });
  }
}

export const formatPorts = (portsArray) => {
  var portStringArray = []
  var stringDict = {}

  if (portsArray.length > 0) {
    for (var i=0;i < portsArray.length;i++) {
      switch(portsArray.length) {
        case 1:
          var privatePort = portsArray[i].PrivatePort
          var type_ = portsArray[i].Type

          return `${privatePort}/${type_}`
          break

        default:
          var ip,
              type_,
              publicPort,
              privatePort,
              portString = ''

          if(portsArray[i].hasOwnProperty("IP")) {
            ip = portsArray[i].IP
            portString += `${ip}`
          }

          if(portsArray[i].hasOwnProperty("PublicPort")) {
            publicPort = portsArray[i].PublicPort
            portString += `:${publicPort}`
          }

          if(portsArray[i].hasOwnProperty("PrivatePort")) {
            privatePort = portsArray[i].PrivatePort
            if(portsArray[i].hasOwnProperty("PublicPort")) portString += `->${privatePort}`
            else portString += `${privatePort}`
          }
          if(portsArray[i].hasOwnProperty("Type")) {
            type_ = portsArray[i].Type
            portString += `/${type_}`
          }
          portStringArray.push(portString)
          break
      } // end switch
    } // endfor

    return portStringArray.join(', ')
  } // end if
}
