import { existingMultisigs, multisigData } from "../common/entityRecords";
import { Block as BlockHeader } from "../processor";
import * as multisig_factory from "../abi/multisig_factory";
import * as ss58 from "@subsquid/ss58";
import { SS58_PREFIX } from "../common/constants";
import { uint8ArrayToHexString } from "../common/helpers";

export class MultisigFactoryEventHandler {
  constructor() {}

  handleEvent(evenData: string, blockHeader: BlockHeader) {
    const event = multisig_factory.decodeEvent(evenData);
    if (event.__kind === "NewMultisig") {
      this.handleNewMultisig(event, blockHeader);
    }
  }

  private handleNewMultisig(
    event: multisig_factory.Event_NewMultisig,
    blockHeader: BlockHeader
  ) {
    const multisigAddress = ss58
      .codec(SS58_PREFIX)
      .encode(event.multisigAddress);
    const multisigAddressHex = event.multisigAddress.toString();

    // Add to record
    multisigData[multisigAddressHex] = {
      id: multisigAddressHex,
      addressSS58: multisigAddress,
      addressHex: multisigAddressHex,
      deploymentSalt: event.salt.toString(),
      threshold: event.threshold,
      owners: event.ownersList.map((owner) =>
        ss58.codec(SS58_PREFIX).encode(owner)
      ),
      creationTimestamp: new Date(blockHeader.timestamp!),
      creationBlockNumber: blockHeader.height,
    };

    // Add to map
    existingMultisigs.set(multisigAddressHex, true);
  }
}
