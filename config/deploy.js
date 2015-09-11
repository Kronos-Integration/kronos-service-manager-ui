// An example of deploy.js.

const developmentEnvironment = {
    // Omitted, see stagingEnvironment below.
};

const stagingEnvironment = {
  store: {
    type: 'ssh', // the default store is 'redis', use 'ssh' for this addon.
    remoteDir: process.env['APP_STAGING_REMOTE_DIR_PATH'],
    host: process.env['APP_STAGING_REMOTE_HOST_IP'],
    port: process.env['APP_STAGING_REMOTE_SSH_PORT'],
    username: process.env['APP_STAGING_REMOTE_USERNAME'],
    privateKeyFile: process.env['APP_STAGING_REMOTE_PRIVATE_KEY']
  },
  assets: {
    /* Handle your assets here. I recommmend using 'ember-cli-deploy-s3' */
  }
};

const productionEnvironment = {
    // Omitted, see stagingEnvironment above.
};

module.exports = {
  development: developmentEnvironment,
  staging: stagingEnvironment,
  production: productionEnvironment
};
