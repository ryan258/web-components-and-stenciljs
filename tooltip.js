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
