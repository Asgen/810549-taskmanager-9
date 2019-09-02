import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

import {render, Position} from '../utils.js';
import TaskCard from '../components/task-card.js';
import TaskEdit from '../components/task-form.js';

export default class TaskController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._taskView = new TaskCard(data);
    this._taskEdit = new TaskEdit(data);
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;

    this.create();
  }

  create() {
    flatpickr(this._taskEdit
      .getElement()
      .querySelector(`.card__date`)
    );

    const addToFavorite = this._taskEdit.getElement().querySelector(`.card__btn--favorites`);
    const addToArchive = this._taskEdit.getElement().querySelector(`.card__btn--archive`);

    const dateStatus = this._taskEdit.getElement().querySelector(`.card__date-status`);
    const repeatStatus = this._taskEdit.getElement().querySelector(`.card__repeat-status`);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._container.getElement().replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
      }
    };

    this._taskView.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._onChangeView();
        this._container.getElement().replaceChild(this._taskEdit.getElement(), this._taskView.getElement());

        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement()
      .querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement()
      .querySelector(`.card__save`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        const formData = new FormData(this._taskEdit.getElement().querySelector(`.card__form`));

        const entry = {
          description: formData.get(`text`),
          color: formData.get(`color`),
          tags: new Set(formData.getAll(`hashtag`)),
          dueDate: dateStatus.innerText === `YES` && repeatStatus.innerText !== `YES` ? new Date(formData.get(`date`)) : ``,
          repeatingDays: repeatStatus.innerText === `YES` && dateStatus.innerText !== `YES` ? formData.getAll(`repeat`).reduce((acc, it) => {
            acc[it] = true;
            return acc;
          }, {
            'mo': false,
            'tu': false,
            'we': false,
            'th': false,
            'fr': false,
            'sa': false,
            'su': false,
          }) : ``,
          isFavorite: addToFavorite.classList.contains(`card__btn--disabled`) ? true : false,
          isArchive: addToArchive.classList.contains(`card__btn--disabled`) ? true : false,
        };

        this._onDataChange(entry, this._data);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    addToFavorite.addEventListener(`click`, (e) => {
      e.preventDefault();
      addToFavorite.classList.toggle(`card__btn--disabled`);
    });

    addToArchive.addEventListener(`click`, (e) => {
      e.preventDefault();
      addToArchive.classList.toggle(`card__btn--disabled`);
    });

    render(this._container.getElement(), this._taskView.getElement(), Position.BEFOREEND);
  }

  setDefaultView() {
    if (this._container.getElement().contains(this._taskEdit.getElement())) {
      this._container.getElement().replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
    }
  }
}
