import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultData } from 'src/common/utils/result';
import { MealPlanEntity } from './entities/meal-plan.entity';
import { MealIngredientEntity } from './entities/meal-ingredient.entity';
import { QuizRecordEntity } from './entities/quiz-record.entity';
import { MealOrderEntity } from './entities/meal-order.entity';
import { ListMealPlanDto, CreateMealPlanDto, UpdateMealPlanDto, ListQuizRecordDto, ListMealOrderDto, SubmitQuizDto, CreateMealOrderDto } from './dto/index';

@Injectable()
export class MealService {
  constructor(
    @InjectRepository(MealPlanEntity) private readonly planRepo: Repository<MealPlanEntity>,
    @InjectRepository(MealIngredientEntity) private readonly ingredientRepo: Repository<MealIngredientEntity>,
    @InjectRepository(QuizRecordEntity) private readonly quizRepo: Repository<QuizRecordEntity>,
    @InjectRepository(MealOrderEntity) private readonly orderRepo: Repository<MealOrderEntity>,
  ) {}

  // ====== 配餐方案管理 ======
  async findPlans(query: ListMealPlanDto) {
    const qb = this.planRepo.createQueryBuilder('p');
    if (query.petType) qb.andWhere('p.petType = :pt', { pt: query.petType });
    if (query.tag) qb.andWhere('p.tag = :tag', { tag: query.tag });
    if (query.isActive !== undefined && query.isActive !== null) qb.andWhere('p.isActive = :a', { a: query.isActive });
    if (query.keyword) qb.andWhere('p.name LIKE :kw', { kw: `%${query.keyword}%` });
    qb.orderBy('p.sortOrder', 'ASC').addOrderBy('p.id', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  async findPlanDetail(id: number) {
    const plan = await this.planRepo.findOne({ where: { id } });
    const ingredients = await this.ingredientRepo.find({ where: { planId: id }, order: { sortOrder: 'ASC' } });
    return ResultData.ok({ ...plan, ingredientList: ingredients });
  }

  async createPlan(dto: CreateMealPlanDto) {
    const plan = await this.planRepo.save(dto);
    return ResultData.ok(plan);
  }

  async updatePlan(dto: UpdateMealPlanDto) {
    const { id, ...data } = dto;
    await this.planRepo.update(id, data);
    return ResultData.ok();
  }

  async removePlan(ids: string) {
    await this.planRepo.delete(ids.split(',').map(Number));
    return ResultData.ok();
  }

  // ====== 食材管理 ======
  async findIngredients(planId: number) {
    const list = await this.ingredientRepo.find({ where: { planId }, order: { sortOrder: 'ASC' } });
    return ResultData.ok(list);
  }

  async saveIngredients(planId: number, items: { name: string; weight?: string; sortOrder?: number }[]) {
    await this.ingredientRepo.delete({ planId });
    if (items && items.length) {
      const entities = items.map((item, idx) => ({ planId, name: item.name, weight: item.weight, sortOrder: item.sortOrder ?? idx }));
      await this.ingredientRepo.save(entities);
    }
    return ResultData.ok();
  }

  // ====== 答题记录 ======
  async findQuizRecords(query: ListQuizRecordDto) {
    const qb = this.quizRepo.createQueryBuilder('q');
    if (query.userId) qb.andWhere('q.userId = :uid', { uid: query.userId });
    if (query.petType) qb.andWhere('q.petType = :pt', { pt: query.petType });
    if (query.constitutionType) qb.andWhere('q.constitutionType = :ct', { ct: query.constitutionType });
    qb.orderBy('q.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  // ====== 配餐订单 ======
  async findOrders(query: ListMealOrderDto) {
    const qb = this.orderRepo.createQueryBuilder('o');
    if (query.userId) qb.andWhere('o.userId = :uid', { uid: query.userId });
    if (query.planId) qb.andWhere('o.planId = :pid', { pid: query.planId });
    if (query.status) qb.andWhere('o.status = :s', { s: query.status });
    qb.orderBy('o.createdAt', 'DESC');
    if (query.pageSize && query.pageNum) qb.skip(+query.pageSize * (+query.pageNum - 1)).take(+query.pageSize);
    const [list, total] = await qb.getManyAndCount();
    return ResultData.ok({ list, total });
  }

  async findOrderDetail(id: number) {
    const order = await this.orderRepo.findOne({ where: { id } });
    const plan = order ? await this.planRepo.findOne({ where: { id: order.planId } }) : null;
    return ResultData.ok({ ...order, plan });
  }

  // ====== 小程序端 ======
  async submitQuiz(userId: number, dto: SubmitQuizDto) {
    const record = await this.quizRepo.save({ userId, ...dto });
    return ResultData.ok(record);
  }

  async getMyQuizRecords(userId: number) {
    const list = await this.quizRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    return ResultData.ok(list);
  }

  async getAppPlans(petType?: string) {
    const qb = this.planRepo.createQueryBuilder('p').where('p.isActive = 1');
    if (petType) qb.andWhere('p.petType = :pt', { pt: petType });
    qb.orderBy('p.sortOrder', 'ASC');
    const list = await qb.getMany();
    // 加载食材
    for (const plan of list) {
      const ingredients = await this.ingredientRepo.find({ where: { planId: plan.id }, order: { sortOrder: 'ASC' } });
      (plan as any).ingredientList = ingredients;
    }
    return ResultData.ok(list);
  }

  async createMealOrder(userId: number, dto: CreateMealOrderDto) {
    const plan = await this.planRepo.findOne({ where: { id: dto.planId, isActive: 1 } });
    if (!plan) return ResultData.fail(500, '配餐方案不存在或已下架');
    const mealFreq = dto.mealFreq || 2;
    const mealDays = dto.mealDays || 30;
    if (mealDays <= 0) return ResultData.fail(500, '配餐天数必须大于 0');
    // 用分计算避免浮点误差
    const totalPrice = Math.round(Number(plan.monthlyPrice) * 100) * mealDays / 30 / 100;
    const orderNo = 'ML' + Date.now() + Math.random().toString(36).substring(2, 6).toUpperCase();
    const order = await this.orderRepo.save({ orderNo, userId, planId: dto.planId, quizId: dto.quizId, mealFreq, mealDays, totalPrice: Math.round(totalPrice * 100) / 100, status: 'pending' });
    return ResultData.ok(order);
  }

  async getMyMealOrders(userId: number) {
    const list = await this.orderRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    return ResultData.ok(list);
  }
}
