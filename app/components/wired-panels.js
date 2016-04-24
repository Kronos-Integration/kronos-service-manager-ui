import Ember from 'ember';
import WiredPanels from 'npm:WiredPanels';


export default Ember.Component.extend({

  didInsertElement() {
    this._super(...arguments);

    const flow = this.get('flow');
    const element = document.getElementById('wired-panels');

    this.wiredPanels = new WiredPanels(element);
    this.wiredPanels.config.headSocket = false;

    for (const sn in flow.steps) {
      flow.steps[sn].setupPanel(this.wiredPanels);
    }

    for (const sn in flow.services) {
      flow.services[sn].setupPanel(this.wiredPanels);
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
