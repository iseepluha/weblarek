import { IOrderData , IApi , IResponseData, IProduct, IOrderResponse} from "../../types";

export class ProductAPI {
    constructor(private api: IApi) {}

    getProducts(): Promise<IProduct[]> {
        return this.api.get<IResponseData>('/product/').then(data => data.items);
    }

    createOrder(data: IOrderData): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', data);
    }
}

