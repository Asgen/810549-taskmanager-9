import AbstractComponent from '../components/abstract-component.js';

export default class TaskEdit extends AbstractComponent {
  constructor({description, dueDate, repeatingDays, tags, color, isFavorite, isArchive}) {
    super();
    this._description = description;
    this._dueDate = dueDate !== null ? new Date(dueDate) : null;
    this._repeatingDays = repeatingDays;
    this._tags = tags;
    this._color = color;
    this._favorite = isFavorite;
    this._archive = isArchive;
    this._isRepeat = Object.values(this._repeatingDays).some((it) => it === true) && dueDate !== 1 ? 1 : 0;

    this._onDateClick();
    this._onRepeatClick();
    this._onColorClick();
    this._subscribeOnEvents();
  }

  _onDateClick() {

    this.getElement().querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, (e) => {
        e.preventDefault();

        if (this.getElement().querySelector(`.card__repeat-status`).innerText === `YES`) {
          this.getElement().querySelector(`.card__repeat-status`).innerText = `NO`;
          this.getElement().querySelector(`.card__repeat-days`).classList.toggle(`visually-hidden`);
          this.getElement().classList.remove(`card--repeat`);
        }
        const newState = this.getElement().querySelector(`.card__date-status`).innerText !== `YES` ? `YES` : `NO`;
        this.getElement().querySelector(`.card__date-status`).innerText = newState;

        this.getElement().querySelector(`.card__date-deadline`).classList.toggle(`visually-hidden`);
      });
  }

  _onRepeatClick() {

    this.getElement().querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, (e) => {
        e.preventDefault();

        this.getElement().classList.toggle(`card--repeat`);

        if (this.getElement().querySelector(`.card__date-status`).innerText === `YES`) {
          this.getElement().querySelector(`.card__date-status`).innerText = `NO`;
          this.getElement().querySelector(`.card__date-deadline`).classList.toggle(`visually-hidden`);
        }
        const newState = this.getElement().querySelector(`.card__repeat-status`).innerText !== `YES` ? `YES` : `NO`;
        this.getElement().querySelector(`.card__repeat-status`).innerText = newState;
        this._isRepeat = 1;

        this.getElement().querySelector(`.card__repeat-days`).classList.toggle(`visually-hidden`);
      });
  }

  _onColorClick() {
    const onColorChange = (color) => {
      this._color = color;
      this.getElement().classList.remove(`card--black`, `card--yellow`, `card--blue`, `card--pink`, `card--green`);
      this.getElement().classList.add(`card--${color}`);
    };

    this.getElement().querySelector(`.card__colors-wrap`)
      .addEventListener(`click`, (e) => {

        if (e.target.tagName !== `LABEL`) {
          return;
        }

        switch (e.target.dataset.colorType) {
          case `black`:
            onColorChange(`black`);
            break;
          case `yellow`:
            onColorChange(`yellow`);
            break;
          case `blue`:
            onColorChange(`blue`);
            break;
          case `green`:
            onColorChange(`green`);
            break;
          case `pink`:
            onColorChange(`pink`);
            break;
        }
      });
  }

  getTemplate() {
    return `<article class="card card--edit card--${this._color} ${this._isRepeat ? `card--repeat` : `` }">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__control">
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
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${this._description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${this._dueDate === null || this._isRepeat ? `NO` : `YES` }</span>
                </button>

                <fieldset class="card__date-deadline ${this._isRepeat || this._dueDate === null ? `visually-hidden` : `` }">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${this._dueDate ? this._dueDate.toDateString() : ``} ${this._dueDate ? this._dueDate.getHours() : ``}:${this._dueDate ? this._dueDate.getMinutes() : ``}"
                    />
                  </label>
                </fieldset>

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${this._isRepeat ? `YES` : `NO` }</span>
                </button>

                <fieldset class="card__repeat-days ${this._isRepeat ? `` : `visually-hidden`}">
                  <div class="card__repeat-days-inner">
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-mo-4"
                      name="repeat"
                      value="mo"
                      ${Object.values(this._repeatingDays)[0] === true ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-mo-4"
                      >mo</label
                    >
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-tu-4"
                      name="repeat"
                      value="tu"
                      ${Object.values(this._repeatingDays)[1] === true ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-tu-4"
                      >tu</label
                    >
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-we-4"
                      name="repeat"
                      value="we"
                      ${Object.values(this._repeatingDays)[2] === true ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-we-4"
                      >we</label
                    >
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-th-4"
                      name="repeat"
                      value="th"
                      ${Object.values(this._repeatingDays)[3] === true ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-th-4"
                      >th</label
                    >
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-fr-4"
                      name="repeat"
                      value="fr"
                      ${Object.values(this._repeatingDays)[4] === true ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-fr-4"
                      >fr</label
                    >
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      name="repeat"
                      value="sa"
                      id="repeat-sa-4"
                      ${Object.values(this._repeatingDays)[5] === true ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-sa-4"
                      >sa</label
                    >
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-su-4"
                      name="repeat"
                      value="su"
                      ${Object.values(this._repeatingDays)[6] === true ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-su-4"
                      >su</label
                    >
                  </div>
                </fieldset>
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list">

                  ${(Array.from(this._tags).map((tag) => (`
                    <span class="card__hashtag-inner">
                      <input
                        type="hidden"
                        name="hashtag"
                        value="${tag}"
                        class="card__hashtag-hidden-input"
                      />
                      <p class="card__hashtag-name">
                       #${tag}
                      </p>
                    <button type="button" class="card__hashtag-delete">
                      delete
                    </button>
                  </span>`.trim())))
                          .join(``)}
                </div>

                <label>
                  <input
                    type="text"
                    class="card__hashtag-input"
                    name="hashtag-input"
                    placeholder="Type new hashtag here"
                  />
                </label>
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                <input
                  type="radio"
                  id="color-black-4"
                  class="card__color-input card__color-input--black visually-hidden"
                  name="color"
                  value="black"
                  ${this._color === `black` ? `checked` : ``}
                />
                <label
                  for="color-black-4"
                  class="card__color card__color--black"
                  data-color-type="black"
                  >black</label
                >
                <input
                  type="radio"
                  id="color-yellow-4"
                  class="card__color-input card__color-input--yellow visually-hidden"
                  name="color"
                  value="yellow"
                  ${this._color === `yellow` ? `checked` : ``}
                />
                <label
                  for="color-yellow-4"
                  class="card__color card__color--yellow"
                  data-color-type="yellow"
                  >yellow</label
                >
                <input
                  type="radio"
                  id="color-blue-4"
                  class="card__color-input card__color-input--blue visually-hidden"
                  name="color"
                  value="blue"
                  ${this._color === `blue` ? `checked` : ``}
                />
                <label
                  for="color-blue-4"
                  class="card__color card__color--blue"
                  data-color-type="blue"
                  >blue</label
                >
                <input
                  type="radio"
                  id="color-green-4"
                  class="card__color-input card__color-input--green visually-hidden"
                  name="color"
                  value="green"
                  ${this._color === `green` ? `checked` : ``}
                />
                <label
                  for="color-green-4"
                  class="card__color card__color--green"
                  data-color-type="green"
                  >green</label
                >
                <input
                  type="radio"
                  id="color-pink-4"
                  class="card__color-input card__color-input--pink visually-hidden"
                  name="color"
                  value="pink"
                  ${this._color === `pink` ? `checked` : ``}
                />
                <label
                  for="color-pink-4"
                  class="card__color card__color--pink"
                  data-color-type="pink"
                  >pink</label
                >
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`;
  }

  _subscribeOnEvents() {
    this.getElement()
      .querySelector(`.card__hashtag-input`).addEventListener(`keydown`, (evt) => {
        if (evt.key === `Enter`) {
          evt.preventDefault();
          this.getElement().querySelector(`.card__hashtag-list`).insertAdjacentHTML(`beforeend`, `<span class="card__hashtag-inner">
          <input
            type="hidden"
            name="hashtag"
            value="${evt.target.value}"
            class="card__hashtag-hidden-input"
          />
          <p class="card__hashtag-name">
            #${evt.target.value}
          </p>
          <button type="button" class="card__hashtag-delete">
            delete
          </button>
        </span>`);
          evt.target.value = ``;
        }
      });
  }
}
