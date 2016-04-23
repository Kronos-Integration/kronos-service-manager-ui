import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Controller.extend({

  socketService: Ember.inject.service('websockets'),
  init() {
    this._super.apply(this, arguments);

    createSocket.call(this, `ws://${window.location.host}/state`);

    let intervalHandler;

    function createSocket(location) {
      let socket = this.get('socketService').socketFor(location);

      console.log(`new socket: ${socket} ${location}`);

      socket.on('open', () => {
        console.log('open');

        this.set('content.connected', true);
        socket.send(JSON.stringify({
          autoUpdate: 5000
        }));
        clearInterval(intervalHandler);
      }, this);
      socket.on('close', () => {
        console.log('close');
        socket = undefined;
        this.set('content.connected', false);
        intervalHandler = setInterval(() => {
          console.log('reopen...');
          fetch('api/state');

          createSocket.call(this, location);
        }, 5000);
      }, this);
      socket.on('message', event => {
        const data = JSON.parse(event.data);
        this.set('content.uptime', data.uptime);
        if (data.memory) {
          this.set('content.memory.heapTotal', data.memory.heapTotal);
          this.set('content.memory.heapUsed', data.memory.heapUsed);
          this.set('content.memory.rss', data.memory.rss);
        }
      }, this);
    }
  }
});
