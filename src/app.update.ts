import { AppService } from './app.service';
import {
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { actionButtons } from './app.buttons';
import { Context } from './context.interface';
import { showList } from './app.utils';

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

  @Hears('🖍 Add Todo')
  async addTask(ctx: Context) {
    await ctx.reply('Enter task name:');
    ctx.session.type = 'add';
  }

  @Hears('💾 Todo List')
  async listTask(ctx: Context) {
    const todos = await this.appService.getAll();
    await ctx.reply(showList(todos));
  }

  @Hears('👌 Finish')
  async doneTask(ctx: Context) {
    await ctx.reply('Enter task ID:');
    ctx.session.type = 'done';
  }

  @Hears('🪓 Delete')
  async deleteTask(ctx: Context) {
    await ctx.reply('Enter task ID:');
    ctx.session.type = 'delete';
  }

  @Hears('🛠 Edit')
  async editTask(ctx: Context) {
    await ctx.deleteMessage();
    await ctx.replyWithHTML(
      'Enter task ID and new name: \n\n' + 'Example: <b>1  | new name</b>',
    );
    ctx.session.type = 'edit';
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;
    if (ctx.session.type === 'done') {
      const todo = await this.appService.finishTodo(Number(message));
      if (!todo) {
        await ctx.deleteMessage();
        await ctx.reply('Todo not found');
        return;
      }
    } else if (ctx.session.type === 'edit') {
      const [id, newName] = message.split(' | ');
      const todo = await this.appService.editTodo(Number(id), newName);
      if (!todo) {
        await ctx.deleteMessage();
        await ctx.reply('Todo not found');
        return;
      }
    } else if (ctx.session.type === 'delete') {
      const todo = await this.appService.deleteTodo(Number(message));
      if (!todo) {
        await ctx.deleteMessage();
        await ctx.reply('Todo not found');
        return;
      }
    } else if (ctx.session.type === 'add') {
      const todo = await this.appService.addTodo(message);
      if (!todo) {
        await ctx.deleteMessage();
        await ctx.reply('Todo not found');
        return;
      }
    }

    const todos = await this.appService.getAll();
    await ctx.reply(showList(todos));
  }
}
