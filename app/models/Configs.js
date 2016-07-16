/*  Promise */

import fetch from 'fetch';

let data;

export function update(json) {
  data = json;
}

export function all() {
  return fetch('api/kv').then(response => {
    data = response.json();
    return data;
  });
}
