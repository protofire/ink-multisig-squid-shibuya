import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Multisig {
    constructor(props?: Partial<Multisig>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    address!: string

    @Column_("int4", {nullable: false})
    threshold!: number

    @Column_("text", {array: true, nullable: false})
    owners!: (string)[]
}
