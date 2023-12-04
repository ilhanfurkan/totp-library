import * as qr from "qrcode";
import * as crypto from "crypto";

function generateSecretKey(): string {
  const validChars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let secretBuilder: string = "";

  for (let i: number = 0; i < 32; i++) {
    const randomIndex: number = Math.floor(Math.random() * validChars.length);
    secretBuilder += validChars.charAt(randomIndex);
  }

  return secretBuilder;
}

async function createQrCode(
  email: string,
  secretKey: string,
  companyName: string
): Promise<string> {
  const barCodeData: string = prepareUri(email, secretKey, companyName);

  try {
    const qrCode: string = await qr.toDataURL(barCodeData);
    return qrCode;
  } catch (error) {
    console.error("Error creating QR code:", error);
    throw new Error("Error creating QR code");
  }
}

function prepareUri(
  email: string,
  secretKey: string,
  companyName: string
): string {
  const encodedEmail: string = encodeURIComponent(`${companyName}:${email}`);
  const encodedSecretKey: string = encodeURIComponent(secretKey);
  const encodedIssuer: string = encodeURIComponent(companyName);

  return `otpauth://totp/${encodedEmail}?secret=${encodedSecretKey}&issuer=${encodedIssuer}`.replace(
    /\+/g,
    "%20"
  );
}

function validateCode(userProvidedCode: string, secretKey: string): boolean {
  const period: number = 30;
  const currentTime: number = Math.floor(Date.now() / 1000);
  const decodedKey: Uint8Array = base32Decode(secretKey);

  const generatedCode: number = generateOneTimeCode(
    decodedKey,
    Math.floor(currentTime / period)
  );

  return generatedCode.toString() === userProvidedCode;
}

function generateOneTimeCode(key: Uint8Array, t: number): number {
  const data: Buffer = Buffer.alloc(8);
  let value: number = t;

  for (let i: number = 7; i >= 0; i--) {
    data[i] = value & 0xff;
    value >>>= 8;
  }

  const signKey: Buffer = Buffer.from(key);
  const mac: crypto.Hmac = crypto.createHmac("sha1", signKey);
  const hash: Buffer = mac.update(data).digest();

  const offset: number = hash[19] & 0xf;

  let truncatedHash: number = 0;
  for (let i: number = 0; i < 4; ++i) {
    truncatedHash <<= 8;
    truncatedHash |= hash[offset + i] & 0xff;
  }

  truncatedHash &= 0x7fffffff;
  truncatedHash %= 1000000;

  return truncatedHash;
}

function base32Decode(encodedString: string): Uint8Array {
  const base32Chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

  const bits: string = encodedString
    .toUpperCase()
    .split("")
    .map((char: string) => base32Chars.indexOf(char))
    .map((index: number) => index.toString(2).padStart(5, "0"))
    .join("");

  const chunks: RegExpMatchArray | null = bits.match(/.{1,8}/g);
  if (chunks) {
    const bytes: number[] = chunks.map((chunk: string) => parseInt(chunk, 2));

    return new Uint8Array(bytes);
  } else {
    return new Uint8Array(0);
  }
}

export { generateSecretKey, createQrCode, validateCode };

// dogru calistigini kontrol etmek icin asagidaki kodu deneyebilirsiniz.

// Kullanıcıya ait bilgiler
const userEmail = "furkanilhanresmi@gmail.com";

// Yeni bir gizli anahtar oluştur
const secretKey = generateSecretKey();

// QR kod oluştur ve göster
createQrCode(userEmail, secretKey, "Balance Network")
  .then((qrCode) => {
    if (qrCode) {
      console.log("QR Code generated successfully.");
      console.log(qrCode);
    } else {
      console.log("Error generating QR Code.");
    }
  })
  .catch((error) => console.error("QR Code generation error:", error));

const isCodeValid = validateCode("Enter_User_Code", secretKey);

if (isCodeValid) {
  console.log("Verification successful. Access granted!");
} else {
  console.log("Verification failed. Access denied!");
}
