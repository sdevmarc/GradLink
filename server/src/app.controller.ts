import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private jwtService: JwtService
    ) { }

    @Get()
    getHello(): {} {
        return this.appService.getHello();
    }

    @Get('status')
    async getStatus(@Req() request: Request) {
        const token = request.cookies['access_token'];

        if (!token) {
            return { isAuthenticated: false };
        }

        try {
            const payload = this.jwtService.verify(token);
            return { isAuthenticated: true, user: payload };
        } catch (error) {
            return { isAuthenticated: false };
        }
    }
}
