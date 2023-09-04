import { Ctx } from "../processor";
import { TransactionRecord } from "../common/types";
import { Transaction } from "../model";
import { toEntityMap } from "../common/helpers";
import { MultisigRepository } from "./MultisigRepository";
import { assertNotNull } from "@subsquid/substrate-processor";
import { In } from "typeorm";

export class TransactionRepository {
  private ctx: Ctx;
  private multisigRepository: MultisigRepository;

  constructor(ctx: Ctx, multisigRepository: MultisigRepository) {
    this.ctx = ctx;
    this.multisigRepository = multisigRepository;
  }

  async updateOrCreate(transactionRecords: TransactionRecord[]) {
    let multisigAddressesHex = new Set<string>();
    for (let t of transactionRecords) {
      multisigAddressesHex.add(t.multisig);
    }

    let multisigs = await this.multisigRepository.findByAddressHex(
        [...multisigAddressesHex]
    ).then(toEntityMap);
    let txs: Transaction[] = [];

    txs = transactionRecords.map((tx) => {
      let multisig = assertNotNull(multisigs.get(tx.multisig));
      const transaction = new Transaction({
        id: tx.id,
        multisig: multisig,
        txId: tx.txId,
        proposer: tx.proposer,
        contractAddress: tx.contractAddress,
        selector: tx.selector,
        args: tx.args,
        value: tx.value,
        status: tx.status,
        error: tx.error,
        approvalCount: tx.approvalCount,
        rejectionCount: tx.rejectionCount,
        lastUpdatedTimestamp: tx.lastUpdatedTimestamp,
        lastUpdatedBlockNumber: tx.lastUpdatedBlockNumber,
      });

      return transaction;
    });

    await this.ctx.store.save(txs);
  }

  async findById(ids: string[]): Promise<Transaction[]> {
    return await this.ctx.store.findBy(Transaction, {
      id: In([...ids]),
    });
  }
}
