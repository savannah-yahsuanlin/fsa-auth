const Sequelize = require('Sequelize')
const config = {
	logging: false
}

if(process.env.QUIET) {
	config.logging = false
}

const conn = new Sequelize(process.env.DATABASE_URL || `postgres://localhost/acme_db`, config)

module.exports = conn