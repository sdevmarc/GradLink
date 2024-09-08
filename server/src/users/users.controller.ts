import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUsers } from './users.interface';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Get()
    async FindAllUsers() {
        return this.usersService.findAll()
    }

    @Get(':email')
    async FindOneUser(
        @Param() { email }: IUsers
    ) {
        return this.usersService.findOne({ email })
    }

    @Post('create-first-user')
    async CreateFirstUser(
        @Body() { email, password }: IUsers
    ) {
        return await this.usersService.InsertFirstUser({ email, password })
    }

    @Post('create-user')
    async CreateUser(
        @Body() { email, password, role }: IUsers
    ) {
        return await this.usersService.InsertFirstUser({ email, password, role })
    }

    @Post('login-user')
    async LoginUser(
        @Body() { email, password }: IUsers
    ) {
        return await this.usersService.ReadLoginUser({ email, password })
    }
}
