import {
  approvals,
  existingMultisigs,
  existingTransactions,
  multisigData,
  rejections,
  transactionData,
} from "../common/entityRecords";
import { SubstrateBlock } from "@subsquid/substrate-processor";
import * as multisig from "../abi/multisig";
import { MultisigRepository } from "../repository/MultisigRepository";
import { TransactionRepository } from "../repository/TransactionRepository";
import * as ss58 from "@subsquid/ss58";
import { SS58_PREFIX } from "../common/constants";
import { uint8ArrayToHexString } from "../common/helpers";
import { TransactionStatus } from "../model";
import { ApprovalOrRejectionRecord } from "../common/types";
import {
  MultisigError_EnvExecutionFailed,
  MultisigError_LangExecutionFailed,
} from "../abi/multisig";

export class MultisigEventHandler {
  private multisigRepository: MultisigRepository;
  private transactionRepository: TransactionRepository;

  constructor(
    multisigRepository: MultisigRepository,
    transactionRepository: TransactionRepository
  ) {
    this.multisigRepository = multisigRepository;
    this.transactionRepository = transactionRepository;
  }

  async handleEvent(
    contractAddressHex: string,
    evenData: string,
    blockHeader: SubstrateBlock
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
          blockHeader
        );
        break;
      case "TransactionExecuted":
        await this.handleTransactionExecuted(
          contractAddressHex,
          event,
          blockHeader
        );
        break;
      case "TransactionCancelled":
        await this.handleTransactionCancelled(
          contractAddressHex,
          event,
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
    blockHeader: SubstrateBlock
  ) {
    // If multisigData doesn't have this multisig, it means that we need to fetch it from the DB
    if (!existingMultisigs.get(contractAddressHex)) {
      await this.fetchMultisigDataFromDB(contractAddressHex);
    }

    // Update the threshold
    multisigData[contractAddressHex].threshold = event.threshold;
  }

  private async handleOwnerAdded(
    contractAddressHex: string,
    event: multisig.Event_OwnerAdded,
    blockHeader: SubstrateBlock
  ) {
    // If multisigData doesn't have this multisig, it means that we need to fetch it from the DB
    if (!existingMultisigs.get(contractAddressHex)) {
      await this.fetchMultisigDataFromDB(contractAddressHex);
    }

    // Add the new owner
    multisigData[contractAddressHex].owners.push(
      ss58.codec(SS58_PREFIX).encode(event.owner)
    );
  }

  private async handleOwnerRemoved(
    contractAddressHex: string,
    event: multisig.Event_OwnerRemoved,
    blockHeader: SubstrateBlock
  ) {
    // If multisigData doesn't have this multisig, it means that we need to fetch it from the DB
    if (!existingMultisigs.get(contractAddressHex)) {
      await this.fetchMultisigDataFromDB(contractAddressHex);
    }

    // Remove the owner
    multisigData[contractAddressHex].owners = multisigData[
      contractAddressHex
    ].owners.filter(
      (owner) => owner !== ss58.codec(SS58_PREFIX).encode(event.owner)
    );
  }

  private async handleTransactionProposed(
    contractAddressHex: string,
    event: multisig.Event_TransactionProposed,
    blockHeader: SubstrateBlock
  ) {
    //Each time a transaction is proposed, we create a new transaction record and also a new approval record for the creator
    const newTransactionId = contractAddressHex + "-" + event.txId;
    existingTransactions.add(newTransactionId);
    transactionData[newTransactionId] = {
      id: newTransactionId,
      multisig: contractAddressHex,
      txId: event.txId,
      proposer: ss58.codec(SS58_PREFIX).encode(event.proposer),
      contractAddress: ss58.codec(SS58_PREFIX).encode(event.contractAddress),
      selector: uint8ArrayToHexString(event.selector),
      args: uint8ArrayToHexString(event.input),
      value: event.transferredValue,
      status: TransactionStatus.PROPOSED,
      error: "",
      approvalCount: 1,
      rejectionCount: 0,
      lastUpdatedTimestamp: new Date(blockHeader.timestamp),
      lastUpdatedBlockNumber: blockHeader.height,
    };

    const newApprovalId =
      newTransactionId + "-" + uint8ArrayToHexString(event.proposer);

    // Add the approval
    const newApproval: ApprovalOrRejectionRecord = {
      id: newApprovalId,
      transaction: newTransactionId,
      caller: ss58.codec(SS58_PREFIX).encode(event.proposer),
      timestamp: new Date(blockHeader.timestamp),
      blockNumber: blockHeader.height,
    };

    approvals.push(newApproval);
  }

