

export default function (dockerContainerList) {
  return {
    type: "LOAD_DOCKER_CONTAINER_LIST",
    data: dockerContainerList
  }
}
