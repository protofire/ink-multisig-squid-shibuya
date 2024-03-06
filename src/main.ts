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
import {
  FACTORY_ADDRESS,
  PSP22_TRANSFER_FROM_SELECTOR,
  PSP22_TRANSFER_SELECTOR,
} from "./common/constants";
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
    // Create hashmap of events from caller to array of contracts
    const callerToContracts = new Map<string, string[]>();
    for (const event of block.events) {
      if (event.name === "Contracts.Called") {
        const contractAddressHex = event.args.contract;
        const caller = event.args.caller.value;
        if (callerToContracts.has(caller)) {
          callerToContracts.get(caller)!.push(contractAddressHex);
        } else {
          callerToContracts.set(caller, [contractAddressHex]);
        }
      }
    }
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
            block.header,
            callerToContracts.get(contractAddressHex) || []
          );
        }
      } else if (event.name === "Balances.Transfer") {
        const { to } = event.args;
        if (existingMultisigs.has(to)) {
          transferHandler.handleNativeTransfer(
            event.args,
            to,
            block.header,
            event.id,
            event.extrinsic?.hash
          );
        }
      } else if (event.name === "Contracts.Called") {
        const contractAddressHex = event.args.contract;
        const messageSelector = event.call!.args.data.slice(0, 10);

        if (
          event.extrinsic?.success &&
          (messageSelector === PSP22_TRANSFER_SELECTOR ||
            messageSelector === PSP22_TRANSFER_FROM_SELECTOR)
        ) {
          transferHandler.handlePSP22Transfer(
            contractAddressHex,
            event.args.caller.value,
            event.call?.args.data,
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
