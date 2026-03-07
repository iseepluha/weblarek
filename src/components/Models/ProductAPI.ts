import { IOrderData , IApi , IResponseData, IProduct, IOrderResponse} from "../../types";

export class ProductAPI {
    constructor(private api: IApi) {}

    get(): Promise<IProduct[]> {
        return this.api.get<IResponseData>('/product/').then(data => data.items);
    }

    post(data: IOrderData): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', data);
    }
}

