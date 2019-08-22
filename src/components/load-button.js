import {createElement} from '../utils.js';

export default class ButtonLoadMore {
  constructor() {
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return `<button class="load-more" type="button">load more</button>`;
  }
}
