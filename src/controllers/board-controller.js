import {render, unrender, Position} from '../utils.js';
import Board from '../components/board.js';
import Sort from '../components/sort.js';
import TasksContainer from '../components/tasks-container.js';
import TaskCard from '../components/task-card.js';
import TaskEdit from '../components/task-form.js';
import ButtonLoadMore from '../components/load-button.js';

export default class BoardController {
  constructor(tasks, container) {
    this._tasks = tasks;
    this._container = container;
    this._board = new Board();
    this._sort = new Sort();
    this._tasksContainer = new TasksContainer();
    this._loadMoreBtn = new ButtonLoadMore();
  }

  init() {
    const tasksArr = this._tasks.slice();

    render(this._container, this._board.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._tasksContainer.getElement(), Position.BEFOREEND);
    const tasksContainer = this._board.getElement().querySelector(`.board__tasks`);

    /*const renderTasks = (tasks) => {
      tasks.splice(0, 8).forEach((taskMock) => this._renderTask(taskMock));
    };*/

    if (this._tasks.length < 1 || !(this._tasks.some((day) => day.isArchive === true))) {
      tasksContainer.innerText = `CONGRATULATIONS, ALL TASKS WERE COMPLETED! TO CREATE A NEW CLICK ON «ADD NEW TASK» BUTTON.`;
    } else {
      render(this._board.getElement(), this._sort.getElement(), Position.AFTERBEGIN);
      this._renderTasks(tasksArr);

      this._sort.getElement().addEventListener(`click`, (evt) => this._onSorting(evt));
    }

    this._loadMore(tasksArr);
  }

  _renderTask(taskMock) {
    const task = new TaskCard(taskMock);
    const taskEdit = new TaskEdit(taskMock);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._tasksContainer.getElement().replaceChild(task.getElement(), taskEdit.getElement());
      }
    };

    task.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        this._tasksContainer.getElement().replaceChild(taskEdit.getElement(), task.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    taskEdit.getElement()
      .querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    taskEdit.getElement()
      .querySelector(`.card__save`)
      .addEventListener(`click`, () => {
        this._tasksContainer.getElement().replaceChild(task.getElement(), taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._tasksContainer.getElement(), task.getElement(), Position.BEFOREEND);
  }

  _renderTasks(tasks) {
    tasks.splice(0, 8).forEach((taskMock) => this._renderTask(taskMock));
  }

  _loadMore(list) {

    const onLoadMoreBtnClick = () => {
      if (list.length > 0) {
        this._renderTasks(list);
      }

      if (list.length < 1) {
        unrender(this._loadMoreBtn.getElement());
      }      
    };
    this._loadMoreBtn.getElement().removeEventListener(`click`, onLoadMoreBtnClick);

    if (list.length > 0) {
      const tasksContainer = this._board.getElement().querySelector(`.board__tasks`);
      render(tasksContainer, this._loadMoreBtn.getElement(), Position.BEFOREEND);

      this._loadMoreBtn.getElement().addEventListener(`click`, onLoadMoreBtnClick);
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
        const sortedByDateUpTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);

        //sortedByDateUpTasks.forEach((taskMock) => this._renderTask(taskMock));
        this._renderTasks(sortedByDateUpTasks);
        console.log(sortedByDateUpTasks);
        this._loadMore(sortedByDateUpTasks);

        break;
      case `date-down`:
        const sortedByDateDownTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        sortedByDateDownTasks.forEach((taskMock) => this._renderTask(taskMock));
        break;
      case `default`:
        const sortedByDefaultTasks = this._tasks.slice();
        this._renderTasks(sortedByDefaultTasks);
        this._loadMore(sortedByDefaultTasks);
        //this._tasks.forEach((taskMock) => this._renderTask(taskMock));
        break;
    }
  }
}
