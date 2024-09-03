import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUsers, IPromiseUser } from './users.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private readonly UserModel: Model<IUsers>
    ) { }

    async GetRole({ id }: IUsers)
        : Promise<IPromiseUser> {
        const isuser = await this.UserModel.findById(id)
        if (!isuser) return { success: false, message: 'User does not exist.' }
        return { success: true, message: 'User role retrieved successfully.', role: isuser.role }
    }

    async findAll()
        : Promise<IPromiseUser> {
        const response = await this.UserModel.find()
        return { success: true, message: 'Users retrieved successfully.', data: response }
    }

    async findOne({ email }: IUsers)
        : Promise<IPromiseUser> {
        const response = await this.UserModel.findOne({ email })
        return { success: true, message: 'User retrieved successfully.', data: response }
    }

    async InsertUser({ email, password }: IUsers) {
        const salt = await bcrypt.genSalt();
        const hashedpassword = await bcrypt.hash(password, salt);

        await this.UserModel.create({ email, password: hashedpassword })
    }

    async ReadLoginUser({ email, password }: IUsers)
        : Promise<IPromiseUser> {
        const isemail = await this.UserModel.findOne({ email })

        if (!isemail) return { success: false, message: 'User does not exist.' }

        const ispassword = await bcrypt.compare(password, isemail.password);
        if (ispassword) return { success: true, message: 'Logged in successful.' }
    }
}
