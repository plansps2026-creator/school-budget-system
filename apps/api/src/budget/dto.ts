import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
export enum BudgetTransactionTypeDto{OPENING='OPENING',ALLOCATION='ALLOCATION',TRANSFER_IN='TRANSFER_IN',TRANSFER_OUT='TRANSFER_OUT',COMMITMENT='COMMITMENT',EXPENSE='EXPENSE',ADJUSTMENT='ADJUSTMENT',REVERSAL='REVERSAL'}
export class CreateBudgetSourceDto{@IsString()code!:string;@IsString()name!:string;@IsOptional()@IsString()description?:string}
export class CreateBudgetPoolDto{@IsString()schoolId!:string;@IsString()fiscalYearId!:string;@IsString()budgetSourceId!:string;@IsString()name!:string}
export class CreateBudgetPocketDto{@IsString()budgetPoolId!:string;@IsString()code!:string;@IsString()name!:string}
export class PostBudgetTransactionDto{@IsString()budgetPocketId!:string;@IsEnum(BudgetTransactionTypeDto)type!:BudgetTransactionTypeDto;@IsNumber({maxDecimalPlaces:2})@Min(0.01)amount!:number;@IsOptional()@IsString()referenceType?:string;@IsOptional()@IsString()referenceId?:string;@IsOptional()@IsString()note?:string}
