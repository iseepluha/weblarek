// src/components/view/Page.ts
import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

interface IPage {
  catalog: HTMLElement[];
}

export class Page extends Component<IPage> {
  protected galleryElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.galleryElement = ensureElement<HTMLElement>(
      ".gallery",
      this.container,
    );
  }

  set catalog(items: HTMLElement[]) {
    this.galleryElement.replaceChildren(...items);
  }
}
