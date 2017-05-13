// index.js


import { combineReducers } from 'redux';
import dockerpsaReducer from './DockerContainerReducer';



const rootReducer = combineReducers({
  dockerContainers: dockerpsaReducer
});

export default rootReducer;
