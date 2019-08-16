import {menu as getMenuTemplate} from '../src/components/menu.js';
import {search as getSearchTemplate} from '../src/components/search.js';
import {filtersContainer as getFiltersContainer} from '../src/components/filters-container.js';
import {filters as getFiltersTemplate} from '../src/components/filters.js';
import {board as getBoardContainer} from '../src/components/board.js';
import {card as getTaskTamplate} from '../src/components/task-card.js';
import {form as getTaskFormTemplate} from '../src/components/task-form.js';
import {button as getLoadButton} from '../src/components/load-button.js';

import {tasksList, filtersList} from '../src/data.js';
const tasksArr = tasksList.slice();

const renderComponent = (container, component, repeat = 1, placement = `beforeend`) => {
  for (let i = 0; i < repeat; i++) {
    container.insertAdjacentHTML(placement, component);
  }
};

const renderEditTask = (container, list, tamplate, placement = `beforeend`) => {
  container.insertAdjacentHTML(placement, tamplate(list.shift()));
};

const renderTask = (container, list, tamplate, placement = `beforeend`) => {
  container.insertAdjacentHTML(placement, list.splice(0, 7)
    .map(tamplate)
    .join(``));
};

const renderMoreTask = (container, list, tamplate, placement = `beforeend`) => {
  container.insertAdjacentHTML(placement, list.splice(0, 8)
    .map(tamplate)
    .join(``));
};

const renderFilter = (container, list, tamplate, placement = `beforeend`) => {
  container.insertAdjacentHTML(placement, list
    .map(tamplate)
    .join(``));
};

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);
renderComponent(menuContainer, getMenuTemplate());
renderComponent(mainContainer, getSearchTemplate());
renderComponent(mainContainer, getFiltersContainer());

const filtersContainer = mainContainer.querySelector(`.main__filter`);
renderFilter(filtersContainer, filtersList, getFiltersTemplate);
renderComponent(mainContainer, getBoardContainer());

const boardContainer = mainContainer.querySelector(`.board`);
const tasksContainer = mainContainer.querySelector(`.board__tasks`);

renderEditTask(tasksContainer, tasksArr, getTaskFormTemplate);
renderTask(tasksContainer, tasksArr, getTaskTamplate);
renderComponent(boardContainer, getLoadButton());

const loadMore = boardContainer.querySelector(`.load-more`);
loadMore.addEventListener(`click`, () => {
  if (tasksArr.length > 0) {
    renderMoreTask(tasksContainer, tasksArr, getTaskTamplate);
  }
  if (tasksArr.length < 1) {
    loadMore.style.display = `none`;
  }
});
