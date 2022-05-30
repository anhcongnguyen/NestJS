import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import config from '../ormconfig';

@Module({
  imports: [TaskModule, TypeOrmModule.forRoot(config), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
