// DockerContainer.js


export default function(state={}, action) {
  switch(action.type) {
    case "LOAD_DOCKER_IMAGE_LIST":
      return Object.assign({}, state, {data: action.data});
    default:
      return state;
  }
}
