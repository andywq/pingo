import {
  Controller,
  Get,
  Body,
  Inject,
  Param,
  Delete,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  Req,
  Put,
  Res,
  HttpStatus
} from "@nestjs/common"
import { OrderEntity, OrderStatus } from "../main/order.entity"
import { AuthGuard } from "@nestjs/passport"
import { OrderService } from "../main/order.service"
import { IRequest } from "./interfaces"
import { ProductService } from "../main/product.service"
import { ProductMemberService } from "../main/product_member.service"
import { ProductEntity } from "../main/product.entity"
import { WechatService } from "./wechat.service"
import { Response } from "express"

@Controller("/api/wechat/order")
export class OrderController {
  @Inject()
  orderServ: OrderService

  @Inject()
  wechatServ: WechatService

  @Inject()
  productServ: ProductService

  @Inject()
  productMemberServ: ProductMemberService

  @Get("/")
  @UseGuards(AuthGuard())
  async list(
    @Req() request: IRequest,
    @Query()
    query: { skip: number; limit: number }
  ) {
    const orders = await this.orderServ.listByUserId(
      request.user.id,
      query.skip,
      query.limit
    )

    const res = []

    for (const o of orders) {
      const total = await this.productMemberServ.sumNumberByOrderId(o.id)
      res.push({
        ...o,
        total
      })
    }

    return res
  }

  @Post("/")
  @UseGuards(AuthGuard())
  async create(
    @Req() request: IRequest,
    @Res() response: Response,
    @Body() data: OrderEntity
  ) {
    try {
      const msgCheck = JSON.stringify(data)
      await this.wechatServ.msgSecCheck(msgCheck)
    } catch (err) {
      response.status(HttpStatus.BAD_REQUEST).send("含违规内容，请修改后重试")
      return
    }

    return this.orderServ.create(request.user, data)
  }

  @Post("/join")
  @UseGuards(AuthGuard())
  join(@Req() request: IRequest, @Body() data: { code: string }) {
    return this.orderServ.join(request.user, data.code)
  }

  @Get("/:id")
  @UseGuards(AuthGuard())
  async show(@Req() request: IRequest, @Param("id", ParseIntPipe) id: number) {
    const order = await this.orderServ.show(id)

    if (!order.members.find(v => v.id === request.user.id)) {
      // 如果这个人不在这个订单中，自动加入订单
      await this.orderServ.addMember(id, request.user)
    }

    return order
  }

  @Put("/:id")
  @UseGuards(AuthGuard())
  async update(
    @Res() response: Response,
    @Param("id", ParseIntPipe) id,
    @Body() data: OrderEntity
  ) {
    try {
      const msgCheck = JSON.stringify(data)
      await this.wechatServ.msgSecCheck(msgCheck)
    } catch (err) {
      response.status(HttpStatus.BAD_REQUEST).send("含违规内容，请修改后重试")
      return
    }

    data.id = id
    return this.orderServ.update(data)
  }

  @Delete("/:id")
  @UseGuards(AuthGuard())
  remove(@Param("id", ParseIntPipe) id) {
    return this.orderServ.remove(id)
  }

  @Post("/:id/close")
  @UseGuards(AuthGuard())
  async close(@Param("id", ParseIntPipe) id) {
    const m = await this.orderServ.show(id)
    m.status = OrderStatus.Closed
    return this.orderServ.update(m)
  }

  // 订单商品
  @Post("/:id/product")
  @UseGuards(AuthGuard())
  async addProduct(
    @Res() response: Response,
    @Param("id", ParseIntPipe) id: number,
    @Body() data: ProductEntity
  ) {
    try {
      const msgCheck = JSON.stringify(data)
      await this.wechatServ.msgSecCheck(msgCheck)
    } catch (err) {
      response.status(HttpStatus.BAD_REQUEST).send("含违规内容，请修改后重试")
      return
    }

    return this.productServ.create(id, data)
  }

  @Put("/:id/product/:productId")
  @UseGuards(AuthGuard())
  async updateProduct(
    @Res() response: Response,
    @Param("id", ParseIntPipe) id: number,
    @Param("productId", ParseIntPipe) productId: number,
    @Body() data: ProductEntity
  ) {
    try {
      const msgCheck = JSON.stringify(data)
      await this.wechatServ.msgSecCheck(msgCheck)
    } catch (err) {
      response.status(HttpStatus.BAD_REQUEST).send("含违规内容，请修改后重试")
      return
    }

    return this.productServ.update(data)
  }

  @Delete("/:id/product/:productId")
  @UseGuards(AuthGuard())
  removeProduct(
    @Param("id", ParseIntPipe) id: number,
    @Param("productId", ParseIntPipe) productId: number
  ) {
    return this.productServ.remove(productId)
  }

  // 用户商品订单信息
  @Put("/:id/product/:productId/member")
  @UseGuards(AuthGuard())
  updateUserProductInfo(
    @Req() request: IRequest,
    @Param("id", ParseIntPipe) id: number,
    @Param("productId", ParseIntPipe) productId: number,
    @Body() data: { buy_number: number }
  ) {
    return this.productMemberServ.createOrUpdate(
      id,
      productId,
      request.user.id,
      data.buy_number
    )
  }

  // 用户商品订单信息
  @Delete("/:id/product/:productId/member")
  @UseGuards(AuthGuard())
  removeUserProductInfo(
    @Req() request: IRequest,
    @Param("id", ParseIntPipe) id: number,
    @Param("productId", ParseIntPipe) productId: number
  ) {
    return this.productMemberServ.remove(productId, request.user.id)
  }
}
