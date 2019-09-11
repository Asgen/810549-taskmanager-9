import {render, Position} from '../utils.js';

import TaskController, {Mode as TaskControllerMode} from '../controllers/task-controller.js';

export default class TaskListController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChangeMain = onDataChange;

    this._creatingTask = null;
    this._subscriptions = [];
    this._tasks = [];

    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    const defaultTask = {
      id: Math.floor(Math.random() * 50000),
      description: `My new task`,
      color: `black`,
      tags: new Set(),
      dueDate: null,
      repeatingDays: {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      },
      isFavorite: false,
      isArchive: false,
    };

    this._creatingTask = new TaskController(this._container, defaultTask, TaskControllerMode.ADDING, this._onChangeView, (...args) => {
      this._creatingTask = null;
      this._onDataChange(...args);
    });
  }

  setTasks(tasks) {
    this._tasks = tasks;
    this._subscriptions = [];

    this._container.innerHTML = ``;
    this._tasks.forEach((task) => this._renderTask(task));
  }

  addTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
    this._tasks = this._tasks.concat(tasks);
  }

  _renderTask(task) {

    const taskController = new TaskController(this._container, task, TaskControllerMode.DEFAULT, this._onChangeView, this._onDataChange);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _onDataChange(newData, oldData) {
    let taskIndex = this._tasks.findIndex((it) => it === oldData);

    let deletedTaskId = null;

    if (newData === null) {
      deletedTaskId = this._tasks[taskIndex].id;
      this._tasks.splice(taskIndex, 1);
    } else if (oldData === null) {
      this._creatingTask = null;
      this._tasks = [newData, ...this._tasks];
    } else {
      this._tasks[taskIndex] = newData;
    }

    this._onDataChangeMain(this._tasks, taskIndex, deletedTaskId);
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _renderLoadMoreBtn(list) {
    if (list.length > 0) {
      render(this._container, this._loadMoreBtn.getElement(), Position.BEFOREEND);
    }
  }
}
