export class UserDocument {
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  confirmationCode: string | null;
  expirationData: Date | null;
  isConfirmed: boolean;
  recoveryCode: string | null;
  expirationDateCode: Date | null;
  passwordSalt: string;
}
