import { User } from "../entities/user.entity";

export const toUserDto = (data: User) => {  
    const { email, name } = data;
    let userDto = { email, name };
    return userDto;
};