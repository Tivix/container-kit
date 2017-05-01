// script.js


export const initialize = function() {
  var Docker = require('../node_modules/dockerode/lib/docker')
  var fs     = require('fs');

  var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
  var stats  = fs.statSync(socket);

  if (!stats.isSocket()) {
    throw new Error('Are you sure the docker is running?');
  }

  var docker = new Docker({ socketPath: socket });

  return docker;
}
