import Ember from 'ember';

export default Ember.Controller.extend({

  socketService: Ember.inject.service('websockets'),
  init: function() {
    this._super.apply(this, arguments);

    var socket = this.get('socketService').socketFor('ws://localhost:4200/flows');

    socket.on('open', function(event) {
      console.log('open');
      socket.send('Hello Websocket World');
    }, this);
    socket.on('message', function(event) {
      console.log('message');
    }, this);
    socket.on('close', function(event) {
      console.log('close');
    }, this);
  },

  actions: {
    drag: function(step) {
      //step.x = 100;
      //step.set('x',step.get('x') + 10);
      console.log(`drag: ${step.name}`);
    }
  }
});
