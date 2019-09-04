import {render, unrender, Position} from '../utils.js';
import Board from '../components/board.js';
import Sort from '../components/sort.js';
import TasksContainer from '../components/tasks-container.js';
import TaskController from '../controllers/task-controller.js';

import ButtonLoadMore from '../components/load-button.js';

export default class BoardController {
  constructor(tasks, container) {
    this._tasks = tasks;
    this._container = container;
    this._board = new Board();
    this._sort = new Sort();
    this._tasksContainer = new TasksContainer();
    this._loadMoreBtn = new ButtonLoadMore();
    this._unrenderedTasks = 0;
    this._sortedTasks = null;

    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  init() {

    const tasksArr = this._tasks.slice();

    render(this._container, this._board.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._tasksContainer.getElement(), Position.BEFOREEND);

    if (this._tasks.length < 1 || !(this._tasks.some((day) => day.isArchive === true))) {
      this._tasksContainer.getElement().innerText = `CONGRATULATIONS, ALL TASKS WERE COMPLETED! TO CREATE A NEW CLICK ON «ADD NEW TASK» BUTTON.`;
    } else {
      render(this._board.getElement(), this._sort.getElement(), Position.AFTERBEGIN);
      this._renderTasks(tasksArr);
      this._sort.getElement().addEventListener(`click`, (evt) => this._onSorting(evt));
    }

    if (tasksArr.length > 0) {
      render(this._tasksContainer.getElement(), this._loadMoreBtn.getElement(), Position.BEFOREEND);
    }

    this._unrenderedTasks = tasksArr;
    this._loadMoreBtn.getElement().addEventListener(`click`, () => {
      if (this._unrenderedTasks.length > 0) {
        this._renderTasks(this._unrenderedTasks);
      }
      if (this._unrenderedTasks.length < 1) {
        unrender(this._loadMoreBtn.getElement());
      }
    });
  }

  _renderTasks(tasks) {
    tasks.splice(0, 8).forEach((taskMock) => {
      const taskController = new TaskController(this._tasksContainer, taskMock, this._onDataChange, this._onChangeView);
      this._subscriptions.push(taskController.setDefaultView.bind(taskController));
    });


    this._unrenderedTasks = tasks;
    this._renderLoadMoreBtn(this._unrenderedTasks);
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(newData, oldData) {
    let taskIndex = this._tasks.findIndex((it) => it === oldData);
    this._tasks[taskIndex] = newData;

    if (this._sortedTasks) {
      taskIndex = this._sortedTasks.findIndex((it) => it === oldData);
      this._sortedTasks[taskIndex] = newData;
    }

    unrender(this._tasksContainer.getElement());
    this._tasksContainer.removeElement();

    const thisTasks = this._sortedTasks ? this._sortedTasks.slice() : this._tasks.slice();
    render(this._board.getElement(), this._tasksContainer.getElement(), Position.BEFOREEND);

    if (taskIndex > 7) {
      thisTasks.forEach((taskMock) => {
        const taskController = new TaskController(this._tasksContainer, taskMock, this._onDataChange, this._onChangeView);
        this._subscriptions.push(taskController.setDefaultView.bind(taskController));
      });
    } else {
      this._renderTasks(thisTasks);
    }
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
        const sortedByDateUpTasks = this._sortedTasks.slice();
        this._renderTasks(sortedByDateUpTasks);
        break;
      case `date-down`:
        this._sortedTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        const sortedByDateDownTasks = this._sortedTasks.slice();
        this._renderTasks(sortedByDateDownTasks);
        break;
      case `default`:
        this._sortedTasks = null;
        const sortedByDefaultTasks = this._tasks.slice();
        this._renderTasks(sortedByDefaultTasks);
        break;
    }
  }
}
