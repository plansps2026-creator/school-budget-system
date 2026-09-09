import { ForbiddenException, Injectable } from '@nestjs/common';
@Injectable()
export class SchoolScopeService{
  assertSameSchool(user:any,schoolId:string){if(!user?.organizationId)throw new ForbiddenException('Organization scope is required');if(user.roles?.includes('SUPER_ADMIN'))return;if(!user.schoolId||user.schoolId!==schoolId)throw new ForbiddenException('Outside school scope')}
  schoolFilter(user:any){if(user.roles?.includes('SUPER_ADMIN'))return{};if(user.schoolId)return{schoolId:user.schoolId};return{school:{organizationId:user.organizationId}}}
}
