import './scss/styles.scss';

import { Catalog } from './components/Models/Catalog';
import { apiProducts } from './utils/data';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';

import { Api } from './components/base/Api';
import { ProductAPI } from './components/Models/ProductAPI';
import { API_URL } from './utils/constants';


// Создание экземпляров всех созданных классов.
// Тестирование всех методов моделей данных
const catalogModel = new Catalog();
catalogModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога: ', catalogModel.getItems())
console.log('Найдено по айди: ', catalogModel.getItemById('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));
catalogModel.setSelectedItem(apiProducts.items[2]);
console.log('Вабран товар: ', catalogModel.getSelectedItem());


const cartModel = new Cart();
cartModel.addItem(apiProducts.items[2]);
console.log('Cart: ', cartModel.getItems());
cartModel.addItem(apiProducts.items[3]);
console.log('total: ', cartModel.getTotal());
console.log('count: ', cartModel.getCount());
console.log('is this item there: ', cartModel.hasItem('b06cde61-912f-4663-9751-09956c0eed67'), cartModel.hasItem('854cef69-976d-4c2a-a18c-2aa45046c390'))


const buyerModel = new Buyer();
buyerModel.setData({address: 'gifognf', email: 'fmgf'});
console.log('data: ', buyerModel.getData());
buyerModel.clearData();
console.log('new data: ', buyerModel.getData());
buyerModel.setData({address: 'gifognf', email: 'fmgf'});
console.log('data for validation: ', buyerModel.getData())
console.log('validation: ', buyerModel.validate());

//Запрос к серверу за массивом товаров в каталоге.
const api = new Api(API_URL);
const productApi = new ProductAPI(api);
productApi.get()
    .then(products => {
        catalogModel.setItems(products);
        console.log('Полученные данные от сервера: ', catalogModel.getItems());
    })
    .catch(error => console.error('Ошибка при загрузке каталога: ', error))
