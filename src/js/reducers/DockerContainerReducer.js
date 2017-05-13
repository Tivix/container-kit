// DockerContainer.js


// export default function() {
//   return [
//     {
//       "name": "nick",
//       "id": 1
//     },
//     {
//       "name": "barruy",
//       "id": 2
//     }
//   ]
// }

export default function(state=null, action) {
  switch(action.type) {
    case "LOAD_DOCKER_CONTAINER_LIST":
      console.log(action.data)
      const data = action.data.map(item => Object.assign({}, item))
      return data
    default:
      console.log('default')
      return []
  }
}
