import Ember from 'ember';
import lb from 'npm:LinkedBoxes';

export default Ember.Component.extend({

  didInsertElement() {
    const flow = this.get('flow');
    const element = document.getElementById('linked-boxes');
    this.linkedBoxes = new lb.LinkedBoxes(element);

    for (let sn in flow.steps) {
      const step = flow.steps[sn];

      let inum = 0,
        onum = 0;
      for (let en in step.endpoints) {
        const e = step.endpoints[en];
        if (e.in) {
          inum++;
        }
        if (e.out) {
          onum++;
        }
      }

      this.linkedBoxes.createNodeHelper(inum, onum);
    }

    this.linkedBoxes.createLinkHelper(this.linkedBoxes.nodes[0], this.linkedBoxes.nodes[1], -1, 1);
    this.linkedBoxes.syncGraph();

    this.linkedBoxes.cursorNode = this.linkedBoxes.nodes[0];
    this.linkedBoxes.setCursorIndex(0);
  }
});
