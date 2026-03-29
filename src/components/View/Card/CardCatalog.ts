import { categoryMap } from "../../../utils/constants";
import { ICard } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";
import { ICardActions } from "./Card";

export type CategoryKey = keyof typeof categoryMap;

export interface ICardCatalog extends ICard {
  image: string;
  category: string;
}

export class CardCatalog extends Card<ICardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value,
      );
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, value);
  }
}
