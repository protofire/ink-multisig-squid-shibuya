import { MultisigRecord, TransactionRecord, ApprovalOrRejectionRecord } from "./types";

const existingMultisigs: Map<string, boolean> = new Map<string, boolean>(); //Map that contains the multisig address and a boolean that indicates if we have the content on multisigData
const multisigData: Record<string, MultisigRecord> = {};

const existingTransactions: Set<string> = new Set<string>();
const transactionData: Record<string, TransactionRecord> = {};

const approvals: ApprovalOrRejectionRecord[] = [];
const rejections: ApprovalOrRejectionRecord[] = [];

export { existingMultisigs, multisigData, existingTransactions, transactionData, approvals, rejections}