class Tooltip extends HTMLElement {
  constructor() {
    super()
    this._tooltipContainer
    this._tooltipText = 'Some default tooltipText'
    // defines whether you can access your shadow DOM tree from outside this component or not
    // - typically you won't close it
    this.attachShadow({ mode: 'open' })
    // reference template
    const template = document.querySelector('#tooltip-template')
    // you can access the shadow dom because it exists before it's rendered to the real dom, it's abstracted away
    //! instead of vv
    // this.shadowRoot.appendChild(template.content.cloneNode(true)) // deep(true) or shallow(false)
    //! we can just define our template vv here
    this.shadowRoot.innerHTML = `
      <slot>some default</slot>
      <span> (?)</span>
    `
    // ^^ innerHTML is just a property of an object so it doesn't need to render first, unlike appendChild() where it has to be in the DOM - innerHTML just prepares the object for being rendered to the DOM
  }

  connectedCallback() {
    if (this.hasAttribute('text')) {
      this._tooltipText = this.getAttribute('text')
    }

    // const tooltipIcon = document.createElement('span')
    // tooltipIcon.textContent = ' (?)'
    const tooltipIcon = this.shadowRoot.querySelector('span')
    tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this))
    tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this))

    // this.appendChild(tooltipIcon)
    this.shadowRoot.appendChild(tooltipIcon)
    // now it's appending to the shadow tree

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

    this.shadowRoot.appendChild(this._tooltipContainer)
  }

  _hideTooltip() {
    this.shadowRoot.removeChild(this._tooltipContainer)
  }
}

customElements.define('t5e-tooltip', Tooltip)
