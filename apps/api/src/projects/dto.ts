import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
export class CreateProjectDto{@IsOptional()@IsString()schoolId?:string;@IsString()fiscalYearId!:string;@IsString()code!:string;@IsString()name!:string;@IsOptional()@IsNumber({maxDecimalPlaces:2})@Min(0)approvedBudget?:number}
export class UpdateProjectDto{@IsOptional()@IsString()code?:string;@IsOptional()@IsString()name?:string;@IsOptional()@IsNumber({maxDecimalPlaces:2})@Min(0)approvedBudget?:number}
export class WorkflowCommentDto{@IsOptional()@IsString()comment?:string}
