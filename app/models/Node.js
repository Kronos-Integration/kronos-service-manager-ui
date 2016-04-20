export default class Node {

  constructor(name, id, tags) {
    Object.defineProperty(this, 'name', {
      value: name
    });
    Object.defineProperty(this, 'id', {
      value: id
    });
    Object.defineProperty(this, 'tags', {
      value: tags
    });

  }
}
