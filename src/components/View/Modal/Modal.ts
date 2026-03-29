import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected contentElement: HTMLElement;
  protected button: HTMLButtonElement;
  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );
    this.button = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );

    this.button.addEventListener("click", () => {
      this.close();
    });
    this.container.addEventListener("click", () => {
      this.close();
    });
    ensureElement<HTMLElement>(
      ".modal__container",
      this.container,
    ).addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  open(): void {
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
  }

  set content(content: HTMLElement) {
    this.contentElement.replaceChildren(content);
  }
}
