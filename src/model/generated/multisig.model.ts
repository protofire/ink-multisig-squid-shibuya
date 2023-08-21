import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {Transaction} from "./transaction.model"

@Entity_()
export class Multisig {
    constructor(props?: Partial<Multisig>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    addressSS58!: string

    @Column_("text", {nullable: false})
    addressHex!: string

    @Column_("text", {nullable: false})
    deploymentSalt!: string

    @Column_("int4", {nullable: false})
    threshold!: number

    @Column_("text", {array: true, nullable: false})
    owners!: (string)[]

    @Column_("timestamp with time zone", {nullable: false})
    creationTimestamp!: Date

    @Column_("int4", {nullable: false})
    creationBlockNumber!: number

    @OneToMany_(() => Transaction, e => e.multisig)
    transactions!: Transaction[]
}
