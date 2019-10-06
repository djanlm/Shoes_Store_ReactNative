import produce from 'immer'; // facilita a atualizacao dos estados porque podemos bular a imutabilidade usando uma variavel temporaria draft

export default function cart(state = [], action) {
  // todo reducer recebe uma variável state e uma action
  // state é o estado anterior
  // todo reducer tem estrutura semelhante a essa
  switch (action.type) {
    case '@cart/ADD_SUCCESS':
      return produce(state, draft => {
        const {product} = action;

        draft.push(product);
      });
    case '@cart/REMOVE':
      return produce(state, draft => {
        const productIndex = draft.findIndex(p => p.id === action.id);

        if (productIndex >= 0) {
          draft.splice(productIndex, 1);
        }
      });
    case '@cart/UPDATE_AMOUNT_SUCCESS': {
      return produce(state, draft => {
        const productIndex = draft.findIndex(p => p.id === action.id);

        if (productIndex >= 0) {
          draft[productIndex].amount = Number(action.amount);
        }
      });
    }
    default:
      return state;
  }
}
