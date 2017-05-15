// loadDockerImageList.js


export default function (dockerImageList) {
  return {
    type: "LOAD_DOCKER_IMAGE_LIST",
    data: dockerImageList
  }
}
