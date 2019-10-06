import produce from 'immer'; // facilita a atualizacao dos estados porque podemos bular a imutabilidade usando uma variavel temporaria draft

export default function cart(state = [], action) {
  // todo reducer recebe uma variável state e uma action
  // state é o estado anterior
  // todo reducer tem estrutura semelhante a essa
  switch (action.type) {
    case '@cart/ADD_SUCCESS':
      return produce(state, draft => {
        const productIndex = draft.findIndex(p => p.id === action.product.id);

        // caso o produto já esteja no carrinho, ele só adiciona o amount
        if (productIndex >= 0) {
          draft[productIndex].amount += 1;
        } else {
          draft.push({
            // caso não, insere o produto no carrinho e cria o campo amount
            ...action.product,
            amount: 1,
          });
        }
      });
    case '@cart/REMOVE':
      return produce(state, draft => {
        const productIndex = draft.findIndex(p => p.id === action.id);

        if (productIndex >= 0) {
          draft.splice(productIndex, 1);
        }
      });
    case '@cart/UPDATE_AMOUNT': {
      if (action.amount <= 0) {
        return state; // caso a quantidade seja igual a zero, nao será necessario fazer os proximos passos
      }
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
