import { QueryRunner } from 'typeorm';
import { jest } from '@jest/globals';

export const mockedQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
} as unknown as QueryRunner;
