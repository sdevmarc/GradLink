import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
        try {
            const isuser = await this.UserModel.findById(id)
            if (!isuser) return { success: false, message: 'User does not exist.' }
            return { success: true, message: 'User role retrieved successfully.', role: isuser.role }
        } catch (error) {
            throw new HttpException({ success: false, message: 'User role failed to retrieved.' }, HttpStatus.BAD_REQUEST)
        }
    }

    async findAll()
        : Promise<IPromiseUser> {
        try {
            const response = await this.UserModel.find()
            return { success: true, message: 'Users retrieved successfully.', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Users failed to retrieved.' }, HttpStatus.BAD_REQUEST)
        }
    }

    async findOne({ email }: IUsers)
        : Promise<IPromiseUser> {
        try {
            const response = await this.UserModel.findOne({ email })
            return { success: true, message: 'User retrieved successfully.', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'User email failed to retrieved.' }, HttpStatus.BAD_REQUEST)
        }
    }

    async InsertFirstUser({ email, password }: IUsers)
        : Promise<IPromiseUser> {
        try {
            const isemail = await this.UserModel.findOne({ email })
            if (isemail) return { success: false, message: 'User email already exists.' }

            let role: string
            const hasusers = await this.UserModel.find()
            hasusers.length <= 0 ? role = 'admin' : role = 'user'

            const salt = await bcrypt.genSalt();
            const hashedpassword = await bcrypt.hash(password, salt);

            await this.UserModel.create({ email, password: hashedpassword, role })
            return { success: true, message: 'User successfully created.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'User failed to create.' }, HttpStatus.BAD_REQUEST)
        }
    }

    async InsertUser({ email, password, role }: IUsers)
        : Promise<IPromiseUser> {
        try {
            const isemail = await this.UserModel.findOne({ email })
            if (isemail) return { success: false, message: 'User email already exists.' }

            const salt = await bcrypt.genSalt();
            const hashedpassword = await bcrypt.hash(password, salt);

            await this.UserModel.create({ email, password: hashedpassword, role })
            return { success: true, message: 'User successfully created.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'User failed to create.' }, HttpStatus.BAD_REQUEST)
        }
    }

    async ReadLoginUser({ email, password }: IUsers)
        : Promise<IPromiseUser> {
        try {
            const isemail = await this.UserModel.findOne({ email })

            if (!isemail) return { success: false, message: 'User email does not exist.' }
            const ispassword = await bcrypt.compare(password, isemail.password);

            if (!ispassword) return { success: false, message: 'Password is incorrect.' }
            return { success: true, message: 'Logged in successful.', }
        } catch (error) {
            throw new HttpException({ success: false, message: 'User failed to login.' }, HttpStatus.BAD_REQUEST)
        }
    }
}