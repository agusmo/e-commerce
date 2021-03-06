import {RECEIVE_PRODUCTS, RECEIVE_PRODUCT, ADD_TO_PRODUCTS} from "../constant";

const initialState = {
    list : [],
    selected: {},
    
}

export default (state = initialState, action) => {
    switch(action.type) {
        case RECEIVE_PRODUCTS:
            return {...state, list: action.products}
        case RECEIVE_PRODUCT:
            return {...state, selected: action.product}
        default:
            return state;
    }
}
