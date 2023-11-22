import { TypeormDatabase } from "@subsquid/typeorm-store";
import { MultisigRepository } from "./repository/MultisigRepository";
import { TransactionRepository } from "./repository/TransactionRepository";
import { ApprovalRepository } from "./repository/ApprovalRepository";
import { RejectionRepository } from "./repository/RejectionRepository";
import { ExternalTransactionDataRepository } from "./repository/ExternalTransactionDataRepository";
import { TransferRepository } from "./repository/TransferRepository";
import {
  existingMultisigs,
  multisigData,
  transactionData,
  approvals,
  rejections,
  transferRecords,
} from "./common/entityRecords";
import { MultisigFactoryEventHandler } from "./mappings/MultisigFactoryEventHandler";
import { MultisigEventHandler } from "./mappings/MultisigEventHandler";
import { FACTORY_ADDRESS } from "./common/constants";
import { processor } from "./processor";
import { TransferHandler } from "./mappings/TransferHandler";

// Run the processor
processor.run(new TypeormDatabase(), async (ctx) => {
  // Initialize repositories
  const multisigRepository = new MultisigRepository(ctx);
  const externalTransactionDataRepository =
    new ExternalTransactionDataRepository(ctx);
  const transactionRepository = new TransactionRepository(
    ctx,
    multisigRepository,
    externalTransactionDataRepository
  );
  const approvalRepository = new ApprovalRepository(ctx, transactionRepository);
  const rejectionRepository = new RejectionRepository(
    ctx,
    transactionRepository
  );
  const transferRepository = new TransferRepository(ctx, multisigRepository);

  // Initialize handlers
  const multisigFactoryEventHandler = new MultisigFactoryEventHandler();
  const multisigEventHandler = new MultisigEventHandler(
    multisigRepository,
    transactionRepository,
    externalTransactionDataRepository
  );
  const transferHandler = new TransferHandler();

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
    for (const event of block.events) {
      if (event.name === "Contracts.ContractEmitted") {
        const contractAddressHex = event.args.contract;
        // Factory Events
        if (contractAddressHex === FACTORY_ADDRESS) {
          multisigFactoryEventHandler.handleEvent(
            event.args.data,
            block.header
          );
        }
        // Multisigs Events
        else if (existingMultisigs.has(contractAddressHex)) {
          await multisigEventHandler.handleEvent(
            contractAddressHex,
            event.args.data,
            event.extrinsic!.hash,
            block.header
          );
        }
      } else if (event.name === "Balances.Transfer") {
        const { from, to } = event.args;

        if (existingMultisigs.has(from) || existingMultisigs.has(to)) {
          const multisigAddress = existingMultisigs.has(from) ? from : to;

          transferHandler.handleNativeTransfer(
            event.args,
            multisigAddress,
            event.extrinsic!.hash,
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
  await transferRepository.create(transferRecords);
});
