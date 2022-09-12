import { createReducer, on } from '@ngrx/store';
import { Product } from 'src/app/features/customers/models/product';
import { Offer } from '../../../../features/offers/models/offer';
import {
  addAllOfferToBasket,
  addOfferToBasket,
  changeConfigOfProductInBasket,
  clearBasket,
  removeBasket,
} from './basket.actions';

// Basket state'inin başlangıç değeri
const initialState: Offer[] = [];

// Basket state'ini güncelleyen reducer
export const basketReducer = createReducer(
  initialState,
  on(addOfferToBasket, (state, action) => {
    return [...state, action.offer];
  }),
  on(addAllOfferToBasket, (state, action) => {
    return [...state, ...action.offers];
  }),
  on(clearBasket, (state) => {
    return [];
  }),
  on(changeConfigOfProductInBasket, (state, action) => {
    return [
      ...state.map((offer) => {
        if (offer.id != action.offer.id) return offer;
        const newOffer: Offer = { ...offer, products: [...offer.products] };
        const productIndex = newOffer.products.findIndex((product) => {
          return product.id === action.product.id;
        });

        const newProduct: Product = {
          ...(newOffer.products.find((product) => {
            return product.id === action.product.id;
          }) as Product),
        };
        newProduct.config = {
          ...newProduct.config,
          [action.config.key]: action.config.value,
        };

        newOffer.products[productIndex] = newProduct;
        return newOffer;
      }),
    ];
  }),
  on(removeBasket, (state, action) => {
    return [...state.filter((offer) => offer.id !== action.offer.id)];
  })
);
