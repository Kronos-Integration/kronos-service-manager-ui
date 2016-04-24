import Ember from 'ember';
import WiredPanels from 'npm:WiredPanels';

function setupPanel(wiredPanels, step) {
  wiredPanels.initializePanel(step);
  step.label.textContent = step.name + (step.type ? ` (${step.type})` : '');

  let l = 0,
    r = 0;

  console.log(`setupPanel: ${step.name}`);

  for (const e in step.endpoints) {
    const endpoint = step.endpoints[e];
    if (endpoint.isIn) {
      if (step.leftSide === undefined || step.leftSide[l] === undefined) {
        console.log(`${step.name} / ${e} ${l} leftSide undefined`);
      } else {
        step.leftSide[l++].label.textContent = endpoint.name;
      }
    }
    if (endpoint.isOut) {
      if (step.rightSide === undefined || step.rightSide[r] === undefined) {
        console.log(`${step.name} / ${e} ${r} rightSide undefined`);
      } else {
        step.rightSide[r++].label.textContent = endpoint.name;
      }
    }
  }
}

export default Ember.Component.extend({

  didInsertElement() {
    this._super(...arguments);

    const flow = this.get('flow');
    const element = document.getElementById('wired-panels');

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
