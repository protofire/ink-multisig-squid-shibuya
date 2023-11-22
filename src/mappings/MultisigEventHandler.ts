import {
  approvals,
  existingMultisigs,
  existingTransactions,
  multisigData,
  rejections,
  transactionData,
} from "../common/entityRecords";
import { Block as BlockHeader } from "../processor";
import * as multisig from "../abi/multisig";
import { MultisigRepository } from "../repository/MultisigRepository";
import { TransactionRepository } from "../repository/TransactionRepository";
import * as ss58 from "@subsquid/ss58";
import { SS58_PREFIX } from "../common/constants";
import { uint8ArrayToHexString } from "../common/helpers";
import { ExternalTransactionData, TransactionStatus } from "../model";
import { ApprovalOrRejectionRecord, TransactionRecord } from "../common/types";
import {
  MultisigError_EnvExecutionFailed,
  MultisigError_LangExecutionFailed,
} from "../abi/multisig";
import { ExternalTransactionDataRepository } from "../repository/ExternalTransactionDataRepository";

export class MultisigEventHandler {
  private multisigRepository: MultisigRepository;
  private transactionRepository: TransactionRepository;
  private externalTransactionDataRepository: ExternalTransactionDataRepository;

  constructor(
    multisigRepository: MultisigRepository,
    transactionRepository: TransactionRepository,
    externalTransactionDataRepository: ExternalTransactionDataRepository
  ) {
    this.multisigRepository = multisigRepository;
    this.transactionRepository = transactionRepository;
    this.externalTransactionDataRepository = externalTransactionDataRepository;
  }

  async handleEvent(
    contractAddressHex: string,
    evenData: string,
    txHash: string,
    blockHeader: BlockHeader
  ) {
    const event = multisig.decodeEvent(evenData);
    switch (event.__kind) {
      case "ThresholdChanged":
        await this.handleThresholdChanged(
          contractAddressHex,
          event,
          blockHeader
        );
        break;
      case "OwnerAdded":
        await this.handleOwnerAdded(contractAddressHex, event, blockHeader);
        break;
      case "OwnerRemoved":
        await this.handleOwnerRemoved(contractAddressHex, event, blockHeader);
        break;
      case "TransactionProposed":
        await this.handleTransactionProposed(
          contractAddressHex,
          event,
          txHash,
          blockHeader
        );
        break;
      case "TransactionExecuted":
        await this.handleTransactionExecuted(
          contractAddressHex,
          event,
          txHash,
          blockHeader
        );
        break;
      case "TransactionCancelled":
        await this.handleTransactionCancelled(
          contractAddressHex,
          event,
          txHash,
          blockHeader
        );
        break;

      case "Approve":
        await this.handleApprove(contractAddressHex, event, blockHeader);
        break;
      case "Reject":
        await this.handleReject(contractAddressHex, event, blockHeader);
        break;
    }
  }

  private async handleThresholdChanged(
    contractAddressHex: string,
    event: multisig.Event_ThresholdChanged,
    blockHeader: BlockHeader
  ) {
    await this.fetchMultisigDataFromDBIfNeeded(contractAddressHex);
    multisigData[contractAddressHex].threshold = event.threshold;
  }

  private async handleOwnerAdded(
    contractAddressHex: string,
    event: multisig.Event_OwnerAdded,
    blockHeader: BlockHeader
  ) {
    await this.fetchMultisigDataFromDBIfNeeded(contractAddressHex);
    multisigData[contractAddressHex].owners.push(
      ss58.codec(SS58_PREFIX).encode(event.owner)
    );
  }

  private async handleOwnerRemoved(
    contractAddressHex: string,
    event: multisig.Event_OwnerRemoved,
    blockHeader: BlockHeader
  ) {
    await this.fetchMultisigDataFromDBIfNeeded(contractAddressHex);
    multisigData[contractAddressHex].owners = multisigData[
      contractAddressHex
    ].owners.filter(
      (owner) => owner !== ss58.codec(SS58_PREFIX).encode(event.owner)
    );
  }

  private async handleTransactionProposed(
    contractAddressHex: string,
    event: multisig.Event_TransactionProposed,
    txHash: string,
    blockHeader: BlockHeader
  ) {
    // Fetch external transaction data from DB if it exists
    const externalTransactionData =
      await this.externalTransactionDataRepository.findOneByTxHash(txHash);

    // Set it as used
    if (externalTransactionData) {
      await this.externalTransactionDataRepository.setUsed(
        externalTransactionData
      );
    }

    // Create transaction data
    const newTransactionId = this.createTransactionId(
      contractAddressHex,
      event.txId
    );
    transactionData[newTransactionId] = this.createTransactionData(
      newTransactionId,
      contractAddressHex,
      event,
      blockHeader,
      TransactionStatus.PROPOSED,
      txHash,
      externalTransactionData
    );
    existingTransactions.add(newTransactionId);

    // Create approval data
    const newApprovalId = newTransactionId + "-" + event.proposer.toString();

    approvals.push(
      this.createApprovalOrRejectionRecord(
        newApprovalId,
        newTransactionId,
        event.proposer,
        blockHeader
      )
    );
  }

  private async handleTransactionExecuted(
    contractAddressHex: string,
    event: multisig.Event_TransactionExecuted,
    txHash: string,
    blockHeader: BlockHeader
  ) {
    const transactionId = this.createTransactionId(
      contractAddressHex,
      event.txId
    );

    await this.fetchTransactionDataFromDBIfNeeded(transactionId);

    this.updateTransactionData(
      transactionId,
      blockHeader,
      event.result.__kind === "Success"
        ? TransactionStatus.EXECUTED_SUCCESS
        : TransactionStatus.EXECUTED_FAILURE,
      txHash
    );

    if (event.result.__kind === "Failed") {
      transactionData[transactionId].error = this.getErrorMessage(event.result);
    }
  }

