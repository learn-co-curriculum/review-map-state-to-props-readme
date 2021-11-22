# Map State to Props Continued

## Introduction

When we last left off, we successfully used our **createStore()** method, and
were able to have our application re-render through the rather confusing
`connect()` method and **Provider** component. Whenever something in JavaScript
is confusing, it is generally helpful to place some debuggers in the code and
poke around. In this lesson we will guide you through that, and give you a for
your eyes only peek at the sordid underworld of `connect()` and
`mapStateToProps()`.

## Get situated with the codebase

For this walkthrough we will be using a simplified shopping list app as our
example. If you open up the `shoppingListItemReducer` file, you will see that
our reducer responds to two action types: 'INCREASE_COUNT_OF_ITEMS' and
'INCREASE_COUNT_OF_USERS'. At the top of the reducer you can see that the
initial state includes two keys: the 'items' key points to an empty array, while
the 'users' key points to an array that contains a string representing a user.

Next, let's look at `./src/App.js`. Here you'll see that we are rendering two
buttons: one to increase the count of items and one to increase the count of
users. The two buttons do the same thing, but affect different parts of the
state.

Finally, note in the `mapStateToProps()` function that we are currently passing
only the items portion of state to our component, and, in our `render()`
function, the count of items is the only thing being rendered to the page. We
have done this intentionally to help explore how everything works.

Ok, now that you're a little better situated, let's start our exploration. To
help us, we've placed a debugger inside the `mapStateToProps()` function.

## Deeper explanation of mapStateToProps

Remember that we encounter mapStateToProps when using the connect function. In
the current codebase, we have the code:

```jsx
// ./src/App.js
...

connect(mapStateToProps)(App)
```

Meaning that we want to connect our **App** component to a slice of the store's
state specified in `mapStateToProps()`. Currently our `mapStateToProps()` looks
like the following:

```jsx
// ./src/App.js
...

const mapStateToProps = (state) => {
  debugger;
  return { items: state.items }
}
```

So now boot up the app and click on the two buttons. You will see that clicking
on the Items Count button renders an update to our **App** Component, while
clicking on the Users Count button does not. This makes sense: inside our App
component we are only referencing the items count.

Ok, now let's open up our console so that we hit our debugger. If you click on
each of the buttons, you'll see that our debugger gets hit with each action that
we dispatch. So even though we are not updating our **App** component with
information about users, the `mapStateToProps()` function is executed when we
click the Users Count button. Now we can see that the `mapStateToProps()`
function is executed with each change to the store's state. That's an important
point. Say it with me one more time: the `mapStateToProps()` method is executed
with each change to the store's state.

Ok, now the next time we are in the debugger, let's notice that if you type the
word state into the console while inside the `mapStateToProps()` method, we see
the entire state of the store and not just the part relevant to the component.

Next question: what is so special about this `mapStateToProps()` method that it
is executed each time there is a change in state, and receives the entire state
of the store as its argument? In `src/App.js`, let's rename our
`mapStateToProps()` function to **vanilla()**, and rename the argument `state`
to `milkshake`:

```jsx
// ./src/App.js
...

const vanilla = (milkshake) => {
  debugger;
  return { items: milkshake.items }
}

export default connect(vanilla)(App);
```

Refresh the app, click the button, and notice that no functionality changes: the
vanilla function now is hit every time there is a change in state, and milkshake
now represents our store's state. So in other words, whatever function we pass
to the `connect()` function will be called each time the state changes, and the
first argument to that function, whatever its name, will be the state of the
store.

We can even shorten `mapStateToProps()` down to an anonymous arrow function and
pass it directly into `connect()`:

```js
export default connect((state) => ({ items: state.items }))(App);
```

However, if your state is much more complicated than the above, you're better
off sticking with the original setup.

## Deeper understanding of props

So in the previous section we saw that whatever function we pass to `connect()`
is executed each time there is a change in state, and that the argument that
function is executed with is the entire state of the store. Let's change the
function back to `mapStateToProps()`, and let's take a look at the return value
to that function:

```jsx
// ./src/App.js
...
const mapStateToProps = (state) => {
  return { items: state.items }
}

export default connect(mapStateToProps)(App);
```

