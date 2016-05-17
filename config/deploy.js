/* jshint node: true */

const path = require('path');

module.exports = function (deployTarget) {
  var ENV = {
    build: {}
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
    ENV.plugins = ['build', 'archive'];
    ENV.archive = {
      archivePath: 'tmp/deploy-archive',
      packedDirName: 'docroot',
      archiveName: 'kronos-service-manager-ui.tar'
    };
  }

  if (deployTarget === 'demo') {
    ENV.build.environment = 'demo';
    ENV.rsync = {
      type: 'rsync',
      dest: '/home/mfelten_de/docroot/kronos/kronos-service-manager-ui',
      host: 'mfelten_de@mfelten.de',
      privateKey: path.join(__dirname, 'travis_id_rsa'),
      ssh: true,
      recursive: true,
      delete: false,
      args: ['--verbose', '-ztl']
    };
  }

  return ENV;
};
