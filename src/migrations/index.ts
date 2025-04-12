import * as migration_20250412_183433 from './20250412_183433';
import * as migration_20250412_183931 from './20250412_183931';

export const migrations = [
  {
    up: migration_20250412_183433.up,
    down: migration_20250412_183433.down,
    name: '20250412_183433',
  },
  {
    up: migration_20250412_183931.up,
    down: migration_20250412_183931.down,
    name: '20250412_183931'
  },
];
