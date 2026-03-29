import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface IForm {
  valid: boolean;
  errors: string;
}

export abstract class Form<T extends IForm> extends Component<T> {
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
}
