import { Module } from '@nestjs/common';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { SchoolScopeService } from '../common/services/school-scope.service';
@Module({controllers:[WorkflowController],providers:[WorkflowService,SchoolScopeService],exports:[WorkflowService]})
export class WorkflowModule{}
