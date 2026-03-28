import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Cart {
    private items: IProduct[] = [];

    constructor(private events: IEvents) {}

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        this.items.push(item);
        this.events.emit('cart:changed')
    }

    removeItem(item: IProduct): void {
        this.items.splice(this.items.findIndex(product => product.id === item.id), 1);
        this.events.emit('cart:changed')
    }

    clearCart(): void {
         this.items = [];
         this.events.emit('cart:changed')
    }

    getTotal(): number {
        return this.items.reduce((acc, current) => acc + (current.price ?? 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}