import { Block as BlockHeader } from "../processor";
import { TransferType } from "../model";
import { TransferRecord } from "../common/types";
import { transferRecords } from "../common/entityRecords";
import { SS58_PREFIX } from "../common/constants";
import * as ss58 from "@subsquid/ss58";
import { hexStringToUint8Array } from "../common/helpers";
import * as psp22 from "../abi/psp22";
import { existingMultisigs } from "../common/entityRecords";

export class TransferHandler {
  constructor() {}

  handleNativeTransfer(
    args: any,
    multisigAddress: string,
    blockHeader: BlockHeader,
    eventId: string,
    txHash?: string
  ) {
    let from = hexStringToUint8Array(args.from);
    let to = hexStringToUint8Array(args.to);

    const transfer = {
      id: eventId,
      multisig: multisigAddress,
      from: ss58.codec(SS58_PREFIX).encode(from),
      to: ss58.codec(SS58_PREFIX).encode(to),
      value: BigInt(args.amount),
      transferType: TransferType.NATIVE,
      creationTimestamp: new Date(blockHeader.timestamp!),
      creationBlockNumber: blockHeader.height,
      txHash: txHash,
    } as TransferRecord;

    transferRecords.push(transfer);
  }

  handlePSP22Transfer(
    tokenAddressHex: string,
    caller: string,
    callData: string,
    txHash: string,
    blockHeader: BlockHeader
  ) {
    const message = psp22.decodeMessage(callData);
    let from;

    switch (message.__kind) {
      case "PSP22_transfer":
        from = ss58.codec(SS58_PREFIX).encode(caller);
        break;
      case "PSP22_transfer_from":
        from = ss58.codec(SS58_PREFIX).encode(message.from.toString());
        break;
      default:
        // This case should never happen because we already checked the selector
        return;
    }
    const to = ss58.codec(SS58_PREFIX).encode(message.to.toString());

    if (existingMultisigs.has(to)) {
      const transfer = {
        id: txHash,
        multisig: to,
        from,
        to,
        value: BigInt(message.value),
        transferType: TransferType.PSP22,
        tokenAddress: ss58.codec(SS58_PREFIX).encode(tokenAddressHex),
        creationTimestamp: new Date(blockHeader.timestamp!),
        creationBlockNumber: blockHeader.height,
      } as TransferRecord;
      transferRecords.push(transfer);
    }
  }
}
