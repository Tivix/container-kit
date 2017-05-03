// scripts.js


export const initialize = () => {
  var Docker = require('../node_modules/dockerode/lib/docker')
  var fs     = require('fs');

  var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock'
  var stats  = fs.statSync(socket);

  if (!stats.isSocket()) {
    throw new Error('Are you sure the docker is running?')
  }

  var docker = new Docker({ socketPath: socket })

  return docker
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

/**
 * showBox
 * @param  {String}   title     Title of message box
 * @param  {String}   message   Message to display
 *
 * Display dialog box
 */
export const showBox = (title, message) => {
  var dialog = require('electron').remote.dialog
  dialog.showErrorBox(title, message)
  //else dialog.showErrorBox(title, message)
}


/**
 * removeImage
 * @param  {String}   imageId     Id of image
 *
 * Removes image by id
 */
export const removeImage = (imageId) => {
  let docker = initialize()

  docker.getImage(imageId).remove()
    .then( (image) => {
      console.log("image removed");
      showBox("Image Removed", "Successfully")
    })
    .catch( (er) => {
      console.log(er);
      showBox("Image Removed", "Unsuccessfully")
    })
}


/**
 * removeContainer
 * @param  {String}   containerId     Id of container
 *
 * Removes container by id
 */
export const removeContainer = (containerId) => {
  let docker = initialize()
  docker.getContainer(containerId).remove()
}

/**
 * stopContainer
 * @param  {String}   containerId     Id of container
 *
 * Stops container by id
 */
export const stopContainer = (containerId) => {
  let docker = initialize()
  docker.getContainer(containerId).stop()
}

/**
 * purge
 *
 * Stops/Removes all containers/images
 */
export const purge = () => {
  let docker = initialize()
  docker.listContainers({all: true})
    .then( (containers) => {
      containers.forEach( (containerInfo, index, array) => {
        console.log("checking containers")
        console.log(containerInfo)
        if(containerInfo.State === "running") {
          docker.getContainer(containerInfo.Id).stop()
            .then( (c) => {
              console.log("container removed")
              return c.remove()
            })
            // .then( (c) => {
            //
            //   if(index === array.length - 1) {
            //     console.log("all containers removed")
            //     docker.listImages({all: false}, (err, images) => {
            //       images.forEach((imageInfo, idx, arr) => {
            //         console.log("removing images")
            //         docker.getImage(imageInfo.Id).remove({force: true})
            //           .then( (img) => {
            //             console.log("deleted image")
            //             console.log(img)
            //           })
            //           .catch( (er) => {
            //             console.log(imageInfo.RepoTags[0])
            //             console.log(er)
            //           })
            //       })
            //     })
            //   }
            // })
            .catch( (e) => {
              console.log(e)
            })
        } else {
          console.log("removing non running container")
          docker.getContainer(containerInfo.Id).remove()
        }
      })
      console.log("removed all?")
    })
    .catch( (err) => {
      pass
    })
}
