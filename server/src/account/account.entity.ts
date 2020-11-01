import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity("account")
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({
    unique: true,
    nullable: false
  })
  wx_open_id: string // 微信

  @Column()
  avatar_url

  @Column("longtext")
  description: string
}
