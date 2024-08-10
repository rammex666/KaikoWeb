const { MongoClient, Long } = require('mongodb');

class Player {
    constructor(data) {
        if (data._id && (data._id instanceof Long || typeof data._id === 'string')) {
            this._id = Long.isLong(data._id) ? data._id : Long.fromString(data._id);
        } else {
            throw new Error('Invalid _id format');
        }
        this.name = data.name;
        this.money = data.money;
        this.level = data.level;
        this.xp = data.xp;
        this.mana = data.mana;
        this.health = data.health;
        this.strength = data.strength;
        this.dexterity = data.dexterity;
        this.intelligence = data.intelligence;
        this.speed = data.speed;
    }

    static async connectToDB() {
        const url = '';
        const dbName = 'kaikodb';
        const client = new MongoClient(url);
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        return { db, client };
    }

    static async findById(id) {
        const { db, client } = await Player.connectToDB();
        try {
            const playerId = Long.isLong(id) ? id : Long.fromString(id.toString());
            console.log(`Searching for player with ID: ${playerId.toString()}`);
            const playerData = await db.collection('players').findOne({ _id: playerId });
            if (playerData) {
                console.log(`Player found: ${JSON.stringify(playerData)}`);
                return new Player(playerData);
            } else {
                console.log('No player found');
                return null;
            }
        } catch (error) {
            console.error(`Error finding player by ID: ${error.message}`);
            throw error;
        } finally {
            client.close();
        }
    }

    static async create(data) {
        const { db, client } = await Player.connectToDB();
        try {
            const player = new Player(data);
            const result = await db.collection('players').insertOne(player);
            return result.ops[0];
        } finally {
            client.close();
        }
    }

    async save() {
        const { db, client } = await Player.connectToDB();
        try {
            const result = await db.collection('players').updateOne(
                { _id: this._id },
                { $set: this },
                { upsert: true }
            );
            return result;
        } finally {
            client.close();
        }
    }
}

module.exports = Player;
