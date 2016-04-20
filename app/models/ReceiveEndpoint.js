import Endpoint from './Endpoint';

export default class ReceiveEndpoint extends Endpoint {

  set connected(other) {
    other.connected = this;
  }

  get receive() {
    return this._receive;
  }

  set receive(receive) {
    if (this.hasInterceptors) {
      this._internalEndpoint.receive = receive;
    } else {
      this._receive = receive;
    }
  }

  get isIn() {
    return true;
  }
}
