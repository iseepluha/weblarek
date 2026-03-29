import "./scss/styles.scss";

import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { ProductAPI } from "./components/Models/ProductAPI";
import { Catalog } from "./components/Models/Catalog";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { Header } from "./components/View/Header/Header";
import { Modal } from "./components/View/Modal/Modal";
import { Basket } from "./components/View/Basket/Basket";
import { CardCatalog } from "./components/View/Card/CardCatalog";
import { CardPreview } from "./components/View/Card/CardPreview";
import { CardBasket } from "./components/View/Card/CardBasket";
import { FormOrder } from "./components/View/Form/FormOrder";
import { FormContacts } from "./components/View/Form/FormContacts";
import { Success } from "./components/View/Success/Success";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { API_URL, CDN_URL } from "./utils/constants";
import { IBuyer, IProduct } from "./types";
import { Page } from "./components/View/Page/Page";

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

const modalElement = ensureElement<HTMLElement>("#modal-container");
const headerElement = ensureElement<HTMLElement>(".header");

const page = new Page(document.body);

const header = new Header(headerElement, events);

const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
  onClick: () => events.emit("card:action"),
});

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
  page.render({ catalog: cards });
});

events.on("card:select", (item: IProduct) => {
  catalogModel.setSelectedItem(item);
});

events.on("card:action", () => {
  const selectedItem = catalogModel.getSelectedItem();
  if (!selectedItem) return;

  if (cartModel.hasItem(selectedItem.id)) {
    cartModel.removeItem(selectedItem);
  } else {
    cartModel.addItem(selectedItem);
  }

  modal.close();
});

events.on("preview:changed", () => {
  const selectedItem = catalogModel.getSelectedItem();
  if (!selectedItem) return;

  modal.content = cardPreview.render({
    ...selectedItem,
    image: CDN_URL + selectedItem.image,
    buttonText:
      selectedItem.price === null
        ? "Недоступно"
        : cartModel.hasItem(selectedItem.id)
          ? "Удалить из корзины"
          : "Купить",
    buttonDisabled: selectedItem.price === null,
  });
  modal.open();
});
const renderBasketCards = () => {
  return cartModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit("card:remove", item),
    });
    return card.render({ ...item, index: index + 1 });
  });
};

events.on("card:remove", (item: IProduct) => {
  cartModel.removeItem(item);
});

events.on("cart:changed", () => {
  header.counter = cartModel.getCount();
  basket.render({
    items: renderBasketCards(),
    total: cartModel.getTotal(),
  });
});

events.on("basket:open", () => {
  modal.content = basket.render();
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
  const data = buyerModel.getData();
  formOrder.render({
    valid: !errors.payment && !errors.address,
    errors: errors.payment || errors.address || "",
    payment: data.payment,
    address: data.address
  });
  formContacts.render({
    valid: !errors.email && !errors.phone,
    errors: errors.email || errors.phone || "",
    email: data.email,
    phone: data.phone
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
    })
    .catch((error) => console.error("Ошибка при оформлении заказа: ", error));
});

events.on("success:close", () => {
  modal.close();
});
