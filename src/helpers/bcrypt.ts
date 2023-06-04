import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash.toString()
}