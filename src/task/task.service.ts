import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { TaskStatus } from './entities/task-status.enum';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from 'src/auth/user.entity';
import { GetTasksFilterDto } from './dto/filter-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) {}

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id, user } });

    if (!task) {
      throw new NotFoundException(`Task with "${id}" not found`);
    }

    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskRepo.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    // Watch query builder to sql
    // console.log(query.getSql());

    const tasks = await query.getMany();
    return tasks;
  }

  async getAllTask(): Promise<Task[]> {
    const result = this.taskRepo.find();
    return result;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskRepo.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.taskRepo.save(task);
    return task;
  }

  async deleteTask(id: string, user: User): Promise<string> {
    const task = await this.getTaskById(id, user);
    if (!task) {
      return `Cannot found the task with ${id}`;
    }
    await this.taskRepo.delete(task.id);
    return `This task ${id} was remove sucessful`;
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<string> {
    const task = await this.getTaskById(id, user);
    if (task) {
      task.status = TaskStatus.IN_PROGRESS;
      task.title = updateTaskDto.title;
      task.description = updateTaskDto.description;
      this.taskRepo.save(task);
      return `Task ${id} was updated sucessful`;
    }

    return `Task ${id} cannot found`;
  }
}
