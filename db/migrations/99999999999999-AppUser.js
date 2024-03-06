require("dotenv/config");
module.exports = class AppUser99999999999999 {
  name = "AppUser99999999999999";

  async up(db) {
    await db.query(
      `CREATE USER ${process.env.DB_APPUSER_NAME || "appuser"} WITH PASSWORD '${
        process.env.DB_APPUSER_PASSWORD || "appuser"
      }'`
    );
    await db.query(`GRANT USAGE ON SCHEMA public TO appuser`);
    await db.query(
      `GRANT SELECT, INSERT ON TABLE external_transaction_data TO appuser`
    );
  }

  async down(db) {
    await db.query(`DROP USER ${process.env.DB_APPUSER_NAME || "appuser"}`);
    await db.query(`REVOKE USAGE ON SCHEMA public FROM appuser`);
    await db.query(
      `REVOKE SELECT, INSERT ON TABLE external_transaction_data FROM appuser`
    );
  }
};
