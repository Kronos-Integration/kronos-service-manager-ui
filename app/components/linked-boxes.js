import Ember from 'ember';
import LinkedBoxes from 'npm:LinkedBoxes';

export default Ember.Component.extend({

  didInsertElement() {
    const flow = this.get('flow');
    const element = document.getElementById('linked-boxes');
    this.linkedBoxes = new LinkedBoxes(element);

    for (const sn in flow.steps) {
      const step = flow.steps[sn];
      this.linkedBoxes.initializeNode(step);
      step.label.textContent = sn;

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

    for (const link of flow.links) {
      //console.log(`${link.src.name}[${link.src.index}] -> ${link.dst.name}[${link.dst.index}] `);
      link.srcCircle = link.srcNode.rightSide[link.src.index].circle;
      link.dstCircle = link.dstNode.leftSide[link.dst.index].circle;
      this.linkedBoxes.initializeLink(link);
    }

    this.linkedBoxes.syncGraph();

    this.linkedBoxes.cursorNode = this.linkedBoxes.nodes[0];
    this.linkedBoxes.setCursorIndex(0);
  }
});
