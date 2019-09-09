import {render, unrender, Position} from '../utils.js';
import Board from '../components/board.js';
import Sort from '../components/sort.js';
import TasksContainer from '../components/tasks-container.js';
import TaskListController from '../controllers/task-list-controller.js';
import ButtonLoadMore from '../components/load-button.js';

const TASKS_IN_ROW = 8;

export default class BoardController {
  constructor(container) {
    this._container = container;
    this._tasks = [];

    this._board = new Board();
    this._sort = new Sort();
    this._tasksContainer = new TasksContainer();
    this._loadMoreBtn = new ButtonLoadMore();

    this._unrenderedTasks = 0;
    this._sortedTasks = null;

    // Хранением тасков занимается отдельный контроллер.
    // Мы сможем его использовать и на странице Поиска.
    this._taskListController = new TaskListController(this._tasksContainer.getElement(), this._onDataChange.bind(this));

    this.init();
  }

  init() {
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._sort.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._tasksContainer.getElement(), Position.BEFOREEND);
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSorting(evt));
  }

  _renderBoard() {
    render(this._board.getElement(), this._tasksContainer.getElement(), Position.BEFOREEND);
    const tasksArr = this._sortedTasks ? this._sortedTasks : this._tasks.slice();

    if (this._tasks.length < 1 || !(this._tasks.some((day) => day.isArchive === true))) {
      unrender(this._sort.getElement());
      this._tasksContainer.getElement().innerText = `CONGRATULATIONS, ALL TASKS WERE COMPLETED! TO CREATE A NEW CLICK ON «ADD NEW TASK» BUTTON.`;
      return;
    }

    this._taskListController.setTasks(tasksArr.splice(0, 8));

    this._renderLoadMoreBtn(tasksArr);

    this._unrenderedTasks = tasksArr;
    this._loadMoreBtn.getElement().addEventListener(`click`, () => {
      if (this._unrenderedTasks.length > 0) {
        this._taskListController.addTasks(this._unrenderedTasks.splice(0, 8));
        this._tasksContainer.getElement().appendChild(this._loadMoreBtn.getElement());
      }
      if (this._unrenderedTasks.length < 1) {
        unrender(this._loadMoreBtn.getElement());
      }
    });
  }

  _setTasks(tasks) {
    this._tasks = tasks;
    this._showedTasks = TASKS_IN_ROW;

    this._renderBoard();
  }

  hide() {
    this._board.getElement().classList.add(`visually-hidden`);
  }

  // Добавили изменение тасков снаружи
  show(tasks) {
    if (tasks !== this._tasks) {
      this._setTasks(tasks);
    }

    this._board.getElement().classList.remove(`visually-hidden`);
  }

  createTask() {
    this._taskListController.createTask();
  }

  _onDataChange(tasks) {
    // Переписываем видимую часть тасков
    this._tasks = tasks;

    this._renderBoard();
  }

  _renderLoadMoreBtn(list) {
    if (list.length > 0) {
      render(this._tasksContainer.getElement(), this._loadMoreBtn.getElement(), Position.BEFOREEND);
    }
  }

  _onSorting(e) {
    e.preventDefault();

    if (e.target.tagName !== `A`) {
      return;
    }

    this._tasksContainer.getElement().innerHTML = ``;

    switch (e.target.dataset.sortType) {
      case `date-up`:
        this._sortedTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        this._renderBoard();
        break;
      case `date-down`:
        this._sortedTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        this._renderBoard();
        break;
      case `default`:
        this._sortedTasks = null;
        this._renderBoard();
        break;
    }
  }
}
