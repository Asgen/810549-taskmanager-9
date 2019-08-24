import {render, Position} from '../src/utils.js';
import {tasksList, filtersList} from '../src/data.js';

import FiltersContainer from '../src/components/filters-container.js';
import Menu from '../src/components/menu.js';
import Search from '../src/components/search.js';
import Filter from '../src/components/filters.js';
import Board from '../src/components/board.js';
import TaskCard from '../src/components/task-card.js';
import TaskEdit from '../src/components/task-form.js';
import ButtonLoadMore from '../src/components/load-button.js';

const tasksArr = tasksList.slice();

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

const renderFilter = (filters) => {
  filters.forEach((taskMock) => {
    const filter = new Filter(taskMock);
    render(filtersContainer, filter.getElement(), Position.BEFOREEND);
  });
};

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);
render(menuContainer, new Menu().getElement(), Position.BEFOREEND);
render(mainContainer, new Search().getElement(), Position.BEFOREEND);
render(mainContainer, new FiltersContainer().getElement(), Position.BEFOREEND);

const filtersContainer = mainContainer.querySelector(`.main__filter`);
renderFilter(filtersList);
render(mainContainer, new Board().getElement(), Position.BEFOREEND);

const boardContainer = mainContainer.querySelector(`.board`);
const tasksContainer = mainContainer.querySelector(`.board__tasks`);
render(boardContainer, new ButtonLoadMore().getElement(), Position.BEFOREEND);


if (tasksList.length < 1 || !(tasksList.some((day) => day.isArchive === true))) {
  tasksContainer.innerText = `CONGRATULATIONS, ALL TASKS WERE COMPLETED! TO CREATE A NEW CLICK ON «ADD NEW TASK» BUTTON.`;
} else {
  renderTasks(tasksArr);
}

const loadMore = boardContainer.querySelector(`.load-more`);
loadMore.addEventListener(`click`, () => {
  if (tasksArr.length > 0) {
    renderTasks(tasksArr);
  }
  if (tasksArr.length < 1) {
    loadMore.style.display = `none`;
  }
});
