# Web Components w/ Stencil.js Notes

**Composition + Logic = Own Element**

- the idea is to attach other existing html elements to make up a custom element and build more powerful widgets
  - the <video> tag is like this
- in the end all our components are going to be made up of the core primative html tags
  - and we add our own event listeners and logic

## Create a basic custom component & render it in HTML

```js
// to be usable as a custom element you must extend the browser's HTMLElement class to create autonomous custom elements
class Tooltip extends HTMLElement {
  // constructor will run whenever this class is instantiated
  constructor() {
    super()
    console.log('it is working!')
  }
}

// create our own custom tag
// js's customElements, allows us to register our own custom elements
// - arg0 - define your own tag
// must be: - must be a single word
//          - that consists of 2 parts seperated by a **dash** (so it doesn't conflict w/ built in tags)
//            - choose a prefix that assures your tag has a unique tag, so users don't have clashes w/ other custom libraries
//          - can't start w/ a number
// - arg1 - your JS class that holds the logic for this custom el
//            - "whenever you detect this tag in an html file, instantiate this class"
//              - create a new obj based on that class
//              - and use all the logic from that class for the custom element
//            -
customElements.define('t5e-tooltip', Tooltip)
```

and render it in the html

```html
  <script src="tooltip.js"></script>
</head>
<body>
  <t5e-tooltip></t5e-tooltip>
</body>
```

## Understanding the Web Component Lifecycle

When custom elements are initialized on a page

- element is created () not attached to dom - just in memory
- **constructor()** - basic initializations, values
- **connectedCallback()** - called when your el has been attachced to the dom
  - this is the place for DOM initializations
  - and you can start accessing the DOM

```js
class Tooltip extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const tooltipIcon = document.createElement('span')
    tooltipIcon.textContent = ' (?)'
    // "this" accesses the web component obj
    // - the html element being made for us
    // - we can use all the features we could use on normal HTML els

    this.appendChild(tooltipIcon)
  }
}

customElements.define('t5e-tooltip', Tooltip)
```

- **disconnectedCallback()** - called by browser whenever custom element is detached from DOM
  - good for cleanup work
- **attributeChangeCallback()** - listen for changes to attributes on el
  - updates data + dom

## Listening to Events inside a container

The adv of this.\_var approach is that the newly created element is now stored in a class property. So it is accessible to all methods in a class.

```js
class Tooltip extends HTMLElement {
  constructor() {
    super()
    // initialize a property you want to share among methods
    this._tooltipContainer // starts undefined
  }

  connectedCallback() {
    const tooltipIcon = document.createElement('span')
    tooltipIcon.textContent = ' (?)'
    // add mouseenter event
    tooltipIcon.addEventListener(
      'mouseenter',
      // make sure to bind(this) the method to point to this class
      this._showTooltip.bind(this)
    )
    // add mouseleave event
    tooltipIcon.addEventListener(
      'mouseleave',
      // make sure to bind(this) the method to point to this class
      this._hideTooltip.bind(this)
    )

    this.appendChild(tooltipIcon)
  }

  // "_" indicates that this is a method you only want to call from within this class, JS doesn't have public/private properties/methods
  _showTooltip() {
    this._tooltipContainer = document.createElement('div')
    this._tooltipContainer.textContent = 'This is the tooltip text! 🤗'
    this.appendChild(this._tooltipContainer)
  }
  _hideTooltip() {
    this.removeChild(this._tooltipContainer)
  }
}

customElements.define('t5e-tooltip', Tooltip)
```

## Using Attributes on Custom Els

Makes it possible to set things from the outside.

Attributes make it so you can configure your el in a declarative way.

```js
class Tooltip extends HTMLElement {
  constructor() {
    super()
    this._tooltipContainer
    // set default tooltipText
    this._tooltipText = 'Some default tooltipText'
  }

  connectedCallback() {
    // if check that overrides the default tooltopText if attribute exists
    if (this.hasAttribute('text')) {
      // init a property for the component's attribute
      // - and get the name of the attr you want the value of
      this._tooltipText = this.getAttribute('text')
    }

    const tooltipIcon = document.createElement('span')
    tooltipIcon.textContent = ' (?)'
    tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this))
    tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this))

    this.appendChild(tooltipIcon)
  }

  _showTooltip() {
    this._tooltipContainer = document.createElement('div')
    // update to show the text attr's value
    this._tooltipContainer.textContent = this._tooltipText
    this.appendChild(this._tooltipContainer)
  }

  _hideTooltip() {
    this.removeChild(this._tooltipContainer)
  }
}

customElements.define('t5e-tooltip', Tooltip)
```

and use the text attribute in the html

```html
<p><t5e-tooltip text="Web components are a set of standards that allow you to create custom elements from existing elements. 🔥">Web components</t5e-tooltip> rock!</p>
<t5e-tooltip>Another web component! 👻</t5e-tooltip>
```

## Styling

- you could set up general styles
- or we could access the style attribute and add styles step by step (which every dom node has in JS)

- global styles could effect elements in your custom element **and you generally don't want that!** and vice-versa

```js
class Tooltip extends HTMLElement {
  constructor() {
    super()
    this._tooltipContainer
    this._tooltipText = 'Some default tooltipText'
  }

  connectedCallback() {
    if (this.hasAttribute('text')) {
      this._tooltipText = this.getAttribute('text')
    }

    const tooltipIcon = document.createElement('span')
    tooltipIcon.textContent = ' (?)'
    tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this))
    tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this))

    this.appendChild(tooltipIcon)

    // add styles - to the t5e-tooltip el itself
    this.style.position = 'relative'
  }

  _showTooltip() {
    this._tooltipContainer = document.createElement('div')
    this._tooltipContainer.textContent = this._tooltipText
    // add styles
    this._tooltipContainer.style.backgroundColor = 'black'
    this._tooltipContainer.style.color = 'white'
    this._tooltipContainer.style.position = 'absolute'
    this._tooltipContainer.style.zIndex = '10'

    this.appendChild(this._tooltipContainer)
  }

  _hideTooltip() {
    this.removeChild(this._tooltipContainer)
  }
}

customElements.define('t5e-tooltip', Tooltip)
```

it would be nice if you didn't have to declare styles line by line in JS and could template out the html

well there is! welcome to the shadow dom!
both will help us ensure we write nice reusable encapsulated custom web components!

## Using the Shadow DOM

Currently everything up to this point has been using the **light DOM**

But what if everything that was going on was hidden away behind the custom component tag and not added to the normal DOM?

We can give our component its own DOM tree that isn't effected by the normal DOM tree.

That's the **Shadow DOM**

Our element has its own DOM behind it, which makes up what we see on the page, but not directly connected to the real DOM, not effected by global styles, and vice-versa.

1.) Unlock the shadow DOM in the constructor

```js
// defines whether you can access your shadow DOM tree from outside this component or not
// - typically you won't close it
this.attachShadow({ mode: 'open' })
```

2.) Append elements to the shadowDOM

```js
// this.appendChild(tooltipIcon)
this.shadowRoot.appendChild(tooltipIcon)
// now it's appending to the shadow tree
```

But the text that is wrapped by this custom element is gone now!

Well... now it's in the shadow DOM... and is detached from the main DOM. Along with that colored border we added in the style tag of the html page.

To bring it back, we're going to need templates.

## Use Templates

Two ways:

1. Use the <template> element

- built into and understood by the browser
- but not understood automatically
- it becomes a blueprint for the html content that makes up our custom element

```html
<template id="tooltip-template">
  <span> (?)</span>
</template>
```

...

but there are draw backs to this approach

- it requires that content to be added to our html file
- but we just want to use the web component
