import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/vue';
import { afterEach } from 'vitest';

// Unmount components and clear the DOM between tests.
afterEach(() => {
  cleanup();
});
