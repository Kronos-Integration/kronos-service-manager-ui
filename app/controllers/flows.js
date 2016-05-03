import Ember from 'ember';
import fetch from 'fetch';

export default Ember.Controller.extend({
  /*
  socketService: Ember.inject.service('websockets'),
  init() {
    this._super.apply(this, arguments);

    const location = `ws://${window.location.host}/flow`;
    const socket = this.get('socketService').socketFor(location);

    socket.on('message', event => {
      const data = JSON.parse(event.data);
      console.log(`Got message: ${JSON.stringify(data)}`);
      if (data.type === 'flowDeleted') {
        Util.deleteFlowLocally(data.flow);
      }
    }, this);
    socket.on('close', () => {
      console.log('close');
    }, this);
  },
*/

  actions: {
    "delete": function (flow) {
      return fetch(`api/flow/${flow.id}`, {
        method: 'DELETE'
      }).then(() => {});
    },
    stop(flow) {
      fetch(`api/flow/${flow.id}/stop`, {
        method: 'POST'
      }).then(response => response.json().then(json => console.log(`stop: ${JSON.stringify(json)}`)));
    },
    start(flow) {
      fetch(`api/flow/${flow.id}/start`, {
        method: 'POST'
      }).then(response => response.json().then(json => console.log(`start: ${JSON.stringify(json)}`)));
    },
    create() {
      const files = document.getElementById('file').files;

      function processFile(file) {
        const reader = new FileReader();
        reader.onload = () => {
          fetch('api/flow', {
            method: 'PUT',
            body: reader.result
          }).then(response => response.json().then(json => console.log(`created: ${JSON.stringify(json)}`)));
        };

        reader.readAsText(file);
      }

      processFile(files[0]);
    }
  }
});
