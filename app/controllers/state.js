import Ember from 'ember';

export default Ember.Controller.extend({

  socketService: Ember.inject.service('websockets'),
  socketRef: null,

  get location() {
    return `ws://${window.location.host}/state`;
  },

  init() {
    this._super.apply(this, arguments);

    //let intervalHandler;

    let socket = this.get('socketService').socketFor(this.location);
    this.set('socketRef', socket);

    socket.on('open', () => {
      this.set('content.connected', true);
      socket.send(JSON.stringify({
        autoUpdate: 5000
      }));
      //clearInterval(intervalHandler);
    }, this);
    socket.on('close', () => {
      this.set('content.connected', false);
      //intervalHandler = setInterval(() => socket.reconnect(), 5000);
    }, this);
    socket.on('message', event => {
      const data = JSON.parse(event.data);
      this.set('content.uptime', data.uptime);
      if (data.memory) {
        this.set('content.memory.heapTotal', data.memory.heapTotal);
        this.set('content.memory.heapUsed', data.memory.heapUsed);
        this.set('content.memory.rss', data.memory.rss);
      }
      if (data.cpu) {
        this.set('content.cpu.user', data.cpu.user);
        this.set('content.cpu.system', data.cpu.system);
      }
    }, this);
  },
  willDestroyElement() {
    this.get('socketService').closeSocketFor(this.location);
  }
});
