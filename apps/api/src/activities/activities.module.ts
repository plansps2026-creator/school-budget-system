import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { SchoolScopeService } from '../common/services/school-scope.service';
@Module({controllers:[ActivitiesController],providers:[ActivitiesService,SchoolScopeService]})
export class ActivitiesModule{}