This return value is what is added to the App component's props. Let's see what
happens if we change the key in the return value from items to orangePeel.

```jsx
// ./src/App.js
...
const mapStateToProps = (state) => {
  return { orangePeel: state.items }
}
```

Let's also place a debugger inside of our App component, as the first line
underneath the render function; this way we can examine the props of our app
component.

```jsx
// ./src/App.js
...

render() {
  debugger;
  return (
    <div className="App">
      <button onClick={this.handleOnClickItems}>
        Click to change items count
      </button>
      <button onClick={this.handleOnClickUsers}>
        Click to change user count
      </button>
      <p> {this.props.items.length}</p>
    </div>
  );
}

...
```

If you type `this.props` in the console while inside the render function, you
will see that we now have this.props.orangePeel, which returns our array of
numbers. So by changing the key to the return value in `mapStateToProps()` we
changed the name of the prop in **App**. As a second step, let's change the
value associated with the orangePeel key as well:

```jsx
// ./src/App.js
...

const mapStateToProps = (state) => {
  return { orangePeel: ['a', 'b', 'c'] };
};
...
```

When we hit the debugger in our **App** component's render function, we can see
that `this.props.orangePeel` now returns `['a', 'b', 'c']` and we aren't
accessing state at all. So now when we see the following code, perhaps we
understand it a little better.

```jsx
// ./src/App.js
...

const mapStateToProps = (state) => {
  return { items: state.items }
}

export default connect(mapStateToProps)(App);
```

We understand that the `connect()` function calls the `mapStateToProps()`
function each time there is a change in state, and that `mapStateToProps()`
receives `state` as its first argument.

We also know that `mapStateToProps()` can return just a portion of the state, or
it can happily ignore the store's state altogether and return whatever it likes.
Finally, we know that `connect()` takes whatever the return value is of the
`mapStateToProps()` function and passes it to the component that is in that last
set of parentheses (in this case, App).

Because we are taking a part of the store's state and porting it to become props
of the relevant component, we say that we are mapping it as props to the
component; thus the name _mapStateToProps_.

### mapStateToProps, but Why?

By now, you may be thinking, why would **Redux** choose this whole
`mapStateToProps()` technique. Didn't we live a simpler and happier life when we
just passed our store down through each component? Well, maybe, but we do get
some benefits by using this pattern. We'll talk more about the benefits of the
`connect()` function later, but for now we can discuss the biggest benefit,
separation of concerns.

Separation of concerns is the big win. Take a look at the **App** component
again:

```jsx
// ./src/App.js

import React, { Component } from "react";
import { connect } from "react-redux";
import "./App.css";

class App extends Component {
  handleOnClickItems = () => {
    this.props.dispatch({
      type: "INCREASE_COUNT_OF_ITEMS",
    });
  };

  handleOnClickUsers = () => {
    this.props.dispatch({
      type: "INCREASE_COUNT_OF_USERS",
    });
  };

  render() {
    debugger;
    return (
      <div className="App">
        <button onClick={this.handleOnClickItems}>
          Click to change items count
        </button>
        <button onClick={this.handleOnClickUsers}>
          Click to change user count
        </button>
        <p> {this.props.items.length}</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  // debugger;
  return { items: state.items };
};

export default connect(mapStateToProps)(App);
```

You will notice that if it wasn't for the dispatch method (and in a later lesson
we will remove that as well), our component would have no knowledge of our
store, and thus no knowledge of anything related to **Redux**. This means that
if someone wanted to take the component and use a different backend, like say
**Flux**, they could. It also means that because all of our **Redux** is
separated, if we wanted to we could add in changes to our application to be
mobile by using **React Native** -- our **Redux** logic would largely stay the
same. So with this pattern, both the view and its state management system are
properly separated, and only connected by that `connect()` function.

### Summary

In this lesson we saw that the `connect()` function is used for us to connect
the **Redux** part of the application to the **React** part of the application
(we'll see even more of this later). We also see that whatever function we pass
as the first argument to that `connect()` function is called each time there is
a change of state, and has access to the store's entire state. The `connect()`
function then takes the return value from the `mapStateToProps()` function and
adds that return value to the props of the component that is passed through in
the last set of parentheses. We call that component a connected component
because it is connected to the store.
