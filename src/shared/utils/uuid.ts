type UuidModule = typeof import('uuid');

let uuidModule: UuidModule | null = null;

const loadUuidModule = (): UuidModule => {
  if (uuidModule === null) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    uuidModule = require('uuid') as UuidModule;
  }

  return uuidModule;
};

export const generateUuidV7 = (): string => {
  const { v7 } = loadUuidModule();
  return v7();
};
