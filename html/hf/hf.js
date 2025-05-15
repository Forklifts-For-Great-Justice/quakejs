"use strict"

  // attributeChangedCallback(name, oldValue, newValue) {
  //   console.log(`Attribute ${name} has changed. ${oldValue} => ${newValue}`);

  //   if (oldValue === newValue) {
  //     console.log(`Skipping attributeChangedCallback[${name}] because it's not changed in value`);
  //     return;
  //   }

  //   switch(name) {
  //     case "state":
  //       if (TalkBox.validStates.includes(newValue)) {
  //         const classList = this.shadowRoot.querySelector(".container").classList;
  //         if (!classList.replace(oldValue, newValue)) {
  //           // Add newValue if there's no oldValue in the class list.
  //           classList.add(newValue)
  //         }
  //       } else {
  //         throw new Error("Talkbox given invalid state='${newValie}'. Acceptable values are: ${TalkBox.validStates}.");
  //       }
  //   }
  // }

class BowToMyFirewall {
 static id = "bow-to-my-firewall"

  element = null;

  prepare() {
    if (this.element !== null) {
      return;
    }

    let el = document.getElementById(BowToMyFirewall.id);
    if (this.element === null) {
      // Create it since it wasn't found.
      el = document.createElement("talk-box");
      el.setAttribute("state", "hide");

      const portrait = document.createElement("img")
      portrait.setAttribute("slot", "portrait");
      portrait.setAttribute("src", "/hf/bruce-firewall.png");

      const content = document.createElement("div")
      content.setAttribute("slot", "content");
      content.innerText = "Bow to my firewall!";

      el.appendChild(portrait);
      el.appendChild(content);
      el.id = BowToMyFirewall.id;
      document.body.appendChild(el);
    }

    this.element = el
    return el;
  }

  begin() {
    this.element.setAttribute("state", "show");
  }

  end() {
    this.element.setAttribute("state", "hide");
  }
};

const Shenanigans = {
  BowToMyFirewall: new BowToMyFirewall()
}