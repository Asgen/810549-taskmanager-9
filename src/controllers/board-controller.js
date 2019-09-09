import {render, unrender, Position} from '../utils.js';
import Board from '../components/board.js';
import Sort from '../components/sort.js';
import TasksContainer from '../components/tasks-container.js';
import TaskListController from '../controllers/task-list-controller.js';
import ButtonLoadMore from '../components/load-button.js';

const TASKS_IN_ROW = 8;

export default class BoardController {
  constructor(container) {
    this._tasks = [];
    this._container = container;
    this._board = new Board();
    this._sort = new Sort();
    this._tasksContainer = new TasksContainer();
    this._loadMoreBtn = new ButtonLoadMore();
    this._unrenderedTasks = 0;
    this._tasksPortion = 0;
    this._sortedTasks = null;
    //this._creatingTask = null;

    // Хранением тасков занимается отдельный контроллер.
    // Мы сможем его использовать и на странице Поиска.
    this._taskListController = new TaskListController(this._tasksContainer.getElement(), this._onDataChange.bind(this));
    //this._subscriptions = [];
    //this._onChangeView = this._onChangeView.bind(this);
    //this._onDataChange = this._onDataChange.bind(this);

    this.init();
  }

  init() {
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._sort.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._tasksContainer.getElement(), Position.BEFOREEND);
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSorting(evt));
  }

  _renderBoard() {
    const tasksArr = this._tasks.slice();


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
        unrender(this._loadMoreBtn.getElement());
        this._taskListController.addTasks(this._unrenderedTasks.splice(0, 8));
        render(this._tasksContainer.getElement(), this._loadMoreBtn.getElement(), Position.BEFOREEND);
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

    this._creatingTask = new TaskListController(this._tasksContainer, defaultTask, `adding`, this._onDataChange, this._onChangeView);
  }

  /*_renderTasks(tasks) {
    tasks.splice(0, 8).forEach((taskMock) => {
      const taskController = new TaskController(this._tasksContainer, taskMock, `default`, this._onDataChange, this._onChangeView);
      this._subscriptions.push(taskController.setDefaultView.bind(taskController));
    });


    this._unrenderedTasks = tasks;
    this._renderLoadMoreBtn(this._unrenderedTasks);
  }*/

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(tasks) {
    this._tasks = tasks;

    this._renderBoard();
  }

  _onDataChange(tasks) {
    // Переписываем видимую часть тасков
    this._tasks = tasks;

    this._renderBoard();
  }

  /*_onDataChange(newData, oldData) {
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
  }*/

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
        this._setTasks(sortedByDateUpTasks);
        break;
      case `date-down`:
        this._sortedTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        const sortedByDateDownTasks = this._sortedTasks.slice();
        this._setTasks(sortedByDateDownTasks);
        break;
      case `default`:
        this._sortedTasks = null;
        const sortedByDefaultTasks = this._tasks.slice();
        this._setTasks(sortedByDefaultTasks);
        break;
    }
  }
}
