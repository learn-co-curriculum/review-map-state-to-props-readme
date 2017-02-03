### Introduction

When we last left off, we successfully used our createStore method, and were able have our application re-render through the rather confusing connect and provider method.  Whenever something in javascript is confusing, it is generally helpful to place some debuggers in the code and poke around.  In this lesson we will guide you through that, and giving you a for your eyes only peak at the sordid underworld of connect and mapStateToProps.

## Get situated with the codebase changes

Now, we made some changes to the codebase, mainly to help this walkthrough a little easier to digest.  If you open up the file `shoppingListItemReducer` the first thing you'll see is that we added a new branch to our case statement.  Our reducer now responds to getCountOfUsers.  We did this to make our state slightly more complex.  You'll notice at the top of our shoppingListItemReducer that we added a new key to our initial state called users, and populated it with an initial string to represent a user.  You can also see that we removed the calls to console.log in the reducer, as we already have redux-devtools setup.

The next set of changes comes in the `src/App.js` where you can see that we now have added a new button labeled click to change users.  It does the same thing as our other button, but this time calls a callback which dispatches an action to change the part of the state related to users, instead of that related to items.

At the bottom of the file, inside the mapStateToProps function you can see we placed a debugger.  Ok, now that you're a little better situated, let's start our exploration.

## Deeper explanation of mapStateToProps

Remember that we encounter mapStateToProps when using the connect function.   In the current codebase, we have the code:

`src/App.js`
```javascript
  connect(mapStateToProps)(App)
```

Meaning that we want to connect our App component to a slice of the store's state specified in mapStateToProps.  Currently our mapStateToProps looks like the following:

```javascript
  function mapStateToProps(state){
    debugger;
    return {items: state.items}
  }
```

Yes, we added a debugger to the body of our mapStateToProps function. So now boot up the app and click on the two buttons. You will see that clicking on the Items Count button renders an update to our App Component, while clicking on the Users Count button does not.  This makes sense: inside our App component all we do is reference the items count.  

Ok, now let's open up our console so that we hit our debugger.  If you click on each of the buttons, you'll see that our debugger gets hit with each action that we dispatch. So even though we are not updating our App component with information about users, the mapStateToProps method is executed with each change to the store's state.  That's an important point.  Say it with me one more time: the mapStateToProps method is executed with each change to the store's state.  

Ok, now the next time we are in the debugger, let's notice that if you type the word state into the console while inside the mapStateToProps method, that it is the entire state of the store and not just that relevant to the component.

Next question: what is so special about this mapStateToProps method that it is executed each time there is a change in state, and receives the entire state of the store as its argument?  Let's change our code to the following in `src/App.js`

```javascript
  const connectedComponent = connect(vanilla)(App)

  function vanilla(milkshake){
    debugger;
    return {items: state.items}
  }
```

Essentially, all we did was rename our mapStateToProps method to vanilla, and rename the argument `state` to milkshake.  Refresh the app, click the button, and notice that no functionality changes: the vanilla method now is hit every time there is a change in state, and milkshake now represents our store's state.  So in other words, whatever function we pass to the *connect* function will be called each time the state changes, and the first argument to that function, whatever it's name, will be the state of the store.  

## Deeper understanding of props

So in the previous section we saw that whatever function we pass to the connect function is executed each time there is a change in state, and that the argument that method is executed with is the entire state of the store.  Now let's change the method back from vanilla to mapStateToProps and let's pay special attention to the return value to that method:

```javascript
  function mapStateToProps(state){
    return {items: state.items}
  }
```

This return value, is the value of the props that are added to the App component.  Let's see what happens if we change the key in the return value from items to orangePeel.

```javascript
  function mapStateToProps(state){
    return {orangePeel: state.items}
  }
```

Let's also place a debugger inside of our App component, as the first line underneath the render function, this way we can examine the props of our app component.  

```javascript
...
render() {
  debugger;
  return (
    <div className="App">
        <button onClick={this.handleOnClickItems.bind(this)}>Click to change items count</button>
        <button onClick={this.handleOnClickUsers.bind(this)}>Click to change user count</button>
        <p> {this.props.items.length}</p>
    </div>
  );
}
```

If you type in `this.props` while inside the render function, you will see that we now have this.props.orangePeel, which returns our array of numbers.  So by changing the key to the return value in mapStateToProps we changed the name of the prop in App.  As a second step, let's change the value to orangePeel as well:

```javascript
  function mapStateToProps(state){
    return {orangePeel: ['a', 'b', 'c']}
  }
```

Keeping our debugger in our App component's render function, you can see that `this.props.orangePeel` now returns `['a', 'b', 'c']`.  So now when we see the following code, perhaps we understand it a little better.

    `src/App.js`
    ```javascript
      connect(mapStateToProps)(App)

      function mapStateToProps(state){
        return {orangePeel: ['a', 'b', 'c']}
      }
    ```

We understand that the connect function calls the mapStateToProps function each time there is a change in state, and that mapStateToProps receives that state as its first argument.  Now we know that mapStateToProps can happily ignore the store's state and return whatever it likes.  We also know that connect takes whatever the return value is of the mapStateToProps function and passes it to the component that is in those last set of parentheses (in this case, App).  Because normally, what we are doing is taking a part of the store's state and porting it to become props of the relevant component, we say that we are taking part of the state, and mapping them as props to the component, thus the name mapStateToProps.

### mapStateToProps, but Why?

By now, you may be thinking, why would redux choose this whole mapStateToProps technique.  Didn't we live a simpler and happier life when we just passed our store down through each component.  Well, maybe, but we do get some benefits by using this pattern.  We'll talk more about the benefits of the connect function later, but for now we can discuss the biggest benefit, separation of concerns.

Separation of concerns is the big win.  Take a look at the App component again:

```javascript
  class App extends Component {
    handleOnClickItems(){
      this.props.store.dispatch({type: 'GET_COUNT_OF_ITEMS'})
    }
    handleOnClickUsers(){
      this.props.store.dispatch({type: 'GET_COUNT_OF_USERS'})
    }
    render() {

      return (
        <div className="App">
            <button onClick={this.handleOnClickItems.bind(this)}>Click to change items count</button>
            <button onClick={this.handleOnClickUsers.bind(this)}>Click to change user count</button>
            <p> {this.props.items.length}</p>
        </div>
      );
    }
  }

```

You will notice that if it wasn't for the dispatch method (and in a later lesson we will remove that as well), our component would have no knowledge of our store, and thus no knowledge of anything related to redux.  This means that if someone wanted to take the component and use a different backend, like say flux, it could.  It also means that because all of our redux is separated, that if we wanted to add in change our application to be mobile by using react native, we our redux logic would largely state the same.  So with this pattern, both the view and its state management system are properly separated, and only connected by that `connect` function.  


### Summary

In this lesson we saw that the connect function is used for us to connect our redux part of the application to the react part of the application (we'll see even more of this later).  We also see that whatever function we pass as the first argument to that connect function is called each time there is a change of state, and has access to the entire store's state.  The connect function then takes the return value from the mapStateToProps function and adds that return value to the props of the component that is passed through in the last parentheses.  We call that component a connected component, because that component is connected to the store.  
