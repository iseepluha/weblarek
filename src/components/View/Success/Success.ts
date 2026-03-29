import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  buttonElement: HTMLButtonElement;
  totalElement: HTMLElement;
  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );
    this.totalElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );

    this.buttonElement.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  set total(value: number) {
    this.totalElement.textContent = `Списано ${value} синапсов`;
  }
}
