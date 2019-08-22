import {createElement} from '../utils.js';

export default class Filter {
  constructor({title, count}) {
    this._title = title;
    this._count = count;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return `<label for="filter__${this._title}" class="filter__label"><input type="radio" id="filter__${this._title}" class="filter__input visually-hidden" name="filter" ${this._count ? `` : `disabled=""`} checked="">
      ${this._title} <span class="filter__${this._title}-count">${this._count}</span>
    </label>`;
  }
}
