import Ember from 'ember';
import WiredPanels from 'npm:WiredPanels';

function setupPanel(wiredPanels, step) {
  wiredPanels.initializePanel(step);
  step.label.textContent = step.name + (step.type ? ` (${step.type})` : '');

  let l = 0,
    r = 0;

  for (const e in step.endpoints) {
    const endpoint = step.endpoints[e];
    if (endpoint.in) {
      step.leftSide[l++].label.textContent = endpoint.name;
    }
    if (endpoint.out) {
      step.rightSide[r++].label.textContent = endpoint.name;
    }
  }
}

export default Ember.Component.extend({

  didInsertElement() {
    this._super(...arguments);

    const flow = this.get('flow');
    const element = document.getElementById('wired-panels');
    //console.log(`element: ${this.$()}`);
    //const element = this.$();

    this.wiredPanels = new WiredPanels(element);
    this.wiredPanels.config.headSocket = false;

    for (const sn in flow.steps) {
      setupPanel(this.wiredPanels, flow.steps[sn]);
    }

    for (const sn in flow.services) {
      setupPanel(this.wiredPanels, flow.services[sn]);
    }

    flow.wires.forEach(wire => {
      wire.srcSocket = wire.srcPanel.rightSide[wire.src.index].socket;
      wire.dstSocket = wire.dstPanel.leftSide[wire.dst.index].socket;
      this.wiredPanels.initializeWire(wire);
    });

    this.wiredPanels.syncGraph();

    this.wiredPanels.cursorPanel = this.wiredPanels.panels[0];
    this.wiredPanels.setCursorIndex(0);
  }
});
