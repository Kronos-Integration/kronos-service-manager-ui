import Ember from 'ember';
import Util from '../models/Util';

export default Ember.Controller.extend({

  socketService: Ember.inject.service('websockets'),

  init() {
    this._super.apply(this, arguments);

    const location = `ws://${window.location.host}/nodes`;

    let intervalHandler;
    let socket = this.get('socketService').socketFor(location);

    socket.on('open', () => {
      socket.send(JSON.stringify({
        update: true
      }));
      clearInterval(intervalHandler);
    }, this);
    socket.on('close', () => {
      intervalHandler = setInterval(() => socket.reconnect(), 5000);
    }, this);
    socket.on('message', event => {
      console.log(`nodes: ${event.data}`);
      Util.updateNodes(JSON.parse(event.data));
    }, this);
  }
});
