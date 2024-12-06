export async function loadConfigFromEnv() {
  return {
    port: parseInt(process.env.NODE_PORT!, 10) || 3000,
    env: process.env.NODE_ENV || 'development',
    userHeader: process.env.USER_HEADER || 'remote-user',
    userGroupsHeader: process.env.USER_GROUPS_HEADER || 'remote-user-groups',
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT!, 10),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      ssl: process.env.DATABASE_SSL,
    },
  };
}
