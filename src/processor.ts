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
  .setDataSource({
    archive: lookupArchive("shibuya", { release: "ArrowSquid" }),
    chain: {
      url: "wss://rpc.shibuya.astar.network",
    },
  })
  .addContractsContractEmitted({
    extrinsic: true,
  })
  .addEvent({
    name: ["Balances.Transfer"],
    extrinsic: true,
  })
  .setFields({
    block: {
      timestamp: true,
    },
    extrinsic: {
      hash: true,
    },
  })
  .setBlockRange({
    from: FACTORY_DEPLOYMENT_BLOCK,
  })
  //.useArchiveOnly();

export type Fields = SubstrateBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
