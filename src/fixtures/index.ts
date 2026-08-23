import { expect, mergeTests } from '@playwright/test';
import { test as authTest } from './auth.fixture';
import { test as pagesTest } from './pages.fixture';
import { test as scenarioTest } from './scenarios.fixture';

export const test = mergeTests(authTest, pagesTest, scenarioTest);

export { expect };

export { SEED_USERS, type TestUser } from './data.fixture';
