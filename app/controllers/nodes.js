import Ember from 'ember';
import Util from '../models/Util';

export default Ember.Controller.extend({

  socketService: Ember.inject.service('websockets'),

  get location() {
    return `ws://${window.location.host}/nodes`;
  },

  init() {
    this._super.apply(this, arguments);

    let intervalHandler;
    let socket = this.get('socketService').socketFor(this.location);

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
      console.log(`Nodes update`);
      Util.updateNodes(JSON.parse(event.data));
      console.log(`route is: ${this.get('target')}`);
      this.get('target').refresh();
      //console.log(`content: ${JSON.stringify(this.get('content'))}`);
      //this.set('content', Util.allNodes());
      //this.set('model', Util.allNodes());
    }, this);
  },

  willDestroyElement() {
    this.get('socketService').closeSocketFor(this.location);
  }
});
