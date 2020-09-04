import { IProduct } from './product.interface';
export interface IOrder {
    id: number;
    userName: string;
    userPhone: string;
    userCity: string;
    userStreet: string;
    userHouse: string;
    userComment: string;
    totalPayment: number;
    productOrder: Array<IProduct>;
    // dateOrder: Date;
    dateOrder: any;
    statusOrder: string;
}
