import {menu as getMenuTemplate} from '../src/components/menu.js';
import {search as getSearchTemplate} from '../src/components/search.js';
import {filters as getFiltersTemplate} from '../src/components/filters.js';
import {board as getBoardContainer} from '../src/components/board.js';
import {card as getTaskCardTemplate} from '../src/components/task-card.js';
import {form as getTaskFormTemplate} from '../src/components/task-form.js';
import {button as getLoadButton} from '../src/components/load-button.js';

const renderComponent = (container, component, repeat = 1, placement = `beforeend`) => {
  for (let i = 0; i < repeat; i++) {
    container.insertAdjacentHTML(placement, component);
  }
};

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);

renderComponent(menuContainer, getMenuTemplate());
renderComponent(mainContainer, getSearchTemplate());
renderComponent(mainContainer, getFiltersTemplate());
renderComponent(mainContainer, getBoardContainer());
const boardContainer = mainContainer.querySelector(`.board`);
const tasksContainer = mainContainer.querySelector(`.board__tasks`);
renderComponent(tasksContainer, getTaskFormTemplate());
renderComponent(tasksContainer, getTaskCardTemplate(), 2);
renderComponent(boardContainer, getLoadButton());
