import { Ctx } from "../processor";
import { TransactionRecord } from "../common/types";
import { Transaction } from "../model";
import { toEntityMap, toEntityMapTx } from "../common/helpers";
import { MultisigRepository } from "./MultisigRepository";
import { assertNotNull } from "@subsquid/substrate-processor";
import { In } from "typeorm";
import { ExternalTransactionDataRepository } from "./ExternalTransactionDataRepository";

export class TransactionRepository {
  private ctx: Ctx;
  private multisigRepository: MultisigRepository;
  private externalTransactionDataRepository: ExternalTransactionDataRepository;

  constructor(ctx: Ctx, multisigRepository: MultisigRepository, externalTransactionDataRepository: ExternalTransactionDataRepository) {
    this.ctx = ctx;
    this.multisigRepository = multisigRepository;
    this.externalTransactionDataRepository = externalTransactionDataRepository;
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

    let extTxsData = new Set<string>();
    for (let t of transactionRecords) {
      if (t.externalTransactionData) {
        extTxsData.add(t.externalTransactionData);
      }
    }

    let extTxs = await this.externalTransactionDataRepository.findByTxHash(
        [...extTxsData]
    ).then(toEntityMapTx);

    txs = transactionRecords.map((tx) => {
      let multisig = assertNotNull(multisigs.get(tx.multisig));
      let extTxId = tx.externalTransactionData;
      let extTx;
      if(extTxId) {
        extTx = extTxs.get(extTxId);
      }
     
      const transaction = new Transaction({
        id: tx.id,
        proposalTxHash: tx.proposalTxHash,
        executionTxHash: tx.executionTxHash,
        multisig: multisig,
        txId: tx.txId,
        proposer: tx.proposer,
        contractAddress: tx.contractAddress,
        selector: tx.selector,
        args: tx.args,
        value: tx.value,
        externalTransactionData: extTx,
        status: tx.status,
        error: tx.error,
        approvalCount: tx.approvalCount,
        rejectionCount: tx.rejectionCount,
        creationTimestamp: tx.creationTimestamp,
        creationBlockNumber: tx.creationBlockNumber,
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
