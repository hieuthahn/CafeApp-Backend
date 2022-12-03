module.exports = {
    secret: 'hieuthahn-cafe-app',
    secret_refresh: 'hieuthahn-cafe-app-refresh',
    // jwtExpiration: 3600, // 1 hour
    // jwtRefreshExpiration: 86400, // 24 hours
    /* for test */
    jwtExpiration: 86400000, // 1 minute
    jwtRefreshExpiration: 86400000, // 2 minutes
}
