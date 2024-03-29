const AMOUNT_OF_TASKS = 18;

const getTask = () => ({
  id: Math.floor(Math.random() * 50000),
  description: [
    `Prepare for the pitch`,
    `Find money for travel`,
    `Eat something`,
  ][Math.floor(Math.random() * 3)],
  dueDate: [
    new Date(`Fr Feb 2 2020 3:0`),
    new Date(`Sat Feb 3 2020 3:0`),
    new Date(`Mon Feb 4 2020 3:0`),
    new Date(`Wed Feb 5 2020 3:0`),
    null,
  ][Math.floor(Math.random() * 5)],
  tags: new Set([
    `cinema`,
    `entertainment`,
    `myself`,
    `cinema`,
  ]),
  repeatingDays: {
    'mo': false,
    'tu': false,
    'we': false,
    'th': false,
    'fr': Boolean(Math.round(Math.random())),
    'sa': false,
    'su': false,
  },
  color: [
    `black`,
    `yellow`,
    `blue`,
    `green`,
    `pink`,
  ][Math.floor(Math.random() * 5)],
  isFavorite: Boolean(Math.round(Math.random())),
  isArchive: Boolean(Math.round(Math.random())),
});

const tasksListRaw = Array.from(Array(AMOUNT_OF_TASKS)).map(getTask);
const tasksList = tasksListRaw.slice().sort((a, b) => a.id - b.id);

const filtersList = [
  {
    title: `all`,
    count: tasksList.length,
  },
  {
    title: `overdue`,
    count: tasksList.filter((it) => it.dueDate < Date.now()).length,
  },
  {
    title: `today`,
    count: tasksList.filter((it) => it.dueDate === Date.now()).length, // мы ведь будем использовать lib для формата дат, поэтому не делаю тут велосипед
  },
  {
    title: `favorites`,
    count: tasksList.filter((it) => it.isFavorite).length
  },
  {
    title: `repeating`,
    count: tasksList.filter((task) => Object.keys(task.repeatingDays).some((day) => task.repeatingDays[day])).length
  },
  {
    title: `tags`,
    count: tasksList.filter((it) => it.tags).length,
  },
  {
    title: `archive`,
    count: tasksList.filter((it) => it.isArchive).length
  }
];

export {tasksList, filtersList};