  private async handleTransactionExecuted(
    contractAddressHex: string,
    event: multisig.Event_TransactionExecuted,
    blockHeader: SubstrateBlock
  ) {
    const transactionId = contractAddressHex + "-" + event.txId;
    if (!existingTransactions.has(transactionId)) {
      let dbTx = (
        await this.transactionRepository.findById([transactionId])
      )[0]; //This must exist and be unique
      transactionData[transactionId] = {
        id: transactionId,
        multisig: contractAddressHex,
        txId: event.txId,
        proposer: dbTx.proposer,
        contractAddress: dbTx.contractAddress,
        selector: dbTx.selector,
        args: dbTx.args,
        value: dbTx.value,
        status: dbTx.status,
        error: dbTx.error,
        approvalCount: dbTx.approvalCount,
        rejectionCount: dbTx.rejectionCount,
        lastUpdatedTimestamp: dbTx.lastUpdatedTimestamp,
        lastUpdatedBlockNumber: dbTx.lastUpdatedBlockNumber,
      };

      existingTransactions.add(transactionId);
    }

    // Update the transaction
    transactionData[transactionId].lastUpdatedTimestamp = new Date(
      blockHeader.timestamp
    );
    transactionData[transactionId].lastUpdatedBlockNumber = blockHeader.height;

    if (event.result.__kind === "Success") {
      transactionData[transactionId].status =
        TransactionStatus.EXECUTED_SUCCESS;
    }
    if (event.result.__kind === "Failed") {
      transactionData[transactionId].status =
        TransactionStatus.EXECUTED_FAILURE;

      if (event.result.value.__kind === "EnvExecutionFailed") {
        let error = event.result.value as MultisigError_EnvExecutionFailed;
        transactionData[transactionId].error =
          event.result.value.__kind + ": " + error.value;
      } else if (event.result.value.__kind === "LangExecutionFailed") {
        let error = event.result.value as MultisigError_LangExecutionFailed;
        transactionData[transactionId].error =
          event.result.value.__kind + ": " + error.value.__kind;
      } else {
        transactionData[transactionId].error = event.result.value.__kind;
      }
    }
  }

  private async handleTransactionCancelled(
    contractAddressHex: string,
    event: multisig.Event_TransactionCancelled,
    blockHeader: SubstrateBlock
  ) {
    const transactionId = contractAddressHex + "-" + event.txId;
    if (!existingTransactions.has(transactionId)) {
      let dbTx = (
        await this.transactionRepository.findById([transactionId])
      )[0]; //This must exist and be unique
      transactionData[transactionId] = {
        id: transactionId,
        multisig: contractAddressHex,
        txId: event.txId,
        proposer: dbTx.proposer,
        contractAddress: dbTx.contractAddress,
        selector: dbTx.selector,
        args: dbTx.args,
        value: dbTx.value,
        status: dbTx.status,
        error: dbTx.error,
        approvalCount: dbTx.approvalCount,
        rejectionCount: dbTx.rejectionCount,
        lastUpdatedTimestamp: dbTx.lastUpdatedTimestamp,
        lastUpdatedBlockNumber: dbTx.lastUpdatedBlockNumber,
      };

      existingTransactions.add(transactionId);
    }

    // Update the transaction
    transactionData[transactionId].lastUpdatedTimestamp = new Date(
      blockHeader.timestamp
    );
    transactionData[transactionId].lastUpdatedBlockNumber = blockHeader.height;
    transactionData[transactionId].status = TransactionStatus.CANCELLED;
  }

