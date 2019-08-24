import AbstractComponent from '../components/abstract-component.js';

export default class ButtonLoadMore extends AbstractComponent {

  getTemplate() {
    return `<button class="load-more" type="button">load more</button>`;
  }
}
