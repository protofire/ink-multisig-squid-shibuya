import { ProcessorContext } from "../processor";
import { MultisigRecord } from "../common/types";
import { Multisig } from "../model";
import { In } from "typeorm";
import { Store } from "@subsquid/typeorm-store";

export class MultisigRepository {
  private ctx: ProcessorContext<Store>;

  constructor(ctx: ProcessorContext<Store>) {
    this.ctx = ctx;
  }

  async updateOrCreate(multisigsRecords: MultisigRecord[]) {
    let multisigs: Multisig[] = [];

    multisigs = multisigsRecords.map((ms) => {
      const multisig = new Multisig({
        id: ms.id,
        addressSS58: ms.addressSS58,
        addressHex: ms.addressHex,
        deploymentSalt: ms.deploymentSalt,
        threshold: ms.threshold,
        owners: ms.owners,
        creationTimestamp: ms.creationTimestamp,
        creationBlockNumber: ms.creationBlockNumber,
      });

      return multisig;
    });

    await this.ctx.store.save(multisigs);
  }

  async findAll(): Promise<Multisig[]> {
    return await this.ctx.store.findBy(Multisig, {});
  }

  async findByAddressHex(
    multisigAddressesHex: string[]
  ): Promise<Multisig[]> {
    return await this.ctx.store.findBy(Multisig, {
      addressHex: In([...multisigAddressesHex]),
    });
  }
}
