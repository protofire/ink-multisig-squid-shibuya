import { MultisigRecord, TransactionRecord, ApprovalOrRejectionRecord, TransferRecord } from "./types";

const existingMultisigs: Map<string, boolean> = new Map<string, boolean>(); //Map that contains the multisig address and a boolean that indicates if we have the content on multisigData
const multisigData: Record<string, MultisigRecord> = {};

const existingTransactions: Set<string> = new Set<string>();
const transactionData: Record<string, TransactionRecord> = {};

const approvals: ApprovalOrRejectionRecord[] = [];
const rejections: ApprovalOrRejectionRecord[] = [];

const transferRecords: TransferRecord[] = [];

export { existingMultisigs, multisigData, existingTransactions, transactionData, approvals, rejections, transferRecords}