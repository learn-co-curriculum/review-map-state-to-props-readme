export default function shoppingListItemReducer(state = {
  items: [], 
  users: [ 'initial user' ]
}, action) {

  switch(action.type) {

    case 'GET_COUNT_OF_ITEMS':
      return Object.assign({}, state, {
        items: state.items.concat(state.items.length + 1)
      });

    case 'GET_COUNT_OF_USERS':
      return Object.assign({}, state, {
        users: state.users.concat(state.users.length + 1)
      });

    default:
      return state;
  }
};
