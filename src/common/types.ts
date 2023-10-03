import { TransactionStatus } from "../model";

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
  methodName: string | null | undefined;
  args: string;
  argsHumanReadable: Uint8Array | null | undefined;
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
