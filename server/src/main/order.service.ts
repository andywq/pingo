import { Injectable, Inject, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { OrderEntity, OrderStatus } from "./order.entity"
import { IPageReq, Pager } from "../lib/page"

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repo: Repository<OrderEntity>
  ) {}

  async list(params: IPageReq) {
    const res = await new Pager(params, this.repo).getPage2(
      null,
      "status",
      "DESC",
      "created_at",
      "DESC"
    )
    return res
  }

  async create(data: OrderEntity) {
    data.created_at = new Date()
    data.updated_at = data.created_at
    return this.repo.save(data)
  }

  async show(id: number) {
    const item = await this.repo.findOne(
      {
        id
      }
      // {
      //   relations: ["cover"]
      // }
    )

    if (item == null) {
      throw new NotFoundException()
    }

    return item
  }

  async update(data: OrderEntity) {
    const item = await this.show(data.id)

    return this.repo.save(data)
  }

  async remove(id: number) {
    try {
      const item = await this.show(id)
      await this.repo.remove(item)
    } catch (err) {
      throw err
    }

    return {}
  }
}
