import { Injectable, Inject } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { AccountEntity } from "./account.entity"
import { Repository } from "typeorm"

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepo: Repository<AccountEntity>
  ) {}

  async findByWXOpenId(wx_open_id: string) {
    return await this.accountRepo.findOne({
      wx_open_id
    })
  }

  async saveOrUpdate(account: AccountEntity) {
    return this.accountRepo.save(account)
  }

  async removeById(id: number) {
    return this.accountRepo.delete({
      id
    })
  }
}
