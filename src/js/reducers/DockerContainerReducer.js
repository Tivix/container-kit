// DockerContainer.js


export default function(state={}, action) {
  switch(action.type) {
    case "LOAD_DOCKER_CONTAINER_LIST":
      console.log(action.data)
      return Object.assign({}, state, {data: action.data});
    case "DELETE_DOCKER_CONTAINER_SUCCESS":
      console.log(action)
      return state
    default:
      return state;
  }
}
