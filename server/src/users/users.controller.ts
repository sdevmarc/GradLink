import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUsers } from './users.interface';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService
    ) { }

    @Get()
    async FindAllUsers() {
        return this.usersService.findAll()
    }

    @Get('get-user')
    async findOneUser(@Req() request: Request) {
        const token = request.cookies['access_token'];
        if (!token) return { isAuthenticated: false }

        try {
            const payload = this.jwtService.verify(token);
            const userid = payload.sub
            const response = await this.usersService.findOne({ id: userid })

            if (!response.success) return response.message

            return { success: true, message: 'User retrieved successfully.', data: response.data };
        } catch (error) {
            return { isAuthenticated: false };
        }
    }

    @Post('login-user')
    async LoginUser(
        @Body() { email, password }: IUsers,
        @Res({ passthrough: true }) response: Response,
    ) {
        const islogin = await this.usersService.ReadLoginUser({ email, password })
        if (islogin.success) {
            // Set the access_token as an HTTP-only cookie
            response.cookie('access_token', islogin.access_token, {
                httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
                secure: false,   // Ensures the cookie is sent over HTTPS
                sameSite: 'lax', // CSRF protection
                maxAge: 3600000, // Cookie expiration time in milliseconds (e.g., 1 hour)
            });

            // Optionally, remove the access_token from the response body
            delete islogin.access_token;
        }

        return islogin;
    }

    @Post('logout')
    async logout(@Res() response: Response) {

        response.cookie('access_token', '', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(0), // Expire the cookie immediately
        });

        return response.status(200).json({ success: true, message: 'Logged out successfully.' });
    }
}
