import AbstractComponent from '../components/abstract-component.js';

export default class Filter extends AbstractComponent {
  constructor({title, count}) {
    super();
    this._title = title;
    this._count = count;
  }

  getTemplate() {
    return `<label for="filter__${this._title}" class="filter__label"><input type="radio" id="filter__${this._title}" class="filter__input visually-hidden" name="filter" ${this._count ? `` : `disabled=""`} checked="">
      ${this._title} <span class="filter__${this._title}-count">${this._count}</span>
    </label>`;
  }
}
