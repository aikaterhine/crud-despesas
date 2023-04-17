import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../entities/user.entity";

export const toUserDto = (data: User): CreateUserDto => {  
    const { id, email, name } = data;
    let userDto: CreateUserDto = { id, email, name };
    return userDto;
};