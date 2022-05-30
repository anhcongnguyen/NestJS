import { IsNotEmpty } from 'class-validator';

export class UpdateTaskDto {
  title: string;

  description: string;
}
