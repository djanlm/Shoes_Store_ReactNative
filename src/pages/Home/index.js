import React, {Component} from 'react';
import {FlatList} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import numeral from 'numeral';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';
import * as CartActions from '../../store/modules/cart/actions';

import {
  AddButton,
  AddButtonText,
  ProductAmount,
  ProductAmountText,
  Container,
  Product,
  ProductImage,
  ProductPrice,
  ProductTitle,
} from './styles';
// import { Container } from './styles';

class Home extends Component {
  state = {
    products: [],
  };

  async componentDidMount() {
    const response = await api.get('/products');
    const data = response.data.map(product => ({
      ...product,
      priceFormatted: numeral(product.price).format('$0,0.00'),
    }));
    this.setState({products: data});
  }

  handleAddProduct = id => {
    const {addToCartRequest} = this.props; // a propriedade dispatch surge quando o componente é conectado ao redux
    // dispatch serve pra disparar uma action
    addToCartRequest(id);
  };

  renderItem = ({item}) => {
    const {amount} = this.props;
    return (
      <Product>
        <ProductImage source={{uri: item.image}} />
        <ProductTitle>{item.title}</ProductTitle>
        <ProductPrice>{item.priceFormatted}</ProductPrice>
        <AddButton>
          <ProductAmount>
            <Icon name="add-shopping-cart" color="#FFF" size={20} />
            <ProductAmountText>{amount[item.id] || 0}</ProductAmountText>
          </ProductAmount>
          <AddButtonText onPress={() => this.handleAddProduct(item.id)}>
            Add Item
          </AddButtonText>
        </AddButton>
      </Product>
    );
  };

  render() {
    const {products} = this.state;
    return (
      <Container>
        <FlatList
          data={products}
          keyExtractor={item => String(item.id)}
          renderItem={this.renderItem}
          horizontal
        />
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;
    return amount;
  }, {}),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home); // connect to redux
