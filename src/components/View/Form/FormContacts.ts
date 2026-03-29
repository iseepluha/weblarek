import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { IForm } from "./Form";

interface IFormContacts extends IForm {
  email: string;
  phone: string;
}

export class FormContacts extends Form<IFormContacts> {
  protected emailElement: HTMLInputElement;
  protected phoneElement: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events, "contacts");
    this.emailElement = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this.phoneElement = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );
  }

  set email(value: string) {
    this.emailElement.value = value;
  }

  set phone(value: string) {
    this.phoneElement.value = value;
  }
}