  private async handleTransactionCancelled(
    contractAddressHex: string,
    event: multisig.Event_TransactionCancelled,
    txHash: string,
    blockHeader: BlockHeader
  ) {
    const transactionId = this.createTransactionId(
      contractAddressHex,
      event.txId
    );
    await this.fetchTransactionDataFromDBIfNeeded(transactionId);

    this.updateTransactionData(
      transactionId,
      blockHeader,
      TransactionStatus.CANCELLED,
      null
    );
  }

  private async handleApprove(
    contractAddressHex: string,
    event: multisig.Event_Approve,
    blockHeader: BlockHeader
  ) {
    const transactionId = this.createTransactionId(
      contractAddressHex,
      event.txId
    );
    await this.fetchTransactionDataFromDBIfNeeded(transactionId);

    transactionData[transactionId].approvalCount += 1;

    const newApprovalId = transactionId + "-" + event.owner.toString();

    approvals.push(
      this.createApprovalOrRejectionRecord(
        newApprovalId,
        transactionId,
        event.owner,
        blockHeader
      )
    );
  }

  private async handleReject(
    contractAddressHex: string,
    event: multisig.Event_Reject,
    blockHeader: BlockHeader
  ) {
    const transactionId = this.createTransactionId(
      contractAddressHex,
      event.txId
    );
    await this.fetchTransactionDataFromDBIfNeeded(transactionId);

    transactionData[transactionId].rejectionCount += 1;

    const newRejectionId = transactionId + "-" + event.owner.toString();

    rejections.push(
      this.createApprovalOrRejectionRecord(
        newRejectionId,
        transactionId,
        event.owner,
        blockHeader
      )
    );
  }

  private async fetchMultisigDataFromDBIfNeeded(contractAddressHex: string) {
    if (!existingMultisigs.get(contractAddressHex)) {
      multisigData[contractAddressHex] = (
        await this.multisigRepository.findByAddressHex([contractAddressHex])
      )[0]; //This must exist and be unique

      // Set map to true to indicate that we have the content on multisigData
      existingMultisigs.set(contractAddressHex, true);
    }
  }

  private createTransactionId(contractAddressHex: string, txId: bigint) {
    return contractAddressHex + "-" + txId;
  }

  private async fetchTransactionDataFromDBIfNeeded(transactionId: string) {
    if (!existingTransactions.has(transactionId)) {
      let dbTx = (
        await this.transactionRepository.findById([transactionId])
      )[0]; //This must exist and be unique

      transactionData[transactionId] = {
        ...dbTx,
        multisig: dbTx.multisig.addressHex,
        externalTransactionData: dbTx.externalTransactionData?.id,
      };
      existingTransactions.add(transactionId);
    }
  }

  private createTransactionData(
    newTransactionId: string,
    contractAddressHex: string,
    event: multisig.Event_TransactionProposed,
    blockHeader: BlockHeader,
    status: TransactionStatus,
    txHash: string,
    externalTransactionData: ExternalTransactionData | null | undefined
  ): TransactionRecord {
    return {
      id: newTransactionId,
      proposalTxHash: txHash,
      executionTxHash: null,
      multisig: contractAddressHex,
      txId: event.txId,
      proposer: ss58.codec(SS58_PREFIX).encode(event.proposer),
      contractAddress: ss58.codec(SS58_PREFIX).encode(event.contractAddress),
      selector: event.selector.toString(),
      args: event.input.toString(),
      value: event.transferredValue,
      externalTransactionData: externalTransactionData?.id,
      status: status,
      error: "",
      approvalCount: 1,
      rejectionCount: 0,
      creationTimestamp: new Date(blockHeader.timestamp!),
      creationBlockNumber: blockHeader.height,
      lastUpdatedTimestamp: new Date(blockHeader.timestamp!),
      lastUpdatedBlockNumber: blockHeader.height,
    };
  }

  private updateTransactionData(
    transactionId: string,
    blockHeader: BlockHeader,
    status: TransactionStatus,
    txHash: string | null
  ) {
    transactionData[transactionId].lastUpdatedTimestamp = new Date(
      blockHeader.timestamp!
    );
    transactionData[transactionId].lastUpdatedBlockNumber = blockHeader.height;
    transactionData[transactionId].status = status;
    transactionData[transactionId].executionTxHash = txHash;
  }

  private getErrorMessage(
    result: multisig.Event_TransactionExecuted["result"]
  ) {
    if ("__kind" in result.value) {
      if (result.value.__kind === "EnvExecutionFailed") {
        let error = result.value as MultisigError_EnvExecutionFailed;
        return result.value.__kind + ": " + error.value;
      } else if (result.value.__kind === "LangExecutionFailed") {
        let error = result.value as MultisigError_LangExecutionFailed;
        return result.value.__kind + ": " + error.value.__kind;
      } else {
        return result.value.__kind;
      }
    }
  }

  private createApprovalOrRejectionRecord(
    id: string,
    transactionId: string,
    owner: Uint8Array,
    blockHeader: BlockHeader
  ): ApprovalOrRejectionRecord {
    return {
      id: id,
      transaction: transactionId,
      caller: ss58.codec(SS58_PREFIX).encode(owner),
      timestamp: new Date(blockHeader.timestamp!),
      blockNumber: blockHeader.height,
    };
  }
}
