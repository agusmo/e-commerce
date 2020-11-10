import { GET_PRODUCTS, SET_PRODUCT, SET_CART, GET_CART } from "../constant";
import axios from "axios";

export const getProds = (products) => ({
  type: GET_PRODUCTS,
  products,
});

// Products.jsx y Product.jsx
const setProd = (product) => ({
  type: SET_PRODUCT,
  product,
});

const setCart = (cart) => ({
  type: SET_CART,
  cart,
});

// TRAE LOS PRODUCTOS DEL CARRO
export const fetchCartProducts = (cart) => (dispatch) => {
  if (!cart.id) return;
  return axios
    .get(`http://localhost:1337/api/orders/${cart.id}`)
    .then((res) => res.data)
    .then((products) => dispatch(getProds(products)));
};

// AGREGA UN PRODUCTO AL CARRITO
export const addProductToCart = (product, user) => (dispatch) => {
  return axios
    .post(`http://localhost:1337/api/orders/${product.id}`, { userId: user.id })
    .then((res) => res.data)
    .then((cart) => dispatch(setCart(cart)))
    .catch((err) => console.log(err));
};


// TRAE EL CARRITO
export const fetchCart = (user) => (dispatch) => {
  if (!user) return;
  return axios
    .get(`http://localhost:1337/api/orders/user/${user.id}`)
    .then((res) => res.data)
    .then((cart) => dispatch(setCart(cart)));
};
// CREA EL CARRITO
export const createCart = () => (dispatch) => {
  return axios
    .post(`http://localhost:1337/api/orders`, {
      paymentMethod: "Efectivo",
      shippingAdress: "hola",
    })
    .then((res) => res.data)
    .then((cart) => dispatch(setCart(cart)));
};

// http://localhost:1337/api/orders/user  // POST (REGISTER)
export const addCartToUser = (user) => (dispatch) => {
  return axios
    .put(`http://localhost:1337/api/orders/user`, { user })
    .then((res) => res.data)
    .then((cart) => dispatch(setCart(cart)));
};

// ELIMINA UN PRODUCTO DEL CARRITO
export const delProductFromCart = (product, user, cart) => (dispatch) => {
  return axios
    .delete(`http://localhost:1337/api/orders/${user.id}/${product.id}`)
    .then(() => dispatch(fetchCartProducts(cart))) // HACER FETCH CART DE NUEVO
    .catch((err) => console.log(err));
};

// ELIMINA EL CARRITO ENTERO
export const wipeCart = (cart) => (dispatch) => {
  return axios
    .delete(`http://localhost:1337/api/orders/${cart.id}`)
    .then( ()=> dispatch(setCart({})))
    .catch((err) => console.log(err));
};

export const addOneItem = (cart, product, op) => dispatch => {
  return axios
    .put(`http://localhost:1337/api/orders/${cart.id}/${product.id}`, {op})
    .then(() => dispatch(fetchCartProducts(cart)))
    .catch((err) => console.log(err));
}