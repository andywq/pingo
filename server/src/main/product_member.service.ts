import {
  Injectable,
  NotFoundException,
  InternalServerErrorException
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ProductMemberEntity } from "./product_member.entity"

@Injectable()
export class ProductMemberService {
  constructor(
    @InjectRepository(ProductMemberEntity)
    private readonly repo: Repository<ProductMemberEntity>
  ) {}

  async createOrUpdate(
    order_id: number,
    product_id: number,
    account_id: number,
    buy_number: number
  ) {
    try {
      const m = new ProductMemberEntity()
      m.order = { id: order_id } as any
      m.product = { id: product_id } as any
      m.account = { id: account_id } as any
      m.buy_number = buy_number

      await this.repo.save(m)
    } catch (err) {
      console.error(err)
      throw new InternalServerErrorException(err)
    }
  }

  async remove(product_id: number, account_id: number) {
    try {
      const p = await this.repo.findOne({
        product: { id: product_id },
        account: { id: account_id }
      })

      if (!p) {
        throw new NotFoundException()
      }

      await this.repo.delete(p)
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err
      }

      console.error(err)
      throw new InternalServerErrorException(err)
    }
  }

  async sumNumberByOrderId(orderId: number) {
    const pms = await this.repo
      .createQueryBuilder("pm")
      .leftJoinAndSelect("pm.product", "p")
      .where("p.id = pm.product_id")
      .andWhere("pm.order_id = :orderId", {
        orderId
      })
      .getMany()

    return pms.reduce((t, i) => t + i.buy_number * i.product.unit_price, 0)
  }
}
