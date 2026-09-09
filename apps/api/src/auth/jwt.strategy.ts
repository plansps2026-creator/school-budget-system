import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
const secret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? (()=>{ throw new Error('JWT_SECRET is required in production') })() : 'dev-only-secret');
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(){super({jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),ignoreExpiration:false,secretOrKey:secret})}
  validate(payload:any){return{id:payload.sub,organizationId:payload.organizationId,schoolId:payload.schoolId,roles:payload.roles||[]}}
}
