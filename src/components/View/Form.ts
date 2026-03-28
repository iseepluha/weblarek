import { TPayment } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IForm {
  valid: boolean;
  errors: string;
}

abstract class Form extends Component<IForm> {
  protected buttonElement: HTMLButtonElement;
  protected errorsElement: HTMLElement;
  constructor(
    container: HTMLElement,
    protected events: IEvents,
    protected eventName: string,
  ) {
    super(container);

    this.buttonElement = ensureElement<HTMLButtonElement>(
      "button[type=submit]",
      this.container,
    );
    this.errorsElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );

    this.container.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;
      this.events.emit("form:changed", {
        field: target.name,
        value: target.value,
      });
    });

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit(`${eventName}:submit`);
    });
  }

  set valid(value: boolean) {
    this.buttonElement.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }

  reset() {
    (this.container as HTMLFormElement).reset();
  }
}

export class FormOrder extends Form {
  protected buttonCardElement: HTMLButtonElement;
  protected buttonCashElement: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events, "order");

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

  set payment(value: TPayment) {
    switch (value) {
      case "card":
        this.buttonCardElement.classList.add("button_alt-active");
        this.buttonCashElement.classList.remove("button_alt-active");
        break;
      case "cash":
        this.buttonCashElement.classList.add("button_alt-active");
        this.buttonCardElement.classList.remove("button_alt-active");
    }
  }
}

export class FormContacts extends Form {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events, "contacts");
  }
}
