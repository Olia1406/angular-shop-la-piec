import { IOrder } from '../interfaces/order.interface';
import { IProduct } from '../interfaces/product.interface';
export class Order implements IOrder {
    constructor(
        public id: number,
        public userName: string,
        public userPhone: string,
        public userCity: string,
        public userStreet: string,
        public userHouse: string,
        public userComment: string,
        public totalPayment: number,
        public productOrder: Array<IProduct>,
        // public dateOrder: Date,
        public dateOrder: any,
        public statusOrder: string = 'B обробці',
    ) {}
}
