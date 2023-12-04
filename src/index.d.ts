declare module "authenticator-sender" {
    export function generateSecretKey(): string;
    export function createQrCode(email: string, secretKey: string, companyName: string): Promise<string>;
    export function validateCode(userProvidedCode: string, secretKey: string): boolean;
  }
  