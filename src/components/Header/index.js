import React from 'react';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Wrapper, Container, Logo, BasketContainer, ItemCount} from './styles';

function Header({navigation, cartSize}) {
  return (
    <Wrapper>
      <Container>
        <Logo />
        <BasketContainer onPress={() => navigation.navigate('Cart')}>
          <Icon name="shopping-basket" color="#FFF" size={24} />
          <ItemCount>{cartSize}</ItemCount>
        </BasketContainer>
      </Container>
    </Wrapper>
  );
}

export default connect(state => ({
  cartSize: state.cart.length, // estado do reducer cart (nome tá no rootReducer.js), cartSize vira uma prop desse componente
}))(Header); // O primeiro parâmetro do connect() é uma função que recebe o estado do redux
