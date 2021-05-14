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
