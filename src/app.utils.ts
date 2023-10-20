export const showList = (todos) =>
  `Your Todo List \n\n ${todos
    .map((todo) => (todo.isCompleted ? '👌' : '👎') + ' ' + todo.name + '\n\n')
    .join('')}`;