  private async handleApprove(
    contractAddressHex: string,
    event: multisig.Event_Approve,
    blockHeader: SubstrateBlock
  ) {
    const transactionId = contractAddressHex + "-" + event.txId;
    const newApprovalId =
      transactionId + "-" + uint8ArrayToHexString(event.owner);
    // Check if the tx is on memory. If not, fetch it from the DB
    if (!existingTransactions.has(transactionId)) {
      let dbTx = (await this.transactionRepository.findById([transactionId]))[0]; //This must exist and be unique
      transactionData[transactionId] = {
        id: transactionId,
        multisig: contractAddressHex,
        txId: dbTx.txId,
        proposer: dbTx.proposer,
        contractAddress: dbTx.contractAddress,
        selector: dbTx.selector,
        args: dbTx.args,
        value: dbTx.value,
        status: dbTx.status,
        error: dbTx.error,
        approvalCount: dbTx.approvalCount,
        rejectionCount: dbTx.rejectionCount,
        lastUpdatedTimestamp: dbTx.lastUpdatedTimestamp,
        lastUpdatedBlockNumber: dbTx.lastUpdatedBlockNumber,
      };

      existingTransactions.add(transactionId);
    }

    // Update the transaction
    transactionData[transactionId].approvalCount += 1;

    // Add the approval
    const newApproval: ApprovalOrRejectionRecord = {
      id: newApprovalId,
      transaction: transactionId,
      caller: ss58.codec(SS58_PREFIX).encode(event.owner),
      timestamp: new Date(blockHeader.timestamp),
      blockNumber:blockHeader.height,
    };

    approvals.push(newApproval);
  }

  private async handleReject(
    contractAddressHex: string,
    event: multisig.Event_Reject,
    blockHeader: SubstrateBlock
  ) {
    const transactionId = contractAddressHex + "-" + event.txId;
            const newRejectionId =
              transactionId + "-" + uint8ArrayToHexString(event.owner);
            // Check if the tx is on memory. If not, fetch it from the DB
            if (!existingTransactions.has(transactionId)) {
              let dbTx = (
                await this.transactionRepository.findById([transactionId])
              )[0]; //This must exist and be unique
              transactionData[transactionId] = {
                id: transactionId,
                multisig: contractAddressHex,
                txId: dbTx.txId,
                proposer: dbTx.proposer,
                contractAddress: dbTx.contractAddress,
                selector: dbTx.selector,
                args: dbTx.args,
                value: dbTx.value,
                status: dbTx.status,
                error: dbTx.error,
                approvalCount: dbTx.approvalCount,
                rejectionCount: dbTx.rejectionCount,
                lastUpdatedTimestamp: dbTx.lastUpdatedTimestamp,
                lastUpdatedBlockNumber: dbTx.lastUpdatedBlockNumber,
              };

              existingTransactions.add(transactionId);
            }

            // Update the transaction
            transactionData[transactionId].rejectionCount += 1;

            // Add the approval
            const newRejection: ApprovalOrRejectionRecord = {
              id: newRejectionId,
              transaction: transactionId,
              caller: ss58.codec(SS58_PREFIX).encode(event.owner),
              timestamp: new Date(blockHeader.timestamp),
              blockNumber: blockHeader.height,
            };

            rejections.push(newRejection);
  }

  private async fetchMultisigDataFromDB(contractAddressHex: string) {
    multisigData[contractAddressHex] = (
      await this.multisigRepository.findByAddressHex([contractAddressHex])
    )[0]; //This must exist and be unique

    // Set map to true to indicate that we have the content on multisigData
    existingMultisigs.set(contractAddressHex, true);
  }
}
