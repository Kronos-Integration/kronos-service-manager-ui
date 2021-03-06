/* jshint node: true */

module.exports = function (environment) {
  var ENV = {
    modulePrefix: 'kronos-service-manager-ui',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      version: '1.0.0'
    },
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self'",
      'font-src': "'self' 'unsafe-inline' https://fonts.gstatic.com/ data:",
      'connect-src': "'self' ws://localhost:49154 ws://localhost:4200", // Allow data (ajax/websocket) from http://localhost:3001
      'img-src': "'self'",
      'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com/", // Allow inline styles
      'media-src': "'self'"
    }
  };

  /*
    ENV['simple-auth'] = {
            store: 'simple-auth-session-store:local-storage',
            authorizer: 'authorizer:custom',
            crossOriginWhitelist: ['http://localhost:3001/'],
            routeAfterAuthentication: '/protected'
        };
  */

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.rootURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {}

  if (environment === 'demo') {
    ENV.rootURL = '/kronos/kronos-service-manager-ui';
  }

  return ENV;
};
