// scripts.js


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


// static vars
export const SET_INTERVAL_TIME = 1000


// /**
//  * showBox
//  * @param  {String}   title     Title of message box
//  * @param  {String}   message   Message to display
//  *
//  * Display dialog box
//  */
// export const showBox = (title, message) => {
//   var dialog = require('electron').remote.dialog
//   dialog.showErrorBox(title, message)
//   //else dialog.showErrorBox(title, message)
// }
//
//
//
//
// /**
//  * removeImage
//  * @param  {String}   imageId     Id of image
//  *
//  * Removes image by id
//  */
// export const removeImage = (imageId) => {
//   console.log(this)
//   let docker = initialize()
//   docker.getImage(imageId).remove()
//     .then( (image) => {
//       console.log("image removed");
//       document.getElementById(imageId+"-circle-progress").style.display = "none";
//       document.getElementById(imageId+'-delete-button').disabled = false
//       //showBox("Image Removed", "Successfully")
//     })
//     .catch( (er) => {
//       console.log(er);
//       document.getElementById(imageId+"-circle-progress").style.display = "none";
//       document.getElementById(imageId+'-delete-button').disabled = false
//       showBox("Error", "Container is either in use, or not removed.")
//     })
// }
//
//
// /**
//  * stopContainer
//  * @param  {String}   containerId     Id of container
//  *
//  * Stops container by id
//  */
// export const stopContainer = (containerId) => {
//   document.getElementById(containerId+'-stop-button').disabled = true
//   document.getElementById(containerId+'-circle-progress').style.display = 'inline-block'
//   let docker = initialize()
//   docker.getContainer(containerId).stop()
//     .then( (c) => {
//       document.getElementById(containerId+'-stop-button').disabled = false
//       document.getElementById(containerId+'-circle-progress').style.display = 'none'
//     })
// }
//
// /**
//  * purge
//  *
//  * Stops/Removes all containers/images
//  */
// export const purge = () => {
//   let docker = initialize()
//   docker.listContainers({all: true})
//     .then( (containers) => {
//       containers.forEach( (containerInfo, index, array) => {
//         console.log("checking containers")
//         console.log(containerInfo)
//         if(containerInfo.State === "running") {
//           docker.getContainer(containerInfo.Id).stop()
//             .then( (c) => {
//               console.log("container removed")
//               return c.remove()
//             })
//             // .then( (c) => {
//             //
//             //   if(index === array.length - 1) {
//             //     console.log("all containers removed")
//             //     docker.listImages({all: false}, (err, images) => {
//             //       images.forEach((imageInfo, idx, arr) => {
//             //         console.log("removing images")
//             //         docker.getImage(imageInfo.Id).remove({force: true})
//             //           .then( (img) => {
//             //             console.log("deleted image")
//             //             console.log(img)
//             //           })
//             //           .catch( (er) => {
//             //             console.log(imageInfo.RepoTags[0])
//             //             console.log(er)
//             //           })
//             //       })
//             //     })
//             //   }
//             // })
//             .catch( (e) => {
//               console.log(e)
//             })
//         } else {
//           console.log("removing non running container")
//           docker.getContainer(containerInfo.Id).remove()
//         }
//       })
//       console.log("removed all?")
//     })
//     .catch( (err) => {
//       pass
//     })
// }
