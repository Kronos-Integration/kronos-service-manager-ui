export default class Endpoint {
  constructor(name, owner) {
    Object.defineProperty(this, 'name', {
      value: name
    });

    Object.defineProperty(this, 'owner', {
      value: owner
    });
  }

  get isDefault() {
    return false;
  }

  toString() {
    return `${this.owner}/${this.name}`;
  }

  get isIn() {
    return false;
  }

  get isOut() {
    return false;
  }

  get direction() {
    return this.isIn ? 'in' : this.isOut ? 'out' : undefined;
  }

  /**
   * @return {Endpoint} representing the opposite direction
   */
  get opposite() {
    return undefined;
  }

  toJSON() {
    const json = {};

    if (this.isIn) {
      json.in = true;
    }
    if (this.isOut) { 
      json.out = true;
    }

    return json;
  }
}
