import Ember from 'ember';
import Nodes from '../models/Nodes';

export default Ember.Controller.extend({

  socketService: Ember.inject.service('websockets'),

  get location() {
    return `ws://${window.location.host}/nodes`;
  },

  init() {
    this._super.apply(this, arguments);

    //let intervalHandler;
    let socket = this.get('socketService').socketFor(this.location);

    socket.on('open', () => {
      socket.send(JSON.stringify({
        update: true
      }));
      //clearInterval(intervalHandler);
    }, this);
    //socket.on('close', () => intervalHandler = setInterval(() => socket.reconnect(), 5000), this);
    socket.on('message', event => {
      Nodes.update(JSON.parse(event.data));
      this.get('target.router').refresh();
    }, this);
  },

  willDestroyElement() {
    this.get('socketService').closeSocketFor(this.location);
  }
});
