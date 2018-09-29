exports.NAME = 'development';

exports.PRODUCTION = false;

exports.APP = {
    NAME: 'BaseLine',
    VERSION: '1.0.0',
    DESCRIPTION: 'BaseLine description',
    DEFAULT_LANG: 'en'
};

exports.HOST = {
    FRONTEND: 'http://localhost:4200/',
    PUBLIC: 'http://localhost:3000/',
    MEDIA: 'http://localhost:3000/media/',
};

exports.JWT = {
    LIFE_TIME: 86400,
    KEY: 'f8a94JSrjshs8e49j5PWsDl67'
}

exports.DB = {
    MYSQL: {
        DATABASE: 'dbnodebaseline',
        HOST: 'localhost',
        PORT: 3306,
        USERNAME: 'develop',
        PASSWORD: 'M1C0ntr4s3n49752',
        DIALECT: 'mysql',
        SEEDER_STORAGE: 'sequelize'
    }
};

exports.MAIL_CONFIG = {
    HOST: 'smtp.gmail.com',
    PORT: 587,
    SECURE: false,
    ACCOUNT_EMAIL_ADDRESS: 'fintra.develop@gmail.com',
    ACCOUNT_PASSWORD: 'adminFintra123',
    USER_NAME: 'BaseLine Admin',
    IMAGES_URL: 'http://localhost:3000/images',
    TEMPLATES_DIR: '../../views/mails',
    CC_RECIPIENTS: ['avillarroel@e-bitware.com'/* , 'jegarcia@e-bitware.com' */]
};