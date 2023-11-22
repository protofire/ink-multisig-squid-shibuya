import { Block as BlockHeader } from "../processor";
import { TransferType } from "../model";
import { TransferRecord } from "../common/types";
import { transferRecords } from "../common/entityRecords";
import { SS58_PREFIX } from "../common/constants";
import * as ss58 from "@subsquid/ss58";
import { hexStringToUint8Array} from "../common/helpers";

export class TransferHandler {
  constructor() {}

  handleNativeTransfer(
    args: any,
    multisigAddress: string,
    txHash: string,
    blockHeader: BlockHeader
  ) {
    let from = hexStringToUint8Array(args.from);
    let to = hexStringToUint8Array(args.to);

    const transfer = {
      id: txHash,
      multisig: multisigAddress,
      from: ss58.codec(SS58_PREFIX).encode(from),
      to: ss58.codec(SS58_PREFIX).encode(to),
      value: BigInt(args.amount),
      transferType: TransferType.NATIVE,
      creationTimestamp: new Date(blockHeader.timestamp!),
      creationBlockNumber: blockHeader.height,
    } as TransferRecord;

    transferRecords.push(transfer);
  }
}
