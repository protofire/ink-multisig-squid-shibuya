import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Multisig} from "./multisig.model"
import {TransactionStatus} from "./_transactionStatus"
import {Approval} from "./approval.model"
import {Rejection} from "./rejection.model"

@Entity_()
export class Transaction {
    constructor(props?: Partial<Transaction>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Multisig, {nullable: true})
    multisig!: Multisig

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    txId!: bigint

    @Column_("text", {nullable: false})
    proposer!: string

    @Column_("text", {nullable: false})
    contractAddress!: string

    @Column_("text", {nullable: false})
    selector!: string

    @Column_("text", {nullable: false})
    args!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    value!: bigint

    @Column_("varchar", {length: 16, nullable: false})
    status!: TransactionStatus

    @Column_("text", {nullable: true})
    error!: string | undefined | null

    @OneToMany_(() => Approval, e => e.transaction)
    approvals!: Approval[]

    @OneToMany_(() => Rejection, e => e.transaction)
    rejections!: Rejection[]

    @Column_("int4", {nullable: false})
    approvalCount!: number

    @Column_("int4", {nullable: false})
    rejectionCount!: number

    @Column_("timestamp with time zone", {nullable: false})
    lastUpdatedTimestamp!: Date

    @Column_("int4", {nullable: false})
    lastUpdatedBlockNumber!: number
}
