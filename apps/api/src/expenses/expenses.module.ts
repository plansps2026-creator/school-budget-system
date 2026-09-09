import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { SchoolScopeService } from '../common/services/school-scope.service';
@Module({controllers:[ExpensesController],providers:[ExpensesService,SchoolScopeService]})
export class ExpensesModule{}
