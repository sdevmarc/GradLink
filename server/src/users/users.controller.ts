import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUsers } from './users.interface';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Post('create-user')
    async CreateUser(
        @Body() { email, password }: IUsers
    ) {
        return await this.usersService.InsertUser({ email, password })
    }

    @Post('login-user')
    async LoginUser(
        @Body() { email, password }: IUsers
    ) {
        return await this.usersService.ReadLoginUser({ email, password })
    }
}
