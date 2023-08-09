module.exports = class Data1691606976774 {
    name = 'Data1691606976774'

    async up(db) {
        await db.query(`CREATE TABLE "multisig_factory" ("id" character varying NOT NULL, "address" text NOT NULL, CONSTRAINT "PK_db09f4572047ff8911b9560d3d6" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "multisig" ("id" character varying NOT NULL, "address" text NOT NULL, "threshold" integer NOT NULL, "owners" text array NOT NULL, "creation_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "creation_block_number" integer NOT NULL, CONSTRAINT "PK_ca0822446a16f9665878a4e3cb2" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "multisig_factory"`)
        await db.query(`DROP TABLE "multisig"`)
    }
}
