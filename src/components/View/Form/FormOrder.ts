import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { TPayment } from "../../../types";
import { IForm } from "./Form";

interface IFormOrder extends IForm {
  address: string;
  payment: TPayment;
}

export class FormOrder extends Form<IFormOrder> {
  protected buttonCardElement: HTMLButtonElement;
  protected buttonCashElement: HTMLButtonElement;
  protected addressElement: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events, "order");

    this.addressElement = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    );

    this.buttonCardElement = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container,
    );
    this.buttonCashElement = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container,
    );

    this.buttonCardElement.addEventListener("click", (event) => {
      const target = event.target as HTMLButtonElement;
      this.events.emit("form:changed", {
        field: "payment",
        value: target.name,
      });
    });

    this.buttonCashElement.addEventListener("click", (event) => {
      const target = event.target as HTMLButtonElement;
      this.events.emit("form:changed", {
        field: "payment",
        value: target.name,
      });
    });
  }

  set address(value: string) {
    this.addressElement.value = value;
  }

  set payment(value: TPayment) {
    this.buttonCardElement.classList.toggle(
      "button_alt-active",
      value === "card",
    );
    this.buttonCashElement.classList.toggle(
      "button_alt-active",
      value === "cash",
    );
  }
}
