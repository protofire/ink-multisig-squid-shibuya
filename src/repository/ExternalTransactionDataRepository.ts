import { Ctx } from "../processor";
import { ExternalTransactionData } from "../model";

export class ExternalTransactionDataRepository {
  private ctx: Ctx;

  constructor(ctx: Ctx) {
    this.ctx = ctx;
  }

  async findOneByTxHash(
    txHash: string
  ): Promise<ExternalTransactionData | undefined> {
    return await this.ctx.store.findOneBy(ExternalTransactionData, {
      txHash: txHash,
    });
  }

  async setUsed(extTxData: ExternalTransactionData): Promise<void> {
    extTxData.inUse = true;
    await this.ctx.store.save(extTxData);
  }
}
