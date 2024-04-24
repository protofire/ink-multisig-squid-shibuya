import { lookupArchive } from "@subsquid/archive-registry";
import {
  BlockHeader,
  DataHandlerContext,
  SubstrateBatchProcessor,
  SubstrateBatchProcessorFields,
  Event as _Event,
  Call as _Call,
  Extrinsic as _Extrinsic,
} from "@subsquid/substrate-processor";
import { FACTORY_DEPLOYMENT_BLOCK } from "./common/constants";

// Define the processor
export const processor = new SubstrateBatchProcessor()
  .setGateway("https://v2.archive.subsquid.io/network/shibuya-substrate")
  .setRpcEndpoint({
    url: "wss://shibuya.public.blastapi.io",
    rateLimit: 10,
  })
  .addContractsContractEmitted({
    extrinsic: true,
  })
  .addEvent({
    name: ["Balances.Transfer"],
    extrinsic: true,
  })
  .addEvent({
    name: ["Contracts.Called"],
    extrinsic: true,
    call: true,
  })
  .setFields({
    block: {
      timestamp: true,
    },
    extrinsic: {
      hash: true,
      success: true,
    },
    call: {
      args: true,
    },
  })
  .setBlockRange({
    from: FACTORY_DEPLOYMENT_BLOCK,
  });
//.useArchiveOnly();

export type Fields = SubstrateBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
