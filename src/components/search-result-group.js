import AbstractComponent from '../components/abstract-component.js';

export default class SearchReslutGroup extends AbstractComponent {

  getTemplate() {
    return `<section class="result__group">
          <div class="result__cards"></div>
        </section>`;
  }
}
