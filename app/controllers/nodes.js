import Ember from 'ember';
import Util from '../models/Util';

export default Ember.Controller.extend({

  socketService: Ember.inject.service('websockets'),
  init() {
    this._super.apply(this, arguments);

    createSocket.call(this, `ws://${window.location.host}/nodes`);

    let intervalHandler;

    function createSocket(location) {
      let socket = this.get('socketService').socketFor(location);

      socket.on('open', () => {
        socket.send(JSON.stringify({
          update: true
        }));
        clearInterval(intervalHandler);
      }, this);
      socket.on('close', () => {
        console.log('close');
        socket = undefined;
        intervalHandler = setInterval(() => {
          console.log('reopen...');
          createSocket.call(this, location);
        }, 5000);
      }, this);
      socket.on('message', event => {
        Util.updateNodes(JSON.parse(event.data));
      }, this);
    }
  }
});
