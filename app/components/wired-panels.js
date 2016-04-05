import Ember from 'ember';
import WiredPanels from 'npm:WiredPanels';

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
      const step = flow.steps[sn];
      this.wiredPanels.initializePanel(step);
      step.label.textContent = `${sn} (${step.type})`;

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
