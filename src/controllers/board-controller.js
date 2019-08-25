import {render, Position} from '../utils.js';
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
    const boardContainer = this._container.querySelector(`.board`);
    render(boardContainer, this._tasksContainer.getElement(), Position.BEFOREEND);
    const tasksContainer = boardContainer.querySelector(`.board__tasks`);

    const renderTask = (taskMock) => {
      const task = new TaskCard(taskMock);
      const taskEdit = new TaskEdit(taskMock);

      const onEscKeyDown = (evt) => {
        if (evt.key === `Escape` || evt.key === `Esc`) {
          tasksContainer.replaceChild(task.getElement(), taskEdit.getElement());
        }
      };

      task.getElement()
        .querySelector(`.card__btn--edit`)
        .addEventListener(`click`, () => {
          tasksContainer.replaceChild(taskEdit.getElement(), task.getElement());
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
          tasksContainer.replaceChild(task.getElement(), taskEdit.getElement());
          document.removeEventListener(`keydown`, onEscKeyDown);
        });

      render(tasksContainer, task.getElement(), Position.BEFOREEND);
    };

    const renderTasks = (tasks) => {
      tasks.splice(0, 8).forEach((taskMock) => renderTask(taskMock));
    };

    if (this._tasks.length < 1 || !(this._tasks.some((day) => day.isArchive === true))) {
      tasksContainer.innerText = `CONGRATULATIONS, ALL TASKS WERE COMPLETED! TO CREATE A NEW CLICK ON «ADD NEW TASK» BUTTON.`;
    } else {
      renderTasks(tasksArr);
    }

    if (tasksArr.length > 0) {
      render(tasksContainer, this._loadMoreBtn.getElement(), Position.BEFOREEND);
      const loadMore = tasksContainer.querySelector(`.load-more`);

      loadMore.addEventListener(`click`, () => {
        if (tasksArr.length > 0) {
          renderTasks(tasksArr);
        }
        if (tasksArr.length < 1) {
          loadMore.style.display = `none`;
        }
      });
    }
  }
}
