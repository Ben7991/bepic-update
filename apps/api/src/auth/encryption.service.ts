import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'node:crypto';

@Injectable()
export class EncryptionService {
  constructor(private readonly _configService: ConfigService) {}

  encrypt(text: string): string {
    const { algorithm, bufferKey } = this._getAlgorithmAndBufferKey();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(
      algorithm,
      Buffer.from(bufferKey, 'hex'),
      iv,
    ) as crypto.CipherGCM;

    let encryptedText = cipher.update(text, 'utf-8', 'hex');
    encryptedText += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    return `${iv.toString('hex')}:${authTag}:${encryptedText}`;
  }

  decrypt(data: string): string {
    const { algorithm, bufferKey } = this._getAlgorithmAndBufferKey();

    const [ivHex, authTagHex, encryptedText] = data.split(':');
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(bufferKey, 'hex'),
      iv,
    ) as crypto.DecipherGCM;

    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

    let decryptedText = decipher.update(encryptedText, 'hex', 'utf-8');
    decryptedText += decipher.final('utf-8');

    return decryptedText;
  }

  private _getAlgorithmAndBufferKey(): {
    algorithm: string;
    bufferKey: string;
  } {
    return {
      algorithm: 'aes-256-gcm',
      bufferKey: this._configService.get<string>('BUFFER_KEY') as string,
    };
  }
}
