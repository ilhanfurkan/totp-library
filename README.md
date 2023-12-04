# Two-Factor Authentication (TOTP) Library

This library provides functions for generating and validating Time-Based One-Time Passwords (TOTP) for implementing two-factor authentication in Node.js applications. It uses QR codes for easy setup and follows the TOTP standard.

## Installation

```
npm install totp-library
```

## Usage

### 1. Import the Library

```
   import { generateSecretKey, createQrCode, validateCode } from "totp-library";
```

### 2. Generate a Secret Key

```
   const userEmail = "user@example.com";
   const secretKey = generateSecretKey();
   const companyName = "Your_Company_Name";
```

### 3. Create and Display QR Code

```
   createQrCode(userEmail, secretKey, companyName)
   .then((qrCode) => {
   if (qrCode) {
   console.log("QR Code generated successfully.");
   console.log(qrCode);
   } else {
   console.log("Error generating QR Code.");
   }
   })
   .catch((error) => console.error("QR Code generation error:", error));
```

### 4. Validate User-Provided Code

```
   const isCodeValid = validateCode("Enter_User_Code", secretKey);

if (isCodeValid) {
console.log("Verification successful. Access granted!");
} else {
console.log("Verification failed. Access denied!");
}
```

### Functions

```
generateSecretKey(): string
```

- Generates a random secret key for a user.

```
createQrCode(email: string, secretKey: string, companyName: string): Promise<string>
```

- Generates a QR code containing the TOTP URI for the provided user details.

```
validateCode(userProvidedCode: string, secretKey: string): boolean
```

- Validates the user-provided TOTP against the generated TOTP.

## Example

For a complete example, see the provided code at the end of this README.

### Example Usage

```
// User details
const userEmail = "user@example.com";

// Generate a new secret key
const secretKey = generateSecretKey();

// Create and display QR code
createQrCode(userEmail, secretKey, "Your Company Name")
.then((qrCode) => {
if (qrCode) {
console.log("QR Code generated successfully.");
console.log(qrCode);
} else {
console.log("Error generating QR Code.");
}
})
.catch((error) => console.error("QR Code generation error:", error));

// Validate user-provided code
const isCodeValid = validateCode("Enter_User_Code", secretKey);

if (isCodeValid) {
console.log("Verification successful. Access granted!");
} else {
console.log("Verification failed. Access denied!");
}
```
