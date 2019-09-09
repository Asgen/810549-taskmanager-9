import moment from 'moment';
import AbstractComponent from '../components/abstract-component.js';

export default class TaskCard extends AbstractComponent {
  constructor({description, dueDate, repeatingDays, tags, color, isFavorite, isArchive}) {
    super();
    this._description = description;
    this._dueDate = dueDate !== null ? new Date(dueDate) : null;
    this._repeatingDays = repeatingDays;
    this._tags = tags;
    this._color = color;
    this._element = null;
    this._favorite = isFavorite;
    this._archive = isArchive;
    this._isRepeat = Object.values(this._repeatingDays).some((it) => it === true) && dueDate !== 1 ? 1 : 0;
  }

  getTemplate() {
    return `<article class="card card--${this._color} ${this._isRepeat ? `card--repeat` : `` }">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
            <button type="button" class="card__btn card__btn--archive ${this._archive ? `card__btn--disabled` : ``}">
              archive
            </button>
            <button
              type="button"
              class="card__btn card__btn--favorites ${this._favorite ? `card__btn--disabled` : ``}"
            >
              favorites
            </button>
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <p class="card__text">${this._description}</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${this._dueDate ? moment(this._dueDate).format(`DD MMMM`) : ``}</span>
                    <!--span class="card__time">11:15 PM</span-->
                  </p>
                </div>
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${Array.from(this._tags).map((tag) => `<span class="card__hashtag-inner">
                    <span class="card__hashtag-name">
                      #${tag}
                    </span>
                  </span>`).join(``)}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`;
  }
}
