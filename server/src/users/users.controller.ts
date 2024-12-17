import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUsers } from './users.interface';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/auth.guard';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcryptjs';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService
    ) { }

    @UseGuards(AuthGuard)
    @Get()
    async FindAllUsers() {
        return this.usersService.findAll()
    }

    @UseGuards(AuthGuard)
    @Get('get-user')
    async findOneUser(@Req() request: Request) {
        const token = request.cookies['access_token'];
        if (!token) return { isAuthenticated: false }

        try {
            const payload = await this.jwtService.verify(token);
            const userid = payload.sub
            const response = await this.usersService.findOne({ id: userid })

            if (!response.success) return response.message

            return { success: true, message: 'User retrieved successfully.', data: response.data };
        } catch (error) {
            return { isAuthenticated: false };
        }
    }

    @UseGuards(AuthGuard)
    @Get('check-default-password')
    async checkUserDefaultPassword(
        @Req() request: Request,
        @Res() response: Response
    ) {
        const token = request.cookies['access_token']
        if (!token) return response.json({ isAuthenticated: false })

        try {
            const payload = await this.jwtService.verify(token);
            const userid = payload.sub

            const asd = await this.usersService.checkDefaultPassword({ id: userid })
            return response.json(asd)
        } catch (error) {
            return response.json({ isAuthenticated: false, error })
        }
    }

    @UseGuards(AuthGuard)
    @Post('check-password')
    async checkPassword(@Body() { id, password }: { id: string, password: string }) {
        return this.usersService.checkPassword({ id, password })
    }

    @UseGuards(AuthGuard)
    @Post('change-default-password')
    async changeUserDefaultPassword(
        @Body() { password }: { password: string },
        @Req() request: Request,
        @Res() response: Response
    ) {
        const token = request.cookies['access_token']
        if (!token) return response.json({ isAuthenticated: false })

        try {
            const payload = await this.jwtService.verify(token);
            const userid = payload.sub

            return this.usersService.updatePassword({ id: userid, password })
        } catch (error) {
            return response.json({ isAuthenticated: false, error })
        }
    }

    @UseGuards(AuthGuard)
    @Post('change-password')
    async changePassword(@Body() { id, password }: { id: string, password: string }) {
        return this.usersService.updatePassword({ id, password })
    }

    @UseGuards(AuthGuard)
    @Post('change-forgot-password')
    async changeForgotPassword(@Body() { email, password }: { email: string, password: string }) {
        return this.usersService.updateForgotPassword({ email, password })
    }

    @Post('create')
    @UseGuards(AuthGuard)
    async createUser(@Body() { name, email, role }: IUsers) {
        return await this.usersService.InsertUser({ name, email, role })
    }

    @Post('update')
    @UseGuards(AuthGuard)
    async updateUser(@Body() { id, name, email, role, department }: IUsers) {
        return await this.usersService.updateUser({ id, name, email, role, department })
    }

    @Post('update-information')
    @UseGuards(AuthGuard)
    async updateInformationUser(@Body() { id, name, email }: IUsers) {
        return await this.usersService.updateInformationUser({ id, name, email })
    }

    @Post('update-status')
    @UseGuards(AuthGuard)
    async updateToInactiveUser(@Body() { id, isactive }: IUsers) {
        return await this.usersService.updateUserStatus({ id, isactive })
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
                domain: 'mlp-server.onrender.com', // Remove protocol (https://)
                sameSite: 'none',
                httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
                secure: false,   // Ensures the cookie is sent over HTTPS
                maxAge: 86400000, // Cookie expiration time in milliseconds (e.g., 1 day)
            });

            // Optionally, remove the access_token from the response body
            delete islogin.access_token;
        }

        return islogin;
    }

    @Post('otp')
    async SendOtp(
        @Body() { email }: IUsers,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const isemail = await this.usersService.isUserEmail({ email })
            if (!isemail.success) return isemail

            const isOtp = await this.mailService.sendOtpMail({ email })
            if (isOtp.success) {
                // Set the access_token as an HTTP-only cookie
                response.cookie('otp', isOtp.data, {
                    domain: 'mlp-server.onrender.com', // Remove protocol (https://)
                    sameSite: 'none',
                    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
                    secure: false,   // Ensures the cookie is sent over HTTPS
                    maxAge: 300000, // Cookie expiration time in milliseconds (e.g., 5 Minutes)
                });

                // Optionally, remove the access_token from the response body
                delete isOtp.data;
            }

            return isOtp;
        } catch (error) {
            return response.json({ success: false, message: 'Error sending one-time-password' })
        }

    }

    @Post('verify-otp')
    async verifyOtp(
        @Body() { otp }: IUsers,
        @Req() request: Request,
        @Res() response: Response
    ) {
        const token = request.cookies['otp']
        if (!token) return response.json({ isAuthenticated: false })

        try {
            const isOtp = await bcrypt.compare(otp.toString(), token);

            if (isOtp) {
                response.cookie('otp', '', {
                    domain: 'mlp-server.onrender.com', // Remove protocol (https://)
                    sameSite: 'none',
                    httpOnly: true,
                    secure: false,
                    expires: new Date(0), // Expire the cookie immediately
                })

                return response.json({ success: true, message: 'One-time-password matched!' })
            }
            response.json({ success: false, message: 'One-time-password do not match.' })
        } catch (error) {
            return response.json({ isAuthenticated: false, error })
        }
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Res() response: Response) {
        response.cookie('access_token', '', {
            httpOnly: true,
            secure: false,
            expires: new Date(0), // Expire the cookie immediately
        });

        return response.status(200).json({ success: true, message: 'Logged out successfully.' });
    }
}
