import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { BudgetService } from './budget.service';
import { CreateBudgetPocketDto, CreateBudgetPoolDto, CreateBudgetSourceDto, PostBudgetTransactionDto } from './dto';
@UseGuards(AuthGuard('jwt'),RolesGuard)
@Controller('budgets')
export class BudgetController{
 constructor(private service:BudgetService){}
 @Get('sources')sources(@CurrentUser()u:any){return this.service.sources(u)}
 @Post('sources')@Roles('SUPER_ADMIN','ORG_ADMIN')createSource(@CurrentUser()u:any,@Body()d:CreateBudgetSourceDto){return this.service.createSource(u,d)}
 @Get('pools')pools(@CurrentUser()u:any){return this.service.pools(u)}
 @Post('pools')@Roles('SUPER_ADMIN','ORG_ADMIN','SCHOOL_ADMIN','FINANCE_OFFICER')createPool(@CurrentUser()u:any,@Body()d:CreateBudgetPoolDto){return this.service.createPool(u,d)}
 @Post('pockets')@Roles('SUPER_ADMIN','ORG_ADMIN','SCHOOL_ADMIN','FINANCE_OFFICER')createPocket(@CurrentUser()u:any,@Body()d:CreateBudgetPocketDto){return this.service.createPocket(u,d)}
 @Get('pockets/:id/balance')balance(@CurrentUser()u:any,@Param('id')id:string){return this.service.balance(u,id)}
 @Post('transactions')@Roles('SUPER_ADMIN','ORG_ADMIN','SCHOOL_ADMIN','FINANCE_OFFICER')post(@CurrentUser()u:any,@Body()d:PostBudgetTransactionDto){return this.service.post(u,d)}
}
