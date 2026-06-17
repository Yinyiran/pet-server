import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { CourseEntity } from './entities/course.entity';
import { CourseVideoEntity } from './entities/course-video.entity';
import { UserCourseEntity } from './entities/user-course.entity';
import { PetUserEntity } from '../user/entities/user.entity';
import { CommissionService } from '../commission/commission.service';
import { CreateCourseDto, UpdateCourseDto, ListCourseDto, CreateVideoDto, UpdateVideoDto, ListStudentDto } from './dto/index';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity) private readonly courseRepo: Repository<CourseEntity>,
    @InjectRepository(CourseVideoEntity) private readonly videoRepo: Repository<CourseVideoEntity>,
    @InjectRepository(UserCourseEntity) private readonly ucRepo: Repository<UserCourseEntity>,
    @InjectRepository(PetUserEntity) private readonly userRepo: Repository<PetUserEntity>,
    private readonly commissionService: CommissionService,
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

    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) return ResultData.fail(500, '课程不存在');

    // 设置课程到期时间（365天）
    const expireAt = new Date();
    expireAt.setFullYear(expireAt.getFullYear() + 1);

    await this.ucRepo.save({ userId, courseId, status: 'active', paidAt: new Date(), expireAt });

    // 根据课程 tier 触发分佣资格
    // pro(梵优合伙人 2999) → 9%佣金, partner(梵优主理人 5999) → 15%佣金
    if (course.tier === 'pro' || course.tier === 'partner') {
      // 查找对应的分佣等级（按 name 匹配）
      const tierName = course.tier === 'pro' ? '梵优合伙人' : '梵优主理人';
      const tiers = await this.commissionService.findTiers();
      const tierData = tiers.data?.find((t: any) => t.name === tierName);

      // 设置用户等级
      const levelName = course.tier === 'pro' ? '梵优合伙人' : '梵优主理人';
      await this.userRepo.update(userId, { level: levelName });

      // 创建/更新分佣账户
      if (tierData) {
        await this.commissionService.ensureCommissionAccount(userId, tierData.id);
      }
    }

    return ResultData.ok();
  }

  async getMyCourses(userId: number) {
    const list = await this.ucRepo.find({ where: { userId }, order: { paidAt: 'DESC' } });
    return ResultData.ok(list);
  }
}
