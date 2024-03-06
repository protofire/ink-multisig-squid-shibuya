import { TransactionStatus, TransferType } from "../model";

export interface MultisigRecord {
  id: string;
  addressSS58: string;
  addressHex: string;
  deploymentSalt: string;
  threshold: number;
  owners: string[];
  creationTimestamp: Date;
  creationBlockNumber: number;
}

export interface TransactionRecord {
  id: string;
  proposalTxHash: string;
  executionTxHash: string | null | undefined;
  multisig: string;
  txId: bigint;
  proposer: string;
  contractAddress: string;
  selector: string;
  args: string;
  value: bigint;
  externalTransactionData: string | null | undefined;
  status: TransactionStatus;
  error: string | null | undefined;
  approvalCount: number;
  rejectionCount: number;
  creationTimestamp: Date;
  creationBlockNumber: number;
  lastUpdatedTimestamp: Date;
  lastUpdatedBlockNumber: number;
}

export interface ApprovalOrRejectionRecord {
  id: string;
  transaction: string;
  caller: string;
  timestamp: Date;
  blockNumber: number;
}

export interface TransferRecord {
  id: string;
  multisig: string;
  from: string;
  to: string;
  value: bigint;
  transferType: TransferType;
  tokenAddress: string | null | undefined;
  tokenDecimals: number | null | undefined;
  creationTimestamp: Date;
  creationBlockNumber: number;
  txHash: string | undefined;
}
