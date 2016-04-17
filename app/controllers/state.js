import Ember from 'ember';

export default Ember.Controller.extend({

  socketService: Ember.inject.service('websockets'),
  init() {
    this._super.apply(this, arguments);

    const location = `ws://${window.location.host}/state`;
    let socket = this.get('socketService').socketFor(location);
    let intervalHandler;
    let intervalHandler2;

    socket.on('open', () => {

      intervalHandler2 = setInterval(() => {
        console.log('send');
        socket.send({});
      }, 1000);

      this.set('content.connected', true);
      socket.send({
        autoUpdate: 5000
      });
      clearInterval(intervalHandler);
      clearInterval(intervalHandler2);
    }, this);
    socket.on('close', () => {
      socket = undefined;
      this.set('content.connected', false);
      intervalHandler = setInterval(() => {
        socket = this.get('socketService').socketFor(location);
      }, 600000);
    }, this);
    socket.on('message', event => {
      //console.log(event);
      const data = JSON.parse(event.data);
      this.set('content.uptime', data.uptime);
      this.set('content.memory.heapTotal', data.memory.heapTotal);
      this.set('content.memory.heapUsed', data.memory.heapUsed);
      this.set('content.memory.rss', data.memory.rss);
    }, this);
  }
});
