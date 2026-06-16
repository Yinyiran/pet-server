import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { CourseEntity } from './entities/course.entity';
import { CourseVideoEntity } from './entities/course-video.entity';
import { UserCourseEntity } from './entities/user-course.entity';
import { CreateCourseDto, UpdateCourseDto, ListCourseDto, CreateVideoDto, UpdateVideoDto, ListStudentDto } from './dto/index';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity) private readonly courseRepo: Repository<CourseEntity>,
    @InjectRepository(CourseVideoEntity) private readonly videoRepo: Repository<CourseVideoEntity>,
    @InjectRepository(UserCourseEntity) private readonly ucRepo: Repository<UserCourseEntity>,
  ) {}

  // ====== 课程管理 ======
  async findAll(query: ListCourseDto) {
    const qb = this.courseRepo.createQueryBuilder('c');
    if (query.keyword) qb.andWhere('c.name LIKE :kw', { kw: `%${query.keyword}%` });
    if (query.tier) qb.andWhere('c.tier = :t', { t: query.tier });
    if (query.isActive !== undefined && query.isActive !== null) qb.andWhere('c.isActive = :a', { a: query.isActive });
    qb.orderBy('c.sortOrder', 'ASC').addOrderBy('c.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  async findOne(id: number) {
    const data = await this.courseRepo.findOne({ where: { id } });
    const videos = await this.videoRepo.find({ where: { courseId: id }, order: { sortOrder: 'ASC' } });
    return ResultData.ok({ ...data, videos });
  }

  async createCourse(dto: CreateCourseDto) {
    await this.courseRepo.save(dto);
    return ResultData.ok();
  }

  async updateCourse(dto: UpdateCourseDto) {
    const { id, ...data } = dto;
    await this.courseRepo.update(id, data);
    return ResultData.ok();
  }

  async removeCourse(ids: string) {
    await this.courseRepo.delete(ids.split(',').map(Number));
    return ResultData.ok();
  }

  // ====== 视频管理 ======
  async findVideos(courseId: number) {
    const list = await this.videoRepo.find({ where: { courseId }, order: { sortOrder: 'ASC' } });
    return ResultData.ok(list);
  }

  async createVideo(dto: CreateVideoDto) {
    await this.videoRepo.save(dto);
    return ResultData.ok();
  }

  async updateVideo(dto: UpdateVideoDto) {
    const { id, ...data } = dto;
    await this.videoRepo.update(id, data);
    return ResultData.ok();
  }

  async removeVideo(ids: string) {
    await this.videoRepo.delete(ids.split(',').map(Number));
    return ResultData.ok();
  }

  // ====== 学员管理 ======
  async findStudents(query: ListStudentDto) {
    const qb = this.ucRepo.createQueryBuilder('uc');
    if (query.courseId) qb.andWhere('uc.courseId = :cid', { cid: query.courseId });
    if (query.status) qb.andWhere('uc.status = :s', { s: query.status });
    qb.orderBy('uc.paidAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  // ====== 小程序端 ======
  async getAppCourses(query: { tier?: string; pageNum?: number; pageSize?: number }) {
    const qb = this.courseRepo.createQueryBuilder('c').where('c.isActive = 1');
    if (query.tier) qb.andWhere('c.tier = :t', { t: query.tier });
    qb.orderBy('c.sortOrder', 'ASC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  async getAppCourseDetail(id: number) {
    const data = await this.courseRepo.findOne({ where: { id, isActive: 1 } });
    if (!data) return ResultData.fail(500, '课程不存在或已下架');
    const videos = await this.videoRepo.find({ where: { courseId: id }, order: { sortOrder: 'ASC' } });
    return ResultData.ok({ ...data, videos });
  }

  async purchaseCourse(userId: number, courseId: number) {
    const exists = await this.ucRepo.findOne({ where: { userId, courseId } });
    if (exists) return ResultData.fail(500, '已购买该课程');
    await this.ucRepo.save({ userId, courseId, status: 'active', paidAt: new Date() });
    return ResultData.ok();
  }

  async getMyCourses(userId: number) {
    const list = await this.ucRepo.find({ where: { userId }, order: { paidAt: 'DESC' } });
    return ResultData.ok(list);
  }
}
