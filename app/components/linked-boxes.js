import Ember from 'ember';
import lb from 'npm:LinkedBoxes';

export default Ember.Component.extend({

  didInsertElement: function () {
    const element = document.getElementById('linked-boxes');
    this.linkedBoxes = new lb.LinkedBoxes(element);

    this.linkedBoxes.createNodeHelper(4, 2);
    this.linkedBoxes.createNodeHelper(1, 3);
    this.linkedBoxes.createLinkHelper(this.linkedBoxes.nodes[0], this.linkedBoxes.nodes[1], -1, 1);
    this.linkedBoxes.syncGraph();

    this.linkedBoxes.cursorNode = this.linkedBoxes.nodes[0];
    this.linkedBoxes.setCursorIndex(0);
  }
});
