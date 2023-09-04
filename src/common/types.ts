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
  multisig: string;
  txId: bigint;
  proposer: string;
  contractAddress: string;
  selector: string;
  args: string;
  value: bigint;
  status: TransactionStatus;
  error: string | null | undefined;
  approvalCount: number;
  rejectionCount: number;
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
