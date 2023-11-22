import { ProcessorContext } from "../processor";
import { ExternalTransactionData } from "../model";
import { In } from "typeorm";
import { Store } from "@subsquid/typeorm-store";


export class ExternalTransactionDataRepository {
  private ctx: ProcessorContext<Store>;

  constructor(ctx: ProcessorContext<Store>) {
    this.ctx = ctx;
  }

  async findOneByTxHash(
    txHash: string
  ): Promise<ExternalTransactionData | undefined> {
    return await this.ctx.store.findOneBy(ExternalTransactionData, {
      id: txHash,
    });
  }

  async findByTxHash(
    txHashes: string[]
  ): Promise<ExternalTransactionData[]> {
    return await this.ctx.store.findBy(ExternalTransactionData, {
      id: In(txHashes),
    });
  }

  async setUsed(extTxData: ExternalTransactionData): Promise<void> {
    extTxData.inUse = true;
    await this.ctx.store.save(extTxData);
  }
}
