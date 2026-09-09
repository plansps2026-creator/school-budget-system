import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { ACTIVITY_WRITE_ROLES, REPORT_WRITE_ROLES } from '../common/domain/permissions';
import { ActivitiesService } from './activities.service';
import { CreateActivityBudgetDto, CreateActivityDto, CreateActivityReportDto, UpdateActivityDto } from './dto';
@UseGuards(AuthGuard('jwt'),RolesGuard)
@Controller('activities')
export class ActivitiesController{
 constructor(private s:ActivitiesService){}
 @Get()list(@CurrentUser()u:any,@Query('projectId')projectId?:string){return this.s.list(u,projectId)}
 @Post()@Roles(...ACTIVITY_WRITE_ROLES)create(@CurrentUser()u:any,@Body()d:CreateActivityDto){return this.s.create(u,d)}
 @Get(':id')get(@CurrentUser()u:any,@Param('id')id:string){return this.s.get(u,id)}
 @Patch(':id')@Roles(...ACTIVITY_WRITE_ROLES)update(@CurrentUser()u:any,@Param('id')id:string,@Body()d:UpdateActivityDto){return this.s.update(u,id,d)}
 @Post(':id/budgets')@Roles(...ACTIVITY_WRITE_ROLES)addBudget(@CurrentUser()u:any,@Param('id')id:string,@Body()d:CreateActivityBudgetDto){return this.s.addBudget(u,id,d)}
 @Post(':id/reports')@Roles(...REPORT_WRITE_ROLES)report(@CurrentUser()u:any,@Param('id')id:string,@Body()d:CreateActivityReportDto){return this.s.report(u,id,d)}
}
