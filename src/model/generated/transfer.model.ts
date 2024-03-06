import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Multisig} from "./multisig.model"
import {TransferType} from "./_transferType"

@Entity_()
export class Transfer {
    constructor(props?: Partial<Transfer>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Multisig, {nullable: true})
    multisig!: Multisig

    @Column_("text", {nullable: false})
    from!: string

    @Column_("text", {nullable: false})
    to!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    value!: bigint

    @Column_("varchar", {length: 6, nullable: false})
    transferType!: TransferType

    @Column_("text", {nullable: true})
    tokenAddress!: string | undefined | null

    @Column_("int4", {nullable: true})
    tokenDecimals!: number | undefined | null

    @Column_("timestamp with time zone", {nullable: false})
    creationTimestamp!: Date

    @Column_("int4", {nullable: false})
    creationBlockNumber!: number

    @Column_("text", {nullable: true})
    txHash!: string | undefined | null
}
