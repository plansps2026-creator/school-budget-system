import { Controller, Get } from '@nestjs/common'; @Controller('health') export class HealthController { @Get() health(){ return {ok:true,service:'school-budget-api',version:'0.2.0'}; } }
