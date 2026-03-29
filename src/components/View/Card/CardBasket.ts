import { ICard } from "./Card";
import { Card } from "./Card";
import { ICardActions } from "./Card";
import { ensureElement } from "../../../utils/utils";

interface ICardBasket extends ICard {
  index: number;
}

export class CardBasket extends Card<ICardBasket> {
  protected indexElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );

    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );
    if (actions?.onClick) {
      this.buttonElement.addEventListener("click", actions.onClick);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = value.toString();
  }
}
