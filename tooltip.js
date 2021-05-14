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
