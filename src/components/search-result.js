import AbstractComponent from '../components/abstract-component.js';

export default class SearchResult extends AbstractComponent {

  getTemplate() {
    return `<section class="result container">
        <button class="result__back">back</button>
      </section>`;
  }
}
