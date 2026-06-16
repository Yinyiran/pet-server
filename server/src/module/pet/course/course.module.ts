import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from './entities/course.entity';
import { CourseVideoEntity } from './entities/course-video.entity';
import { UserCourseEntity } from './entities/user-course.entity';
import { CourseService } from './course.service';
import { CourseController, CourseVideoController, StudentController, AppCourseController } from './course.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity, CourseVideoEntity, UserCourseEntity])],
  controllers: [CourseController, CourseVideoController, StudentController, AppCourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
