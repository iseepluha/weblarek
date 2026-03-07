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
console.log('Положили в каталог массив товаров...');
console.log('Массив товаров из каталога: ', catalogModel.getItems())
console.log('Найдено по айди: ', catalogModel.getItemById('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));
catalogModel.setSelectedItem(apiProducts.items[2]);
console.log('Установили выбранный товар');
console.log('Вабран товар: ', catalogModel.getSelectedItem());


const cartModel = new Cart();
cartModel.addItem(apiProducts.items[2]);
console.log('Добавили товар в корзину...');
console.log('Текущая корзина: ', cartModel.getItems());
cartModel.removeItem(apiProducts.items[2])
console.log('Убираем товар из корзины...');
console.log('Корзина после удаления товара: ', cartModel.getItems());
cartModel.addItem(apiProducts.items[3]), 
cartModel.addItem(apiProducts.items[2]), 
cartModel.addItem(apiProducts.items[1])
console.log('Добавили несколько товаров: ', cartModel.getItems());
cartModel.clearCart()
console.log('Очищаем корзину...');
console.log('Корзина после очищения: ', cartModel.getItems());
cartModel.addItem(apiProducts.items[3]), 
cartModel.addItem(apiProducts.items[2]), 
cartModel.addItem(apiProducts.items[1])
console.log('Снова добавили несколько товаров: ', cartModel.getItems());
console.log('Количество товаров в корзине после добавления в нее товаров: ', cartModel.getCount());
console.log('Сумма стоимостей всех товаров в корзине', cartModel.getTotal());
console.log(
    'Проверяем есть ли в нашей корзине товары с айдишниками, например, b06cde61-912f-4663-9751-09956c0eed67 и c101ab44-ed99-4a54-990d-47aa2bb4e7d9 : ', 
    cartModel.hasItem('b06cde61-912f-4663-9751-09956c0eed67'), 
    cartModel.hasItem('854cef69-976d-4c2a-a18c-2aa45046c390')
)


const buyerModel = new Buyer();
buyerModel.setData({address: 'gifognf', email: 'fmgf'});
console.log('Указали данные пользователя...')
console.log('Текущие данные: ', buyerModel.getData());
buyerModel.clearData();
console.log('Почистили данные...');
console.log('Очищенные данные: ', buyerModel.getData());
buyerModel.setData({address: 'gifognf', email: 'fmgf'});
console.log('Вернули частичные данные пользователя: ', buyerModel.getData());
console.log('Результаты валидации: ', buyerModel.validate());


//Запрос к серверу за массивом товаров в каталоге.
const api = new Api(API_URL);
const productApi = new ProductAPI(api);
productApi.getProducts()
    .then(products => {
        catalogModel.setItems(products);
        console.log('Полученные данные от сервера: ', catalogModel.getItems());
    })
    .catch(error => console.error('Ошибка при загрузке каталога: ', error))
