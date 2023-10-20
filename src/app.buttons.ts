import { Markup } from 'telegraf';

export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback('💾 Todo List', 'list'),
      Markup.button.callback('👌 Finish', 'finish'),
      Markup.button.callback('🛠 Edit', 'edit'),
      Markup.button.callback('🪓 Delete', 'delete'),
    ],
    {
      columns: 2,
    },
  );
}
