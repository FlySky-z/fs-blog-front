import bcrypt from 'bcryptjs';

/**
 * 对密码进行哈希处理
 * @param password 原始密码
 * @returns 哈希后的密码
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

/**
 * 验证密码是否匹配
 * @param password 原始密码
 * @param hashedPassword 哈希后的密码
 * @returns 是否匹配
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
