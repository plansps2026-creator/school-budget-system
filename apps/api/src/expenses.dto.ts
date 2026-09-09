import { IsISO8601, IsNumber, IsOptional, IsString, Min } from 'class-validator';
export class CreateExpenseDto{@IsString()activityId!:string;@IsString()budgetPocketId!:string;@IsNumber({maxDecimalPlaces:2})@Min(0.01)amount!:number;@IsString()description!:string;@IsISO8601()expenseDate!:string}
export class UpdateExpenseDto{@IsOptional()@IsNumber({maxDecimalPlaces:2})@Min(0.01)amount?:number;@IsOptional()@IsString()description?:string;@IsOptional()@IsISO8601()expenseDate?:string}
