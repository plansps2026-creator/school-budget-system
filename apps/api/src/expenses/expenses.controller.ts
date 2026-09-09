import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { EXPENSE_WRITE_ROLES } from '../common/domain/permissions';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto } from '../expenses.dto';
@UseGuards(AuthGuard('jwt'),RolesGuard)
@Controller('expenses')
export class ExpensesController{constructor(private s:ExpensesService){}@Get()list(@CurrentUser()u:any,@Query('activityId')activityId?:string){return this.s.list(u,activityId)}@Post()@Roles(...EXPENSE_WRITE_ROLES)create(@CurrentUser()u:any,@Body()d:CreateExpenseDto){return this.s.create(u,d)}@Get(':id')get(@CurrentUser()u:any,@Param('id')id:string){return this.s.get(u,id)}@Patch(':id')@Roles(...EXPENSE_WRITE_ROLES)update(@CurrentUser()u:any,@Param('id')id:string,@Body()d:UpdateExpenseDto){return this.s.update(u,id,d)}}
