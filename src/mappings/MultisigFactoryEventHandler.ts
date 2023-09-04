import { existingMultisigs, multisigData } from "../common/entityRecords";
import { SubstrateBlock } from "@subsquid/substrate-processor";
import * as multisig_factory from "../abi/multisig_factory";
import * as ss58 from "@subsquid/ss58";
import { SS58_PREFIX } from "../common/constants";
import { uint8ArrayToHexString } from "../common/helpers";

export class MultisigFactoryEventHandler {

  constructor() {}

  handleEvent(
    evenData: string,
    blockHeader: SubstrateBlock
  ) {
    const event = multisig_factory.decodeEvent(evenData);
    if (event.__kind === "NewMultisig") {
      this.handleNewMultisig(event, blockHeader);
    }
  }
  
  private handleNewMultisig(
    event: multisig_factory.Event_NewMultisig,
    blockHeader: SubstrateBlock
  ) {
    const multisigAddress = ss58.codec(SS58_PREFIX).encode(event.multisigAddress);
    const multisigAddressHex = uint8ArrayToHexString(event.multisigAddress);
  
    // Add to record
    multisigData[multisigAddressHex] = {
      id: multisigAddressHex,
      addressSS58: multisigAddress,
      addressHex: multisigAddressHex,
      deploymentSalt: uint8ArrayToHexString(event.salt),
      threshold: event.threshold,
      owners: event.ownersList.map((owner) =>
        ss58.codec(SS58_PREFIX).encode(owner)
      ),
      creationTimestamp: new Date(blockHeader.timestamp),
      creationBlockNumber: blockHeader.height,
    };
  
    // Add to map
    existingMultisigs.set(multisigAddressHex, true);
  }
}
