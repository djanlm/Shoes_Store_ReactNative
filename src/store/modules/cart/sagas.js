import {Alert} from 'react-native';
import {call, select, put, all, takeLatest} from 'redux-saga/effects';
import numeral from 'numeral';

import NavigationService from '../../../services/navigation';
import api from '../../../services/api';
import {addToCartSuccess, updateAmountSuccess} from './actions';

function* addToCart({id}) {
  const productExists = yield select(
    // select tem acesso ao estado
    state => state.cart.find(p => p.id === id)
  );

  const stock = yield call(api.get, `/stock/${id}`);

  const stockAmount = stock.data.amount;
  const currentAmount = productExists ? productExists.amount : 0;

  const amount = currentAmount + 1;

  if (amount > stockAmount) {
    Alert.alert('No more items in stock');
    return;
  }
  if (productExists) {
    yield put(updateAmountSuccess(id, amount));
  } else {
    const response = yield call(api.get, `/products/${id}`);

    const data = {
      ...response.data,
      amount: 1,
      priceFormatted: numeral(response.data.price).format('$0,0.00'),
    };
    yield put(addToCartSuccess(data));

    NavigationService.navigate('Cart'); // navega o usuario pra pagina do cart assim que um produto é adicionado
  }
}

function* updateAmount({id, amount}) {
  if (amount <= 0) return;

  const stock = yield call(api.get, `stock/${id}`);
  const stockAmount = stock.data.amount;

  if (amount > stockAmount) {
    Alert.alert('No more items in stock');
    return;
  }

  yield put(updateAmountSuccess(id, amount));
}

export default all([
  takeLatest('@cart/ADD_REQUEST', addToCart),
  takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount),
]);
