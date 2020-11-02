import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import {
  getManager,
  Repository,
  Transaction,
  TransactionRepository
} from "typeorm"
import { IProduct, OrderEntity, OrderStatus } from "./order.entity"
import { AccountEntity } from "../account/account.entity"
import { ProductEntity } from "./product.entity"
import { ProductMemberService } from "./product_member.service"
import { ProductMemberEntity } from "./product_member.entity"

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repo: Repository<OrderEntity>,
    @InjectRepository(ProductMemberEntity)
    private readonly pmRepo: Repository<ProductMemberEntity>
  ) {}

  async listByUserId(userId, skip, limit) {
    let orders: OrderEntity[] = []
    try {
      orders = await this.repo
        .createQueryBuilder("order")
        .leftJoinAndSelect("order.creator", "c")
        .leftJoinAndSelect("order.members", "account")
        .where("account.id = :userId", { userId })
        // .orderBy("order.cr", "DESC")
        .orderBy("order.created_at", "DESC")
        .skip(skip)
        .limit(limit)
        .getMany()
    } catch (err) {
      console.error(err)
      throw new InternalServerErrorException(err)
    }

    return orders
  }

  async join(user: AccountEntity, share_code: string) {
    const item = await this.repo.findOne(
      {
        share_code
      },
      {
        relations: ["members"]
      }
    )

    item.members.push(user)

    return this.repo.save(item)
  }

  async create(user: AccountEntity, data: OrderEntity) {
    try {
      await getManager().transaction(async tm => {
        let m = new OrderEntity()
        m.title = data.title
        m.status = OrderStatus.Open
        m.created_at = new Date()
        m.updated_at = new Date()
        m.creator = user
        m.members = [user]
        m.products = []
        m.share_code = await this.getNewShareCode()

        m = await tm.save(m)

        for (const p of data.products) {
          let pm = new ProductEntity()
          pm.name = p.name
          pm.select_mode = p.select_mode
          pm.unit_price = p.unit_price
          pm.created_at = new Date()
          pm.updated_at = new Date()
          pm.desc = p.desc
          pm = await tm.save(pm)
          m.products.push(pm)
        }

        await tm.save(m)
      })
    } catch (err) {
      console.error(err)
      throw new InternalServerErrorException(err)
    }
  }

  async show(id: number) {
    let res: any = {}

    try {
      const item = await this.repo.findOne(id, {
        relations: ["creator", "members", "products"]
      })

      if (item == null) {
        throw new NotFoundException()
      }

      res = item

      const resProducts = []
      for (const p of item.products) {
        const pms = await this.pmRepo
          .createQueryBuilder("pm")
          .leftJoinAndSelect("pm.account", "account")
          .where("pm.product_id = :product_id", {
            product_id: p.id
          })
          .getMany()

        const pp = {
          ...p,
          members: pms
        }

        resProducts.push(pp)
      }
      res.products = resProducts

      return res
    } catch (err) {
      console.error(err)
      throw new InternalServerErrorException(err)
    }
  }

  // 只允许更新 title
  async update(data: OrderEntity) {
    try {
      const m = await this.repo.findOne(data.id)
      m.updated_at = new Date()
      m.title = data.title
      m.status = data.status

      this.repo.save(m)
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  async addMember(id: number, user: AccountEntity) {
    try {
      const order = await this.repo.findOne(id, {
        relations: ["members"]
      })

      const item = await this.show(id)
      item.updated_at = new Date()
      item.members.push(user)

      await this.repo.save(item)
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  async remove(id: number) {
    try {
      const item = await this.show(id)
      await this.repo.remove(item)
    } catch (err) {
      throw new InternalServerErrorException(err)
    }
  }

  async getNewShareCode() {
    // TODO 判断重复
    const dict = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ]

    const tmp = []
    for (let i = 0; i < 6; i++) {
      const pos = Math.round(Math.random() * (dict.length - 1))
      tmp.push(dict[pos])
    }
    return tmp.join("")
  }
}
