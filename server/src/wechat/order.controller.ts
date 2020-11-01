import {
  Controller,
  Get,
  Body,
  Inject,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  Req
} from "@nestjs/common"
import { OrderEntity, OrderStatus } from "../main/order.entity"
import { IPageReq } from "../lib/page"
import { AuthGuard } from "@nestjs/passport"
import { OrderService } from "src/main/order.service"
import { IRequest } from "./interfaces"

@Controller("/api/wechat/order")
export class OrderController {
  @Inject()
  service: OrderService

  @Get("/")
  @UseGuards(AuthGuard())
  list(
    @Req() request: IRequest,
    @Query()
    query: { skip: number; limit: number }
  ) {
    return this.service.listByUserId(request.user.id, query.skip, query.limit)
  }

  // @Post("/")
  // @UseGuards(AuthGuard())
  // create(@Body() data: OrderEntity) {
  //   return this.service.create(data)
  // }

  // @Get("/:id")
  // @UseGuards(AuthGuard())
  // show(@Param("id", ParseIntPipe) id: number) {
  //   return this.service.show(id)
  // }

  // @Patch("/:id")
  // @UseGuards(AuthGuard())
  // update(@Param("id", ParseIntPipe) id, @Body() data: OrderEntity) {
  //   data.id = id
  //   return this.service.update(data)
  // }

  // @Delete("/:id")
  // @UseGuards(AuthGuard())
  // remove(@Param("id", ParseIntPipe) id) {
  //   return this.service.remove(id)
  // }
}
