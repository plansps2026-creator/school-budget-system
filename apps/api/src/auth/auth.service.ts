import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(private prisma:PrismaService, private jwt:JwtService){}
  async login(email:string,password:string){
    const user=await this.prisma.user.findUnique({where:{email},include:{userRoles:{include:{role:true}},school:true,organization:true}});
    if(!user || !user.isActive || !(await compare(password,user.passwordHash))) throw new UnauthorizedException('Invalid credentials');
    const roles=user.userRoles.map(x=>x.role.code);
    const payload={sub:user.id,organizationId:user.organizationId,schoolId:user.schoolId,roles};
    return {accessToken:await this.jwt.signAsync(payload),user:{id:user.id,email:user.email,displayName:user.displayName,roles,school:user.school}};
  }
}
