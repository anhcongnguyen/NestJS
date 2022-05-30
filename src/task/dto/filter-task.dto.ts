import { IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../entities/task-status.enum';

export class GetTasksFilterDto {
  status: TaskStatus;

  search: string;
}
