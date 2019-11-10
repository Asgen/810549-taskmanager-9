import {render, unrender, Position} from '../utils.js';

import SearchResult from '../components/search-result.js';
import SearchResultInfo from '../components/search-result-info.js';
import SearchResultGrope from '../components/search-result-group.js';

import TaskListController from '../controllers/task-list-controller.js';


export default class SearchController {
  constructor(container, search, onBackButtonClick, onDataChange) {
    this._container = container;
    this._tasks = [];
    this._filteredTasks = [];
    this._search = search;
    this._currentQ = ``;

    this._searchContainer = new SearchResult();
    this._searchGroup = new SearchResultGrope();

    this._onBackBtnClick = onBackButtonClick;
    this._onDataChangeMain = onDataChange;

    // Хранением тасков занимается отдельный контроллер.
    this._taskListController = new TaskListController(this._searchGroup.getElement().querySelector(`.result__cards`), this._onDataChange.bind(this));

    this.init();
  }

  init() {
    render(this._container, this._searchContainer.getElement(), Position.BEFOREEND);
    render(this._searchContainer.getElement(), this._searchGroup.getElement(), Position.BEFOREEND);

    this._searchContainer.getElement().querySelector(`.result__back`)
      .addEventListener(`click`, () => {
        this._search.getElement().querySelector(`input`).value = ``;
        this._onBackBtnClick();
      });

    this._search.getElement().querySelector(`input`)
      .addEventListener(`keyup`, (evt) => {
        this._currentQ = evt.target.value;
        const tasks = this._filterTasks(this._tasks);

        this._showSearchResult(this._currentQ, tasks);
      });
  }

  hide() {
    this._searchContainer.getElement().classList.add(`visually-hidden`);
  }

  // Добавили изменение тасков снаружи
  show(tasks, q) {
    this._tasks = tasks;

    if (this._searchContainer.getElement().classList.contains(`visually-hidden`)) {
      this._showSearchResult(q, this._filterTasks(this._tasks));
      this._searchContainer.getElement().classList.remove(`visually-hidden`);
    }
  }

  _showSearchResult(q, tasks) {

    const tasksArr = tasks.slice();

    if (this._searchInfo) {
      unrender(this._searchInfo.getElement());
      this._searchInfo.removeElement();
    }

    this._searchInfo = new SearchResultInfo(q, tasks.length);
    render(this._searchGroup.getElement(), this._searchInfo.getElement(), Position.AFTERBEGIN);

    this._taskListController.setTasks(tasksArr);
  }

  _filterTasks(tasks) {
    return tasks.filter((task) => {
      return task.description.includes(this._currentQ);
    });
  }

  _onDataChange(tasks, taskIndexInSearch, deletedTaskId) {

    if (deletedTaskId) {
      this._tasks.splice(this._tasks.findIndex((it) => it.id === deletedTaskId), 1);
    } else {
      this._tasks[this._tasks.findIndex((it) => it.id === tasks[taskIndexInSearch].id)] = tasks[taskIndexInSearch];
    }

    const newSearch = this._filterTasks(this._tasks);
    this._showSearchResult(this._currentQ, newSearch);

    this._onDataChangeMain(this._tasks);
  }
}
