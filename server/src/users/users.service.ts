import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUsers, IPromiseUser } from './users.interface';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private readonly UserModel: Model<IUsers>,
        private jwtService: JwtService
    ) { }

    async GetRole({ id }: IUsers)
        : Promise<IPromiseUser> {
        try {
            const isuser = await this.UserModel.findById(id)
            if (!isuser) return { success: false, message: 'User does not exist.' }

            return { success: true, message: 'User role retrieved successfully.', role: isuser.role }
        } catch (error) {
            throw new HttpException({ success: false, message: 'User role failed to retrieved.' }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findAll()
        : Promise<IPromiseUser> {
        try {
            const response = await this.UserModel.find().sort({ _id: -1 })
            return { success: true, message: 'Users retrieved successfully.', data: response }
        } catch (error) {
            throw new HttpException({ success: false, message: 'Users failed to retrieved.' }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async findOne({ id }: { id: string }): Promise<IPromiseUser> {
        try {
            const response = await this.UserModel.findById(id)
            if (!response) return { success: false, message: 'User do not exists.' }

            const { _id, name, email, role, isactive } = response

            return { success: true, message: 'User retrieved successfully.', data: { _id, name, email, role, isactive } }
        } catch (error) {
            throw new HttpException({ success: false, message: 'User failed to retrieved.' }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async checkPassword({ id, password }: { id: string, password: string }): Promise<IPromiseUser> {
        try {
            const isuser = await this.UserModel.findById(id)
            if (!isuser) return { success: false, message: 'User do not exists.' }

            if (!password) return { success: false, message: 'Password is missing.' }

            const ispassword = await bcrypt.compare(password, isuser.password);
            if (!ispassword) return { success: false, message: 'Password do not match.' }

            return { success: true, message: 'Password match.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'User failed to retrieved.' }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    // async findOne({ email }: IUsers)
    //     : Promise<IPromiseUser> {
    //     try {
    //         const response = await this.UserModel.findOne({ email })
    //         return { success: true, message: 'User retrieved successfully.', data: response }
    //     } catch (error) {
    //         throw new HttpException({ success: false, message: 'User email failed to retrieved.' }, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

    async InsertUser({ name, email, role }: IUsers)
        : Promise<IPromiseUser> {
        try {
            const isemail = await this.UserModel.findOne({ email })
            if (isemail) return { success: false, message: 'Email already exists.' }

            const salt = await bcrypt.genSalt();
            const hashedpassword = await bcrypt.hash(email, salt);

            await this.UserModel.create({ name, email, password: hashedpassword, role })
            return { success: true, message: 'User successfully created.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'User failed to create.' }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateUser({ id, name, email, role }: IUsers): Promise<IPromiseUser> {
        try {
            const isemail = await this.UserModel.findOne({ email })
            if (isemail) return { success: false, message: 'Email already exists.' }

            await this.UserModel.findByIdAndUpdate(
                id,
                {
                    name,
                    email,
                    role
                },
                { new: true }
            )
            return { success: true, message: 'User updated successfully.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'User failed to update.' }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateInformationUser({ id, name, email }: IUsers): Promise<IPromiseUser> {
        try {
            const isemail = await this.UserModel.findOne({ email })
            if (isemail) return { success: false, message: 'Email already exists.' }

            if (name) {
                await this.UserModel.findByIdAndUpdate(
                    id,
                    {
                        name
                    },
                    { new: true }
                )
            }

            if (email) {
                await this.UserModel.findByIdAndUpdate(
                    id,
                    {
                        email
                    },
                    { new: true }
                )
            }

            return { success: true, message: 'User updated successfully.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'User failed to update.' }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateUserStatus({ id, isactive }: IUsers): Promise<IPromiseUser> {
        try {
            if (!id) return { success: false, message: 'Missing ID, please provide an ID.' }

            await this.UserModel.findByIdAndUpdate(
                id,
                {
                    isactive
                },
                { new: true }
            )
            return { success: true, message: `User updated to ${!isactive ? 'Inactive' : 'Active'} successfully.` }
        } catch (error) {
            throw new HttpException({ success: false, message: 'User failed to update.' }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updatePassword({ id, password }: IUsers): Promise<IPromiseUser> {
        try {
            if (!id) return { success: false, message: 'Missing ID, please provide an ID.' }

            const salt = await bcrypt.genSalt();
            const hashedpassword = await bcrypt.hash(password, salt);

            await this.UserModel.findByIdAndUpdate(
                id,
                {
                    password: hashedpassword
                },
                { new: true }
            )
            return { success: true, message: 'User password updated successfully.' }
        } catch (error) {
            throw new HttpException({ success: false, message: 'User failed to update.' }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async ReadLoginUser({ email, password }: IUsers)
        : Promise<IPromiseUser> {
        try {
            const hasusers = await this.UserModel.find()

            if (hasusers.length === 0) {
                const salt = await bcrypt.genSalt();
                const hashedpassword = await bcrypt.hash('admin', salt);
                await this.UserModel.create({ role: 'root', password: hashedpassword })
            }

            const isemail = await this.UserModel.findOne({ email })

            if (!isemail) return { success: false, message: 'User email does not exist.' }

            const isactive = await this.UserModel.findOne({
                $and: [
                    { email },
                    { isactive: true }
                ]
            })

            if (!isactive) return { success: false, message: 'User is not permitted to login.' }

            const ispassword = await bcrypt.compare(password, isemail.password);

            if (!ispassword) return { success: false, message: 'Password is incorrect.' }

            const payload = { sub: isemail._id }
            const access_token = await this.jwtService.signAsync(payload)

            return { success: true, message: 'Logged in successful.', access_token }
        } catch (error) {
            throw new HttpException({ success: false, message: 'User failed to login.', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
