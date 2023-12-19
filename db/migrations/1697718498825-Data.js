require("dotenv/config");
module.exports = class Data1697718498825 {
    name = 'Data1697718498825'

    async up(db) {
        await db.query(`CREATE TABLE "multisig_factory" ("id" character varying NOT NULL, "address" text NOT NULL, "code_hash" text NOT NULL, CONSTRAINT "PK_db09f4572047ff8911b9560d3d6" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "external_transaction_data" ("id" character varying NOT NULL, "method_name" text NOT NULL, "args" bytea NOT NULL, "creation_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "in_use" boolean NOT NULL, CONSTRAINT "PK_caf6c1ca405ec201369711fe6bf" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "approval" ("id" character varying NOT NULL, "approver" text NOT NULL, "approval_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "approval_block_number" integer NOT NULL, "transaction_id" character varying, CONSTRAINT "PK_97bfd1cd9dff3c1302229da6b5c" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_966bae22f0adf85b1ed0b48265" ON "approval" ("transaction_id") `)
        await db.query(`CREATE TABLE "rejection" ("id" character varying NOT NULL, "rejector" text NOT NULL, "rejection_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "rejection_block_number" integer NOT NULL, "transaction_id" character varying, CONSTRAINT "PK_7f36d20cccdfe5d62d0608d4cfc" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_a5a98484cf3de1b003f6e15752" ON "rejection" ("transaction_id") `)
        await db.query(`CREATE TABLE "transaction" ("id" character varying NOT NULL, "proposal_tx_hash" text NOT NULL, "execution_tx_hash" text, "tx_id" numeric NOT NULL, "proposer" text NOT NULL, "contract_address" text NOT NULL, "selector" text NOT NULL, "args" text NOT NULL, "value" numeric NOT NULL, "status" character varying(16) NOT NULL, "error" text, "approval_count" integer NOT NULL, "rejection_count" integer NOT NULL, "creation_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "creation_block_number" integer NOT NULL, "last_updated_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "last_updated_block_number" integer NOT NULL, "multisig_id" character varying, "external_transaction_data_id" character varying, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_91bafcb83842b86c470d514387" ON "transaction" ("multisig_id") `)
        await db.query(`CREATE INDEX "IDX_fffa11daf6206db480ae61ad45" ON "transaction" ("external_transaction_data_id") `)
        await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "value" numeric NOT NULL, "transfer_type" character varying(6) NOT NULL, "token_address" text, "token_decimals" integer, "creation_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "creation_block_number" integer NOT NULL, "multisig_id" character varying, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_6c544577a498cabdbdf1bcb9b8" ON "transfer" ("multisig_id") `)
        await db.query(`CREATE TABLE "multisig" ("id" character varying NOT NULL, "address_ss58" text NOT NULL, "address_hex" text NOT NULL, "deployment_salt" text NOT NULL, "threshold" integer NOT NULL, "owners" text array NOT NULL, "creation_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "creation_block_number" integer NOT NULL, CONSTRAINT "PK_ca0822446a16f9665878a4e3cb2" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "approval" ADD CONSTRAINT "FK_966bae22f0adf85b1ed0b482651" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "rejection" ADD CONSTRAINT "FK_a5a98484cf3de1b003f6e157525" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_91bafcb83842b86c470d5143870" FOREIGN KEY ("multisig_id") REFERENCES "multisig"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_fffa11daf6206db480ae61ad45c" FOREIGN KEY ("external_transaction_data_id") REFERENCES "external_transaction_data"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "transfer" ADD CONSTRAINT "FK_6c544577a498cabdbdf1bcb9b81" FOREIGN KEY ("multisig_id") REFERENCES "multisig"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "multisig_factory"`)
        await db.query(`DROP TABLE "external_transaction_data"`)
        await db.query(`DROP TABLE "approval"`)
        await db.query(`DROP INDEX "public"."IDX_966bae22f0adf85b1ed0b48265"`)
        await db.query(`DROP TABLE "rejection"`)
        await db.query(`DROP INDEX "public"."IDX_a5a98484cf3de1b003f6e15752"`)
        await db.query(`DROP TABLE "transaction"`)
        await db.query(`DROP INDEX "public"."IDX_91bafcb83842b86c470d514387"`)
        await db.query(`DROP INDEX "public"."IDX_fffa11daf6206db480ae61ad45"`)
        await db.query(`DROP TABLE "transfer"`)
        await db.query(`DROP INDEX "public"."IDX_6c544577a498cabdbdf1bcb9b8"`)
        await db.query(`DROP TABLE "multisig"`)
        await db.query(`ALTER TABLE "approval" DROP CONSTRAINT "FK_966bae22f0adf85b1ed0b482651"`)
        await db.query(`ALTER TABLE "rejection" DROP CONSTRAINT "FK_a5a98484cf3de1b003f6e157525"`)
        await db.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_91bafcb83842b86c470d5143870"`)
        await db.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_fffa11daf6206db480ae61ad45c"`)
        await db.query(`ALTER TABLE "transfer" DROP CONSTRAINT "FK_6c544577a498cabdbdf1bcb9b81"`)
    }
}
