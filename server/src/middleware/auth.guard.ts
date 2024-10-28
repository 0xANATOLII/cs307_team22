

import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";

import {JwtService} from "@nestjs/jwt";
import * as process from "process";


@Injectable()

export class AuthGuards implements CanActivate{
    constructor(private readonly jwtService:JwtService) {

    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
       const request = context.switchToHttp().getRequest()
        const token=this.extractToken(request)
        if(!token){
            throw new UnauthorizedException()
        }
        try{
            const payload= await this.jwtService.verifyAsync(token,{
                secret:process.env.JWT_SECRET
            })

            request['user']=payload

            return true
        }catch (e){
            throw new UnauthorizedException()
        }



    }

    private extractToken(request:Request):string|undefined{
        const [type,token] = request.headers['authorization']?.split(' ')??[]
        return type=='Bearer' ? token:undefined
    }

}