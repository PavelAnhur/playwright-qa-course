import { expect, mergeTests } from '@playwright/test';
import { test as apiTest } from './api.fixture';
import { test as dataTest } from './data.fixture';
import { test as pageTest } from './pages.fixture';

export const test = mergeTests(dataTest, apiTest, pageTest);

export { expect };

export { SEED_USERS, type TestUser } from './data.fixture';
