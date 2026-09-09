import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
export class CreateActivityDto{@IsString()projectId!:string;@IsString()name!:string;@IsOptional()@IsNumber({maxDecimalPlaces:2})@Min(0)allocatedBudget?:number}
export class UpdateActivityDto{@IsOptional()@IsString()name?:string;@IsOptional()@IsNumber({maxDecimalPlaces:2})@Min(0)allocatedBudget?:number}
export class CreateActivityBudgetDto{@IsString()budgetPocketId!:string;@IsNumber({maxDecimalPlaces:2})@Min(0.01)amount!:number}
export class CreateActivityReportDto{@IsNumber()@Min(0)progressPercent!:number;@IsOptional()@IsString()summary?:string}
