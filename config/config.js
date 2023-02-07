const env = process.env.NODE_ENV; // 'staging' or 'production'

const staging = {
    mongo: {
        db: process.env.MONGO_URL
    },
    jwt: {
        jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
        jwtRefreshSecret: process.env.JWT_REFRESH_SECRET
    },
};

const production = {

    mongo: {
        db: process.env.MONGO_URL
    },
    jwt: {
        jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
        jwtRefreshSecret: process.env.JWT_REFRESH_SECRET
    },
};


const config = {
    production,
    staging
};

module.exports = config[env];
