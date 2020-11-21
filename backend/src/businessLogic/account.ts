import { comparePasswords, generatePassword } from "../auth/utils";
import { UserDataAccess } from "../dataAccess/userAccess";
import { User } from "../models/User";
import { LoginRequest } from "../requests/auth/LoginRequest";
import { RegisterRequest } from "../requests/auth/RegisterRequest";

const uuid = require('uuid');
const userAccess = new UserDataAccess();

export async function login(loginRequest: LoginRequest): Promise<User> {
    const user = await userAccess.getUserByEmail(loginRequest.email);
    if (user) {
        const authValid = await comparePasswords(loginRequest.password, user.passwordHash);
        if (authValid) {
            return user;
        }
    }

    return undefined;
}

export async function register(registerRequest: RegisterRequest): Promise<User> {
    const userId = uuid.v4();
    const passwordHash = await generatePassword(registerRequest.password);
    const user: User = {
        userId: userId,
        name: registerRequest.name,
        email: registerRequest.email,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString(),
    };

    return await userAccess.createUser(user);
}

export async function getUserById(userId: string): Promise<User> {
    return await userAccess.getUserById(userId);
}

export async function getUserByEmail(email: string): Promise<User> {
    return await userAccess.getUserByEmail(email);
}