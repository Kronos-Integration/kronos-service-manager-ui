/*  Promise */

import fetch from 'fetch';
import Node from './Node';

export function nodeId(params) {
  return params.node_id ? params.node_id : 'localnode';
}

const allNodesArray = [];
const nodesById = {};

export function all() {
  if (nodesById.length > 0) {
    return Promise.resolve(allNodesArray);
  }

  return fetch('api/nodes').then(response => response.json()).then(nodeJson => {
    update(nodeJson);
    return allNodesArray;
  });
}

export function update(nodeJson) {
  allNodesArray.length = 0;

  Object.keys(nodesById).forEach(n => {
    delete nodesById[n];
  });

  nodeJson.forEach(s => {
    const node = new Node(s);
    nodesById[node.id] = node;
    allNodesArray.push(node);
  });
}

export function find(id) {
  return all().then(all => all[id]);
}
