import { ProcessorContext } from "../processor";
import { ApprovalOrRejectionRecord } from "../common/types";
import { Rejection } from "../model";
import { toEntityMapTx } from "../common/helpers";
import { TransactionRepository } from "./TransactionRepository";
import { assertNotNull } from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";

export class RejectionRepository {
  private ctx: ProcessorContext<Store>;
  private transactionRepository: TransactionRepository;

  constructor(ctx: ProcessorContext<Store>, multisigRepository: TransactionRepository) {
    this.ctx = ctx;
    this.transactionRepository = multisigRepository;
  }

  async create(rejectionRecords: ApprovalOrRejectionRecord[]) {
    let txIds = new Set<string>();
    for (let r of rejectionRecords) {
      txIds.add(r.transaction);
    }

    let transactions = await this.transactionRepository
      .findById([...txIds])
      .then(toEntityMapTx);

    let rejectionsToSave: Rejection[] = [];

    rejectionsToSave = rejectionRecords.map((r) => {
      let tx = assertNotNull(transactions.get(r.transaction));
      const rejection = new Rejection({
        id: r.id,
        transaction: tx,
        rejector: r.caller,
        rejectionTimestamp: r.timestamp,
        rejectionBlockNumber: r.blockNumber,
      });

      return rejection;
    });

    await this.ctx.store.save(rejectionsToSave);
  }
}
