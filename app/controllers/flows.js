import Ember from 'ember';
import Util from '../models/Util';

export default Ember.Controller.extend({
  socketService: Ember.inject.service('websockets'),
  xinit() {
    this._super.apply(this, arguments);

    const location = `ws://${window.location.host}/flow`;
    const socket = this.get('socketService').socketFor(location);

    socket.on('message', event => {
      const data = JSON.parse(event.data);
      //console.log(`Got message: ${JSON.stringify(data)}`);
      if (data.type === 'flowDeleted') {
        Util.deleteFlowLocally(data.flow);
      }
    }, this);
    socket.on('close', () => {
      console.log('close');
    }, this);
  },

  actions: {
    "delete": function (flow) {
      Util.deleteFlow(flow.id);
    },
    stop(flow) {
      Util.stopFlow(flow.id);
    },
    start(flow) {
      Util.startFlow(flow.id);
    },
    create() {
      const files = document.getElementById('file').files;

      function processFile(file) {
        const reader = new FileReader();
        reader.onload = () => {
          Util.createFlow(JSON.parse(reader.result));
        };

        reader.readAsText(file);
      }

      processFile(files[0]);
    }
  }
});
