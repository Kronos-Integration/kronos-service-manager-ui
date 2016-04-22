/* jslint node: true, esnext: true */
'use strict';

export default (superclass) => class extends superclass {
  constructor() {
    super();

    let endpoints = {};
    Object.defineProperty(this, 'endpoints', {
      value: endpoints
    });



    // wires
    this.leftSide = [];
    this.rightSide = [];
  }

  /**
   * @param {Endpoint} ep
   */
  addEndpoint(ep) {
    this.endpoints[ep.name] = ep;
    return ep;
  }

  /**
   * Deliver an identifier suitable as target name.
   * @param {Endpoint} ep edntpoint to be identified
   * @return {String} endpoint identifier
   */
  endpointIdentifier(ep) {
    return `${this.name}${this.endpointParentSeparator}${ep.name}`;
  }
};
