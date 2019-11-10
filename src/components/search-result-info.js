import AbstractComponent from '../components/abstract-component.js';

export default class SearchResultInfo extends AbstractComponent {
  constructor(q, count) {
    super();
    this._q = q;
    this._count = count;
  }

  getTemplate() {
    return `<h2 class="result__title">
      ${this._q}<span class="result__count">${this._count}</span>
    </h2>`;
  }
}
