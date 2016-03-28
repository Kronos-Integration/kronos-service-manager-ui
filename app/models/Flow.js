import Ember from 'ember';

import lb from 'npm:LinkedBoxes';

console.log(`lb: ${Object.keys(lb)}`);
console.log(`LinkedBoxes: ${Object.keys(lb.LinkedBoxes)}`);

/*
const linkedBoxes = new lb.LinkedBoxes(document.body);
linkedBoxes.createNode(4, 1);
linkedBoxes.createNode(2, 3);
linkedBoxes.createNode(0, 2);
linkedBoxes.createLink({
  srcNode: linkedBoxes.nodes[0],
  dstNode: linkedBoxes.nodes[1]
}, -3, 2);
linkedBoxes.createLink({
  srcNode: linkedBoxes.nodes[1],
  dstNode: linkedBoxes.nodes[2]
}, -2, 1);
linkedBoxes.createLink({
  srcNode: linkedBoxes.nodes[0],
  dstNode: linkedBoxes.nodes[0]
}, 0, 1);
linkedBoxes.syncGraph();
linkedBoxes.cursorNode = linkedBoxes.nodes[0];
linkedBoxes.setCursorIndex(0);
*/


export default Ember.Object.extend({
  name: "",
  description: "",
  state: "registered",
  steps: undefined,
  isRunning() {
    return this.state === 'running';
  }
});
