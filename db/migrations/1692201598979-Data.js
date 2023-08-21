module.exports = class Data1692201598979 {
    name = 'Data1692201598979'

    async up(db) {
        await db.query(`CREATE TABLE "multisig_factory" ("id" character varying NOT NULL, "address" text NOT NULL, "code_hash" text NOT NULL, CONSTRAINT "PK_db09f4572047ff8911b9560d3d6" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "approval" ("id" character varying NOT NULL, "approver" text NOT NULL, "approval_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "approval_block_number" integer NOT NULL, "transaction_id" character varying, CONSTRAINT "PK_97bfd1cd9dff3c1302229da6b5c" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_966bae22f0adf85b1ed0b48265" ON "approval" ("transaction_id") `)
        await db.query(`CREATE TABLE "rejection" ("id" character varying NOT NULL, "rejector" text NOT NULL, "rejection_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "rejection_block_number" integer NOT NULL, "transaction_id" character varying, CONSTRAINT "PK_7f36d20cccdfe5d62d0608d4cfc" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_a5a98484cf3de1b003f6e15752" ON "rejection" ("transaction_id") `)
        await db.query(`CREATE TABLE "transaction" ("id" character varying NOT NULL, "tx_id" integer NOT NULL, "contract_address" text NOT NULL, "selector" text NOT NULL, "args" text NOT NULL, "value" numeric NOT NULL, "status" character varying(16) NOT NULL, "error" text, "approval_count" integer NOT NULL, "rejection_count" integer NOT NULL, "last_updated_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "last_updated_block_number" integer NOT NULL, "multisig_id" character varying, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_91bafcb83842b86c470d514387" ON "transaction" ("multisig_id") `)
        await db.query(`CREATE TABLE "multisig" ("id" character varying NOT NULL, "address_ss58" text NOT NULL, "address_hex" text NOT NULL, "deployment_salt" text NOT NULL, "threshold" integer NOT NULL, "owners" text array NOT NULL, "creation_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "creation_block_number" integer NOT NULL, CONSTRAINT "PK_ca0822446a16f9665878a4e3cb2" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "approval" ADD CONSTRAINT "FK_966bae22f0adf85b1ed0b482651" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "rejection" ADD CONSTRAINT "FK_a5a98484cf3de1b003f6e157525" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_91bafcb83842b86c470d5143870" FOREIGN KEY ("multisig_id") REFERENCES "multisig"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "multisig_factory"`)
        await db.query(`DROP TABLE "approval"`)
        await db.query(`DROP INDEX "public"."IDX_966bae22f0adf85b1ed0b48265"`)
        await db.query(`DROP TABLE "rejection"`)
        await db.query(`DROP INDEX "public"."IDX_a5a98484cf3de1b003f6e15752"`)
        await db.query(`DROP TABLE "transaction"`)
        await db.query(`DROP INDEX "public"."IDX_91bafcb83842b86c470d514387"`)
        await db.query(`DROP TABLE "multisig"`)
        await db.query(`ALTER TABLE "approval" DROP CONSTRAINT "FK_966bae22f0adf85b1ed0b482651"`)
        await db.query(`ALTER TABLE "rejection" DROP CONSTRAINT "FK_a5a98484cf3de1b003f6e157525"`)
        await db.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_91bafcb83842b86c470d5143870"`)
    }
}
