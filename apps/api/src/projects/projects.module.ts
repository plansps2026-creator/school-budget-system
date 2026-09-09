import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { SchoolScopeService } from '../common/services/school-scope.service';
import { WorkflowModule } from '../workflow/workflow.module';
@Module({imports:[WorkflowModule],controllers:[ProjectsController],providers:[ProjectsService,SchoolScopeService],exports:[ProjectsService]})
export class ProjectsModule{}
