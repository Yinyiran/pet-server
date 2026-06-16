import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CourseService } from './course.service';
import { CreateCourseDto, UpdateCourseDto, ListCourseDto, CreateVideoDto, UpdateVideoDto, ListStudentDto } from './dto/index';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';

@ApiTags('业务-课程管理')
@ApiBearerAuth('Authorization')
@Controller('pet/course')
export class CourseController {
  constructor(private readonly service: CourseService) {}

  @ApiOperation({ summary: '课程列表' })
  @RequirePermission('pet:course:list')
  @Get('list')
  findAll(@Query() query: ListCourseDto) { return this.service.findAll(query); }

  @ApiOperation({ summary: '课程详情' })
  @RequirePermission('pet:course:query')
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @ApiOperation({ summary: '新增课程' })
  @RequirePermission('pet:course:add')
  @Post()
  create(@Body() dto: CreateCourseDto) { return this.service.createCourse(dto); }

  @ApiOperation({ summary: '更新课程' })
  @RequirePermission('pet:course:edit')
  @Put()
  update(@Body() dto: UpdateCourseDto) { return this.service.updateCourse(dto); }

  @ApiOperation({ summary: '删除课程' })
  @RequirePermission('pet:course:remove')
  @Delete(':ids')
  remove(@Param('ids') ids: string) { return this.service.removeCourse(ids); }
}

@ApiTags('业务-课程视频')
@ApiBearerAuth('Authorization')
@Controller('pet/course-video')
export class CourseVideoController {
  constructor(private readonly service: CourseService) {}

  @ApiOperation({ summary: '视频列表' })
  @RequirePermission('pet:course:list')
  @Get('list')
  findAll(@Query('courseId') courseId: number) { return this.service.findVideos(courseId); }

  @ApiOperation({ summary: '新增视频' })
  @RequirePermission('pet:course:edit')
  @Post()
  create(@Body() dto: CreateVideoDto) { return this.service.createVideo(dto); }

  @ApiOperation({ summary: '更新视频' })
  @RequirePermission('pet:course:edit')
  @Put()
  update(@Body() dto: UpdateVideoDto) { return this.service.updateVideo(dto); }

  @ApiOperation({ summary: '删除视频' })
  @RequirePermission('pet:course:edit')
  @Delete(':ids')
  remove(@Param('ids') ids: string) { return this.service.removeVideo(ids); }
}

@ApiTags('业务-学员管理')
@ApiBearerAuth('Authorization')
@Controller('pet/student')
export class StudentController {
  constructor(private readonly service: CourseService) {}

  @ApiOperation({ summary: '学员列表' })
  @RequirePermission('pet:student:list')
  @Get('list')
  findAll(@Query() query: ListStudentDto) { return this.service.findStudents(query); }
}

@ApiTags('小程序-课程')
@ApiBearerAuth('Authorization')
@Controller('app/course')
export class AppCourseController {
  constructor(private readonly service: CourseService) {}

  @ApiOperation({ summary: '课程列表' })
  @Get('list')
  getList(@Query() query: any) { return this.service.getAppCourses(query); }

  @ApiOperation({ summary: '课程详情' })
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.getAppCourseDetail(+id); }

  @ApiOperation({ summary: '购买课程' })
  @Post(':id/purchase')
  purchase(@Req() req: any, @Param('id') id: string) { return this.service.purchaseCourse(req.user?.userId, +id); }

  @ApiOperation({ summary: '我的课程' })
  @Get('my/list')
  getMyCourses(@Req() req: any) { return this.service.getMyCourses(req.user?.userId); }
}
