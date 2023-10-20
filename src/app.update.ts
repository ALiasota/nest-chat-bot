import { AppService } from './app.service';
import { Hears, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { actionButtons } from './app.buttons';

const todos = [
  {
    number: 1,
    name: 'Clean',
    isCompleted: false,
  },
  {
    number: 2,
    name: 'Walk',
    isCompleted: false,
  },
  {
    number: 3,
    name: 'Eat',
    isCompleted: true,
  },
];

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Hi! Friend 🤟');
    await ctx.reply('What do you want to do?', actionButtons());
  }

  @Hears('💾 Todo List')
  async listTask(ctx: Context) {
    await ctx.reply(
      `Your Todo List \n\n ${todos
        .map(
          (todo) => (todo.isCompleted ? '👌' : '👎') + ' ' + todo.name + '\n\n',
        )
        .join('')}`,
    );
  }

  @Hears('👌 Finish')
  async doneTask(ctx: Context) {
    await ctx.reply(
      `Your Todo List \n\n ${todos
        .map(
          (todo) => (todo.isCompleted ? '👌' : '👎') + ' ' + todo.name + '\n\n',
        )
        .join('')}`,
    );
  }
}
