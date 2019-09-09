import {render, unrender, Position} from '../utils.js';

import TaskController, {Mode as TaskControllerMode} from '../controllers/task-controller.js';

export default class TaskListController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChangeMain = onDataChange;

    this._creatingTask = null;
    this._subscriptions = [];
    this._tasks = [];

    //this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    const defaultTask = {
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

    this._creatingTask = new TaskController(this._container, defaultTask, TaskControllerMode.ADDING, this._onDataChange, this._onChangeView.bind(this));
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

  _renderTasks(tasks) {
    tasks.splice(0, 8).forEach((taskMock) => {
      const taskController = new TaskController(this._container, taskMock, `default`, this._onDataChange, this._onChangeView);
      this._subscriptions.push(taskController.setDefaultView.bind(taskController));
    });


    this._unrenderedTasks = tasks;
    this._renderLoadMoreBtn(this._unrenderedTasks);
  }

  _onDataChange(newData, oldData) {
    let taskIndex = this._tasks.findIndex((it) => it === oldData);

    if (newData === null) {
      this._tasks.splice(taskIndex, 1);
    } else if (oldData === null) {
      this._creatingTask = null;
      this._tasks = [newData, ...this._tasks];
    } else {
      this._tasks[taskIndex] = newData;
    }

    // Обновление списка задач при сохранении/удалении задачи, когда выбрана сортировка.
    if (this._sortedTasks) {
      taskIndex = this._sortedTasks.findIndex((it) => it === oldData);
      if (newData === null) {
        this._sortedTasks.splice(taskIndex, 1);
      } else if (oldData === null) {
        this._creatingTask = null;
        this._sortedTasks = [newData, ...this._sortedTasks];
      } else {
        this._sortedTasks[taskIndex] = newData;
      }
    }

    this.setTasks(this._tasks);
    this._onDataChangeMain(this._tasks);

    //unrender(this._container);
    //this._container.removeElement();

/*    const thisTasks = this._sortedTasks ? this._sortedTasks.slice() : this._tasks.slice();
    render(this._board.getElement(), this._container, Position.BEFOREEND);

    if (taskIndex > 7) {
      thisTasks.forEach((taskMock) => {
        const taskController = new TaskController(this._container, taskMock, this._onDataChange, this._onChangeView);
        this._subscriptions.push(taskController.setDefaultView.bind(taskController));
      });
    } else {
      this._renderTasks(thisTasks);
    }*/
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
