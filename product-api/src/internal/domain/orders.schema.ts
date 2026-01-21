import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Users } from './users.schema';

export type OrdersDocument = HydratedDocument<Orders>;

@Schema()
export class Orders {
  @Prop({ type: String, ref: 'Users' })
  user: Users;

  @Prop(
    raw({
      product: { type: String, ref: 'Products' },
      count: { type: Number },
    }),
  )
  items: Record<string, any>[];

  @Prop()
  rating: number;

  @Prop()
  total: number;

  @Prop()
  time: Date;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);
