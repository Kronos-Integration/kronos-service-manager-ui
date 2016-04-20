import Endpoint from './Endpoint';

export default class ReceiveEndpoint extends Endpoint {

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
