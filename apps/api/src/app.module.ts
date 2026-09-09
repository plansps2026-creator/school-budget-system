import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BudgetModule } from './budget/budget.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health.controller';
import { ProjectsModule } from './projects/projects.module';
import { ActivitiesModule } from './activities/activities.module';
import { WorkflowModule } from './workflow/workflow.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({ imports:[PrismaModule,AuthModule,BudgetModule,ProjectsModule,ActivitiesModule,WorkflowModule,ExpensesModule], controllers:[HealthController] })
export class AppModule {}
