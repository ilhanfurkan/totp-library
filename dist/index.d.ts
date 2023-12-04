declare function generateSecretKey(): string;
declare function createQrCode(email: string, secretKey: string, companyName: string): Promise<string>;
declare function validateCode(userProvidedCode: string, secretKey: string): boolean;
export { generateSecretKey, createQrCode, validateCode };
