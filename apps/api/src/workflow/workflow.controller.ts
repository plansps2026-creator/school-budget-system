import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { WorkflowService } from './workflow.service';
@UseGuards(AuthGuard('jwt'))
@Controller('workflow')
export class WorkflowController{constructor(private s:WorkflowService){}@Post()start(@CurrentUser()u:any,@Body()d:any){return this.s.start(u,d)}@Post(':id/actions')act(@CurrentUser()u:any,@Param('id')id:string,@Body()d:any){return this.s.act(u,id,d)}@Get(':id')get(@CurrentUser()u:any,@Param('id')id:string){return this.s.get(u,id)}}
