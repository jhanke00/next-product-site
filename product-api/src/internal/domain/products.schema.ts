import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductsDocument = HydratedDocument<Products>;

@Schema()
export class Products {
  @Prop()
  _id: string;

  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  description: string;

  @Prop()
  category: string;

  @Prop()
  rating: number;

  @Prop()
  numReviews: number;

  @Prop()
  countInStock: number;
}

export const ProductsSchema = SchemaFactory.createForClass(Products);
