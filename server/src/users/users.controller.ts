import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUsers } from './users.interface';
import { Response } from 'express';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Get()
    async FindAllUsers() {
        return this.usersService.findAll()
    }

    // @Get(':email')
    // async FindOneUser(
    //     @Param() { email }: IUsers
    // ) {
    //     return this.usersService.findOne({ email })
    // }

    // @Post('create-first-user')
    // async CreateFirstUser(
    //     @Body() { email, password }: IUsers
    // ) {
    //     return await this.usersService.InsertFirstUser({ email, password })
    // }

    // @Post('create-user')
    // async CreateUser(
    //     @Body() { email, password, role }: IUsers
    // ) {
    //     return await this.usersService.InsertFirstUser({ email, password, role })
    // }

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
