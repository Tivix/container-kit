import { initialize } from '../utils/scripts';



/**
 * deleteContainer
 * @param  {String}   containerId     Id of container
 *
 * Deletes container by id
 */
export const deleteContainer = (containerId) => {
  console.log('entered delete cont func');
  return (dispatch) => {
    console.log('entered delete dispatch');

    let docker = initialize();

    docker.getContainer(containerId).remove()
      .then( (c) => {
        console.log('deleting container');
        dispatch(deleteContainerSuccess(c));
      })
      .catch( (err) => {
        console.log('error deleting container');;
      });
  }
}

export const deleteContainerSuccess = (container) => {
  return {
    type: "DELETE_DOCKER_CONTAINER_SUCCESS",
    data: container
  }
}
