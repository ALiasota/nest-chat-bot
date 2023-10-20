import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async addTodo(name: string) {
    const todo = this.taskRepository.create({ name, isCompleted: false });
    await this.taskRepository.save(todo);
    return todo;
  }

  async getAll() {
    return await this.taskRepository.find();
  }

  async getById(id: number) {
    return await this.taskRepository.findOneBy({ id });
  }

  async finishTodo(id: number) {
    const todo = await this.taskRepository.findOneBy({ id });
    if (!todo) return null;
    todo.isCompleted = true;
    await this.taskRepository.save(todo);
    return todo;
  }

  async editTodo(id: number, name: string) {
    const todo = await this.taskRepository.findOneBy({ id });
    if (!todo) return null;
    todo.name = name;
    await this.taskRepository.save(todo);
    return todo;
  }

  async deleteTodo(id: number) {
    const todo = await this.taskRepository.delete({ id });
    return todo;
  }
}
