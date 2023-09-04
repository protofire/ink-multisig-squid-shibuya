import { Ctx } from "../processor";
import { ApprovalOrRejectionRecord } from "../common/types";
import { Approval } from "../model";
import { toEntityMapTx } from "../common/helpers";
import { TransactionRepository } from "./TransactionRepository";
import { assertNotNull } from "@subsquid/substrate-processor";

export class ApprovalRepository {
  private ctx: Ctx;
  private transactionRepository: TransactionRepository;

  constructor(ctx: Ctx, multisigRepository: TransactionRepository) {
    this.ctx = ctx;
    this.transactionRepository = multisigRepository;
  }

  async create(approvalRecords: ApprovalOrRejectionRecord[]) {
    let txIds = new Set<string>();
    for (let a of approvalRecords) {
      txIds.add(a.transaction);
    }

    let transactions = await this.transactionRepository
      .findById([...txIds])
      .then(toEntityMapTx);

    let approvalsToSave: Approval[] = [];

    approvalsToSave = approvalRecords.map((a) => {
      let tx = assertNotNull(transactions.get(a.transaction));
      const approval = new Approval({
        id: a.id,
        transaction: tx,
        approver: a.caller,
        approvalTimestamp: a.timestamp,
        approvalBlockNumber: a.blockNumber,
      });

      return approval;
    });

    await this.ctx.store.save(approvalsToSave);
  }
}
