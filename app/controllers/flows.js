import Ember from 'ember';

import Util from 'kronos-service-manager-ui/models/Util';

export default Ember.Controller.extend({
  socketService: Ember.inject.service('websockets'),
  init: function () {
    this._super.apply(this, arguments);

    const location = `ws://${window.location.host}/flows`;
    const socket = this.get('socketService').socketFor(location);

    socket.on('message', function (event) {
      const data = JSON.parse(event.data);
      //console.log(`Got message: ${JSON.stringify(data)}`);
      if(data.type === 'flowDeleted') {
        Util.deleteFlowLocally(data.flow);
      }
    }, this);
    socket.on('close', function () {
      console.log('close');
    }, this);
  },

  actions: {
    "delete": function(flow) {
      Util.deleteFlow(flow.id);
    },
    pause: function(flow) {
      Util.pauseFlow(flow.id);
    },
    create: function() {
      const files = document.getElementById('file').files;
      const file = files[0];

      const reader = new FileReader();
      reader.onload = function() {
        Util.createFlow(JSON.parse(reader.result));
      };

      reader.readAsText(file);
    }
  }
});
