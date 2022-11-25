const conn = require('./conn')
const User = require('./User')

const syncAndSeed = async() => {
	await conn.sync({force: true})
	const [moe, larry, lucy, prof] = await Promise.all([
		User.create({username: 'moe', password: '123'}),
		User.create({username: 'larry', password: '123'}),
		User.create({username: 'lucy', password: '123'}),
		User.create({username: 'prof', password: '123'})
	])
	return {
		moe,
		larry,
		lucy,
		prof
	}
}

module.exports = {
	syncAndSeed,
	User
}