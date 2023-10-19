import { Ctx } from "../processor";
import { Transfer } from "../model";
import { MultisigRepository } from "./MultisigRepository";
import { TransferRecord } from "../common/types";
import { toEntityMap } from "../common/helpers";
import { assertNotNull } from "@subsquid/substrate-processor";

export class TransferRepository {
  private ctx: Ctx;
    private multisigRepository: MultisigRepository;

  constructor(ctx: Ctx, multisigRepository: MultisigRepository) {
    this.ctx = ctx;
    this.multisigRepository = multisigRepository;
  }

  async create(transferRecords: TransferRecord[]){
    
    let multisigAddressesHex = new Set<string>();
    for (let t of transferRecords) {
      multisigAddressesHex.add(t.multisig);
    }

    let multisigs = await this.multisigRepository.findByAddressHex(
        [...multisigAddressesHex]
    ).then(toEntityMap);
    
    let transfers: Transfer[] = [];
    
    transfers = transferRecords.map((t) => {
        let multisig = assertNotNull(multisigs.get(t.multisig));
        const transfer = new Transfer({
            id: t.id,
            multisig: multisig,
            from: t.from,
            to: t.to,
            value: t.value,
            transferType: t.transferType,
            creationTimestamp: t.creationTimestamp,
            creationBlockNumber: t.creationBlockNumber,
        });

        return transfer;
        });

    await this.ctx.store.save(transfers);
  }
}
