import { IBuyer, TErrors } from "../../types";

export class Buyer {
    private data: IBuyer = {
        payment: '',
        address: '',
        phone: '',
        email: ''
    }

    constructor(){};
    
    setData(newData: Partial<IBuyer>): void {
        this.data = {...this.data, ...newData}
    }

    getData(): IBuyer {
        return this.data;
    }

    clearData(): void {
        for (let key in this.data) {
            this.data[key as keyof IBuyer] = ''
        }
    }

    validate(): TErrors {
        const errors: TErrors = {};
        if (this.data.payment.trim() === '') {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (this.data.address.trim() === '') {
            errors.address = 'Укажите свой адрес';
        }

        if (this.data.phone.trim() === '') {
            errors.phone = 'Укажите свой номер телефона';
        }

        if (this.data.email.trim() === '') {
            errors.email = 'Укажите email';
        }

        return errors
    }
}