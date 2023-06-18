module.exports = {
  experimental: {
    appDir: true,
  },
  output: "export",
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
    }
    // config.externals = {
    //   mysql2: 'mysql2',
    // };
    return config;
  },
  env: {
    DB_NAME: "daily_records",
    DB_USERNAME: "root",
    DB_PASSWORD: "stationDB",
    DB_HOST: "localhost",
    DB_PORT: 3306,
  },
};
