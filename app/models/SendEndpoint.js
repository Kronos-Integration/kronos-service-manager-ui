import Endpoint from './Endpoint';

export default class SendEndpoint extends Endpoint {

  toJSON() {
    const json = super.toJSON();

    if (this.isConnected) {
      const o = this.otherEnd;
      if (o && o.owner) {
        const ei = o.owner.endpointIdentifier(o);
        if (ei !== undefined) {
          json.target = ei;
        }
      }
    }

    return json;
  }

  get isOut() {
    return true;
  }
}
