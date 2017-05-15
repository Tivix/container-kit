// index.js


import { combineReducers } from 'redux';
import dockerpsaReducer from './DockerContainerReducer';
import dockerImageReducer from './DockerImageReducer';



const rootReducer = combineReducers({
  dockerContainers: dockerpsaReducer,
  dockerImages: dockerImageReducer
});

export default rootReducer;
