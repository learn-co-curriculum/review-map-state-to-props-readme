export default function shoppingListItemReducer(state = {items: [], users: ['initial user']}, action) {
  switch(action.type) {
    case 'GET_COUNT_OF_ITEMS':
    let items = state.items.concat(state.items.length + 1)
    return Object.assign({}, state, {items: items})
    case 'GET_COUNT_OF_USERS':
      let users = state.users.concat(state.users.length + 1)
      return Object.assign({}, state, {users: users})
    default:
      return state;
  }
}
