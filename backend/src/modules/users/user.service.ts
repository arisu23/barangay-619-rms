import bcrypt from "bcrypt";
import { UserRepository } from "./user.repository.js";

const SALT_ROUNDS = 10;

export const UserService = {
    async createUser(username: string, password: string, role: "Admin" | "Staff") {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        return UserRepository.create(username, hashedPassword, role);
    },

    async validateUser(username: string, password: string) {
        const user = await UserRepository.findByUsername(username);
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) return null;

        return user;
    }
};