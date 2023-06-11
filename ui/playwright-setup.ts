// global-setup.ts/js

async function globalSetup() {
  const { TEST_INSTANCE_URL, TEST_INSTANCE_KEY, TEST_INSTANCE_SECRET } =
    process.env;

  if (!TEST_INSTANCE_URL || !TEST_INSTANCE_KEY || !TEST_INSTANCE_SECRET) {
    throw new Error('Missing test instance credentials');
  }
}

export default globalSetup;
