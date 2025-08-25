import { OrderItem } from 'src/orders/entity/order-item.entity';
import { Category } from 'src/products/entity/category.entity';
import { Review } from 'src/reviews/entity/review.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column({ length: 100, unique: true })
  sku: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => OrderItem, (item) => item.product)
  orderItems: OrderItem[];
}
