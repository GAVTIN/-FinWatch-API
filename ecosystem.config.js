module.exports = {
    apps: [{
        name: 'finwatch-api',
        script: 'src/server.js',
        instances: 'max',
        exec_mode: 'cluster',
        watch: false,
        env: { NODE_ENV: 'production' },
        env_development: { NODE_ENV: 'development' },
        error_file: 'logs/error.log',
        out_file: 'logs/out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss',
    }]
};
