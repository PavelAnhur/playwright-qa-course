import { expect, mergeTests } from '@playwright/test';
import { test as authTest } from './auth.fixture';
import { test as pagesTest } from './pages.fixture';

export const test = mergeTests(authTest, pagesTest);

export { expect };

export { SEED_USERS, type TestUser } from './data.fixture';
