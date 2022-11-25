const conn = require('./conn')
const {STRING, BOOLEAN, TEXT, UUID, UUIDV4} = conn.Sequelize
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const JWT = process.env.JWT


const User = conn.define('user', {
	id: {
		type: UUID,
		primaryKey: true,
		defaultValue: UUIDV4
	},
	username: {
		type: STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		},
		unique: true
	},
	password: {
		type: STRING,
		allowNull: false,
		validate: {
			notEmpty: true
		}
	},
	isAdmin: {
		type: BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	avatar: {
		type: TEXT,
		get: function() {
			const prefix = 'data:image/png;base64,'
			const data = this.getDataValue('avatar')
			if(!data) {
				return data
			}
			if(data.startsWith(prefix)) {
				return data
			}
			return `${prefix}${data}`
		}
	}
})

User.addHook('beforeSave', async(user) => {
	if(user.changed('password')) {
		user.password = await bcrypt.hash(user.password, 5)
	}
})


User.findByToken = async function(token) {
	try {
		const { id } = jwt.verify(token, process.env.JWT)
		const user = await this.findByPk(id)
		if(user) return user
		throw 'user not found'
	} catch (ex) {
		const error = new Error('bad credentials')
		error.status = 401
		throw error
	}
}

User.prototype.generateToken = function() {
	return jwt.sign({id: this.id}, JWT)
}

User.authenticate = async function({username, password}) {
	const user = await this.findOne({
		where: {
			username
		}
	})
	if(user && await bcrypt.compare(password, user.password)) {
		return jwt.sign({id: user.id}, JWT)
	}
	const error = new Error('bad credentials')
	error.status = 401
	throw error
} 

module.exports = User