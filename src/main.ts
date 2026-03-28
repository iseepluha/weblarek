import "./scss/styles.scss";

import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { ProductAPI } from "./components/Models/ProductAPI";
import { Catalog } from "./components/Models/Catalog";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { Header } from "./components/View/Header";
import { Modal } from "./components/View/Modal";
import { Basket } from "./components/View/Basket";
import { CardCatalog, CardPreview, CardBasket } from "./components/View/Card";
import { FormOrder, FormContacts } from "./components/View/Form";
import { Success } from "./components/View/Success";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { API_URL, CDN_URL } from "./utils/constants";
import { IBuyer, IProduct } from "./types";

const events = new EventEmitter();

const catalogModel = new Catalog(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

const galleryElement = ensureElement<HTMLElement>(".gallery");
const modalElement = ensureElement<HTMLElement>("#modal-container");
const headerElement = ensureElement<HTMLElement>(".header");

const header = new Header(headerElement, events);
const modal = new Modal(modalElement, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const formOrder = new FormOrder(cloneTemplate(orderTemplate), events);
const formContacts = new FormContacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

//Запрос к серверу за массивом товаров в каталоге.
const api = new Api(API_URL);
const productApi = new ProductAPI(api);
productApi
  .getProducts()
  .then((products) => {
    catalogModel.setItems(products);
    console.log("Полученные данные от сервера: ", catalogModel.getItems());
  })
  .catch((error) => console.error("Ошибка при загрузке каталога: ", error));

events.on("catalog:changed", () => {
  const cards = catalogModel.getItems().map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit("card:select", item),
    });
    return card.render({
      ...item,
      image: CDN_URL + item.image,
    });
  });
  galleryElement.replaceChildren(...cards);
});

events.on("card:select", (item: IProduct) => {
  catalogModel.setSelectedItem(item);
});

events.on("preview:changed", () => {
  const selectedItem = catalogModel.getSelectedItem();
  if (!selectedItem) return;

  const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      if (cartModel.hasItem(selectedItem.id)) {
        cartModel.removeItem(selectedItem);
      } else {
        cartModel.addItem(selectedItem);
      }

      cardPreview.inCart = cartModel.hasItem(selectedItem.id);
    },
  });

  modal.open();
  modal.content = cardPreview.render({
    ...selectedItem,
    image: CDN_URL + selectedItem.image,
    inCart: cartModel.hasItem(selectedItem.id),
  });
});

events.on("cart:changed", () => {
  header.counter = cartModel.getCount();

  const cards = cartModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => cartModel.removeItem(item),
    });
    return card.render({
      ...item,
      index: index + 1,
    });
  });

  basket.render({
    items: cards,
    total: cartModel.getTotal(),
  });
});

events.on("basket:open", () => {
  const cards = cartModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => cartModel.removeItem(item),
    });
    return card.render({ ...item, index: index + 1 });
  });
  modal.content = basket.render({
    items: cards,
    total: cartModel.getTotal(),
  });
  modal.open();
});

events.on("order:open", () => {
  modal.open();
  modal.content = formOrder.render({
    valid: false,
    errors: "",
  });
});

events.on("order:submit", () => {
  modal.content = formContacts.render({
    valid: false,
    errors: "",
  });
});

events.on("form:changed", (data: { field: keyof IBuyer; value: string }) => {
  buyerModel.setData({ [data.field]: data.value } as Partial<IBuyer>);
});

events.on("buyer:changed", () => {
  const errors = buyerModel.validate();
  formOrder.render({
    valid: !errors.payment && !errors.address,
    errors: errors.payment || errors.address || "",
  });
  formOrder.payment = buyerModel.getData().payment;
  formContacts.render({
    valid: !errors.email && !errors.phone,
    errors: errors.email || errors.phone || "",
  });
});

events.on("contacts:submit", () => {
  const orderData = {
    ...buyerModel.getData(),
    items: cartModel.getItems().map((item) => item.id),
    total: cartModel.getTotal(),
  };

  productApi
    .createOrder(orderData)
    .then((result) => {
      modal.content = success.render({ total: result.total });
      cartModel.clearCart();
      buyerModel.clearData();
      formOrder.reset();
      formContacts.reset();
    })
    .catch((error) => console.error("Ошибка при оформлении заказа: ", error));
});

events.on("success:close", () => {
  modal.close();
});
