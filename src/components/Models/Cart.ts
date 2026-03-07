import { IProduct } from "../../types";

export class Cart {
    private items: IProduct[] = [];

    constructor() {}

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        this.items.push(item);
    }

    removeItem(item: IProduct): void {
        this.items.splice(this.items.findIndex(product => product.id === item.id), 1);
    }

    clearCart(): void {
         this.items = [];
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