import { config } from './index.js'

const user = config.DB.POSTGRES_USER
const password = config.DB.POSTGRES_PASSWORD
const database = config.DB.POSTGRES_DB
const host = config.DB.POSTGRES_HOST
const dialect = config.DB.DIALECT
const port = config.DB.POSTGRES_PORT

const databaseConnectionSetup = () => {
    return {
        user,
        password,
        database,
        options: {
            dialect,
            host,
            port,
            schema: 'public',
            dialectOptions: {
                multipleStatements: true,
                // ssl: {
                //     // require: true, // Opción adicional para requerir SSL
                // },
            },
            logging: false,
            timezone: '-06:00',
            define: {
                freezeTableName: true,
                timestamps: false,
                underscored: true
            }
        }

    }
}

export default databaseConnectionSetup()