import { lookupArchive } from "@subsquid/archive-registry"
import * as ss58 from "@subsquid/ss58"
import {toHex} from "@subsquid/util-internal-hex"
import {BatchContext, BatchProcessorItem, SubstrateBatchProcessor} from "@subsquid/substrate-processor"
import {Store, TypeormDatabase} from "@subsquid/typeorm-store"
import {In} from "typeorm"
import * as multisig_factory from "./abi/multisig_factory"
import {Multisig, MultisigFactory} from "./model"
 

const CONTRACT_ADDRESS_SS58 = 'XYmu1eoskyj83bSWqhTW2DUzuRCHHgrFGXUv3yxhBVBd3tT'
const CONTRACT_ADDRESS = toHex(ss58.decode(CONTRACT_ADDRESS_SS58).bytes)
const SS58_PREFIX = ss58.decode(CONTRACT_ADDRESS_SS58).prefix
 
const processor = new SubstrateBatchProcessor()
    .setDataSource({
        archive: lookupArchive("shibuya", { release: "FireSquid" })
    })
    .addContractsContractEmitted(CONTRACT_ADDRESS, {
        data: {
            event: {args: true}
        }
    } as const)
 
type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>
 
processor.run(new TypeormDatabase(), async ctx => {
    const newMultisigs = extractMultisigRecords(ctx)
 
    const multisigs = newMultisigs.map(ms => {
        const multisig = new Multisig({
            id: ms.id,
            address: ms.address,
            threshold: ms.threshold,
            owners: ms.owners,
            creationTimestamp: ms.creationTimestamp,
            creationBlockNumber: ms.creationBlockNumber
        })
 
        return multisig
    })
 
    await ctx.store.insert(multisigs)
})
 
interface MultisigRecord {
    id: string
    address: string
    threshold: number
    owners: string[]
    creationTimestamp: Date
    creationBlockNumber: number
}

function extractMultisigRecords(ctx: Ctx): MultisigRecord[] {
    const records: MultisigRecord[] = []
    for (const block of ctx.blocks) {
        for (const item of block.items) {
            if (item.name === 'Contracts.ContractEmitted' && item.event.args.contract === CONTRACT_ADDRESS) {
                const event = multisig_factory.decodeEvent(item.event.args.data)
                if (event.__kind === 'NewMultisig') {
                    records.push({
                        id: item.event.id,
                        address: ss58.codec(SS58_PREFIX).encode(event.multisigAddress),
                        threshold: event.threshold,
                        owners: event.ownersList.map(owner => ss58.codec(SS58_PREFIX).encode(owner)),
                        creationTimestamp: new Date(block.header.timestamp),
                        creationBlockNumber: block.header.height
                    })
                }
            }
        }
    }
    return records
}
 
