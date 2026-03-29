import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

interface IBasket {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket> {
  protected basketElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected priceElement: HTMLElement;
  constructor(
    container: HTMLElement,
    private events: IEvents,
  ) {
    super(container);

    this.basketElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );

    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );

    this.priceElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );

    this.buttonElement.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }

  set items(items: HTMLElement[]) {
    this.basketElement.replaceChildren(...items);
    this.buttonElement.disabled = !items.length;
    
  }

  set total(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }
}
