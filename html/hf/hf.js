"use strict"

class TalkBox extends HTMLElement {
  static observedAttributes = [ "portrait", "text" ];

  static {
    const template = document.createElement("template");
    template.id = "template-talk-box";
    template.innerHTML = `
      <style>
        .container {
          position: fixed;

          left: 0;
          bottom: 50px;

          height: 150px;

          transition: left 1s ease-in-out,
            visibility 1s,
            opacity 1s;
            width: 40em;
          }

        .portrait { 
          position: absolute;
          left: 40px;
          top: -2em;
          height: 150px;
          filter: drop-shadow(2px 2px 5px orange);
        }

        .show {
          visibility: visible;
          opacity: 1;
        }

        .hide {
          left: -200px !important;
          visibility: hidden;
          opacity: 0;
        }
      </style>

      <div class="container hide">
        <div><img class="portrait"></div>
        <div class="talkbox">Placeholder text</div>
      </div>
    `;

    document.addEventListener("DOMContentLoaded", () => {
      window.customElements.define("talk-box", this);
      document.body.appendChild(template);
    });
  } // static

  constructor() {
    super();
    const body = document.getElementById("template-talk-box").content.cloneNode(true);
    this.attachShadow({ mode: "open" }).appendChild(body);
  }

  connectedCallback() {
    this.shadowRoot.querySelector(".portrait").src = this.portrait;
    this.shadowRoot.querySelector(".talkbox").innerText = this.text;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      `Attribute ${name} has changed from ${oldValue} to ${newValue}.`,
    );
  }

}

class BowToMyFirewall {
  static id = "bow-to-my-firewall"

  _element = null;

  get element() {
    if (this._element) {
      return this._element;
    }

    let el = document.getElementById(BowToMyFirewall.id);
    if (this._element === null) {
      // Create it since it wasn't found.
      console.log("Creating container element");
      el = document.createElement("talk-box");
      el.portrait = "/hf/bruce-firewall.png";
      el.text = "Bow to my firewall!";
      el.classList.add("show");
      el.id = BowToMyFirewall.id;
      document.body.appendChild(el);
    }

    this._element = el
    return el;
  }

  begin() {
    if (this.element.classList.contains("hide")) {
      this.element.classList.remove("hide");
    }
      this.element.classList.add("show");
  }

  end() {
    if (this.element.classList.contains("show")) {
      this.element.classList.remove("show");
    }
    this.element.classList.add("hide");
  }
};

const Shenanigans = {
  BowToMyFirewall: new BowToMyFirewall()
}