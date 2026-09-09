import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MasterService } from './master.service';
@UseGuards(AuthGuard('jwt')) @Controller('master')
export class MasterController{constructor(private service:MasterService){}@Get('organization')organization(@CurrentUser()u:any){return this.service.organization(u)}@Get('schools')schools(@CurrentUser()u:any){return this.service.schools(u)}@Get('fiscal-years')fiscal(@CurrentUser()u:any){return this.service.fiscalYears(u)}@Get('academic-years')academic(@CurrentUser()u:any){return this.service.academicYears(u)}@Get('users')users(@CurrentUser()u:any){return this.service.users(u)}}
