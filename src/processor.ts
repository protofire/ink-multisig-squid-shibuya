import { lookupArchive } from "@subsquid/archive-registry";
import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
} from "@subsquid/substrate-processor";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";

import { MultisigRepository } from "./repository/MultisigRepository";
import { TransactionRepository } from "./repository/TransactionRepository";
import { ApprovalRepository } from "./repository/ApprovalRepository";
import { RejectionRepository } from "./repository/RejectionRepository";
import { ExternalTransactionDataRepository } from "./repository/ExternalTransactionDataRepository";
import {
  existingMultisigs,
  multisigData,
  transactionData,
  approvals,
  rejections,
} from "./common/entityRecords";
import { MultisigFactoryEventHandler } from "./mappings/MultisigFactoryEventHandler";
import { MultisigEventHandler } from "./mappings/MultisigEventHandler";
import { FACTORY_ADDRESS, FACTORY_DEPLOYMENT_BLOCK} from "./common/constants";

// Define the processor
const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive("shibuya", { release: "FireSquid" }),
  })
  .setBlockRange({
    from: FACTORY_DEPLOYMENT_BLOCK,
  })
  .addContractsContractEmitted("*");

export type Item = BatchProcessorItem<typeof processor>;
export type Ctx = BatchContext<Store, Item>;

// Run the processor
processor.run(new TypeormDatabase(), async (ctx) => {
  // Initialize repositories
  const multisigRepository = new MultisigRepository(ctx);
  const transactionRepository = new TransactionRepository(
    ctx,
    multisigRepository
  );
  const externalTransactionDataRepository = new ExternalTransactionDataRepository(ctx);
  const approvalRepository = new ApprovalRepository(ctx, transactionRepository);
  const rejectionRepository = new RejectionRepository(
    ctx,
    transactionRepository
  );

  // Initialize handlers
  const multisigFactoryEventHandler = new MultisigFactoryEventHandler();
  const multisigEventHandler = new MultisigEventHandler(multisigRepository, transactionRepository, externalTransactionDataRepository);

  // Initialize existingMultisigs in order to know if the event received is related to a multisig
  if (existingMultisigs.size === 0) {
    await multisigRepository.findAll().then((multisigs) => {
      for (let multisig of multisigs) {
        existingMultisigs.set(multisig.addressHex, false);
      }
    });
  }

  // Main loop to process the data
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name === "Contracts.ContractEmitted") {
        const contractAddressHex = item.event.args.contract;
        // Factory Events
        if (contractAddressHex === FACTORY_ADDRESS) {
          multisigFactoryEventHandler.handleEvent(item.event.args.data, block.header);
        }
        // Multisigs Events
        else if (existingMultisigs.has(contractAddressHex)) {
          await multisigEventHandler.handleEvent(
            contractAddressHex,
            item.event.args.data,
            item.event.extrinsic.hash,
            block.header
          );
        }
      }
    }
  }

  // Save the data in the DB
  await multisigRepository.updateOrCreate(Object.values(multisigData));
  await transactionRepository.updateOrCreate(Object.values(transactionData));
  await approvalRepository.create(approvals);
  await rejectionRepository.create(rejections);
});

