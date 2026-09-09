import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { PROJECT_WRITE_ROLES } from '../common/domain/permissions';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, WorkflowCommentDto } from './dto';
import { WorkflowService } from '../workflow/workflow.service';
@UseGuards(AuthGuard('jwt'),RolesGuard)
@Controller('projects')
export class ProjectsController{
 constructor(private s:ProjectsService,private workflow:WorkflowService){}
 @Get()list(@CurrentUser()u:any){return this.s.list(u)}
 @Post()@Roles(...PROJECT_WRITE_ROLES)create(@CurrentUser()u:any,@Body()d:CreateProjectDto){return this.s.create(u,d)}
 @Get(':id')get(@CurrentUser()u:any,@Param('id')id:string){return this.s.get(u,id)}
 @Patch(':id')@Roles(...PROJECT_WRITE_ROLES)update(@CurrentUser()u:any,@Param('id')id:string,@Body()d:UpdateProjectDto){return this.s.update(u,id,d)}
 @Post(':id/submit')@Roles(...PROJECT_WRITE_ROLES)submit(@CurrentUser()u:any,@Param('id')id:string,@Body()d:WorkflowCommentDto){return this.workflow.start(u,{entityType:'Project',entityId:id,comment:d.comment})}
 @Post(':id/approve')@Roles('SUPER_ADMIN','PLANNING_OFFICER','SCHOOL_ADMIN','ORG_ADMIN','DIRECTOR')approve(@CurrentUser()u:any,@Param('id')id:string,@Body()d:WorkflowCommentDto){return this.workflow.actionForProject(u,id,'APPROVE',d.comment)}
 @Post(':id/reject')@Roles('SUPER_ADMIN','PLANNING_OFFICER','SCHOOL_ADMIN','ORG_ADMIN','DIRECTOR')reject(@CurrentUser()u:any,@Param('id')id:string,@Body()d:WorkflowCommentDto){return this.workflow.actionForProject(u,id,'REJECT',d.comment)}
 @Post(':id/return')@Roles('SUPER_ADMIN','PLANNING_OFFICER','SCHOOL_ADMIN','ORG_ADMIN','DIRECTOR')return(@CurrentUser()u:any,@Param('id')id:string,@Body()d:WorkflowCommentDto){return this.workflow.actionForProject(u,id,'RETURN',d.comment)}
}
