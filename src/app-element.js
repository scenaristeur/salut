import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';

import Swiper from 'swiper';

//import './my-geolocation.js'
import './openlayer-element.js'
import 'shighl-elements/dist/window/shighl-login-icon.js'
import './store-location-element.js'

class AppElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
    };
  }

  constructor() {
    super();
  }

  render(){
    return html`
    <link rel="stylesheet" href="./css/swiper.min.css">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <style>
    :host {
      position: relative;
      height: 100%;
    }
    .swiper-container {
      width: auto;
      height: 100%; /*88vh;*/
    }
    .swiper-button-next, .swiper-button-prev {
      position: absolute;
      top: 95%;
      width: calc(var(--swiper-navigation-size)/ 44 * 27);
      height: calc(var(--swiper-navigation-size)/10);

      /*  .swiper-container {
      width: 300px;
      height: 300px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -150px;
      margin-top: -150px;
    }*/
    .swiper-slide {
      background-position: center;
      background-size: cover;
    }
    </style>

    <div class="container-fluid" >
    <div class="col shadow-lg p-3 mt-3 ml-n1 mr-n1 bg-white" style="height:96vh;width:100vw;border-radius: 25px;">
    <shighl-login-icon></shighl-login-icon>

    <!-- Slider main container -->
    <div class="swiper-container">
    <!-- Additional required wrapper -->
    <div class="swiper-wrapper">
    <!-- Slides -->
    <div class="swiper-slide">
    <openlayer-element name="OpenLayer">Chargement</openlayer-element>
  <!--  <my-geolocation name="Geolocation">Salut</my-geolocation>-->
    <store-location-element name="StoreLocation"></store-location-element>


    </div>
    <div class="swiper-slide">
    Todo list
    <ul>

    <li>
    <div>
    <input type="checkbox" id="scales" name="scales" checked>
    <label for="scales">Solid Pod Login</label>
    </div>
    </li>

    <li>
    <div>
    <input type="checkbox" id="scales" name="scales" >
    <label for="scales">Store this location on user's POD public or/and private</label>
    </div>
    </li>

    <li>
    <div>
    <input type="checkbox" id="scales" name="scales" >
    <label for="scales">Register the user on Salut's pod https://salut.solid.community/</label>
    </div>
    </li>

    <li>
    <div>
    <input type="checkbox" id="scales" name="scales" >
    <label for="scales">Show user the distance to other users but not their location</label>
    </div>
    </li>

    <li>
    <div>
    <input type="checkbox" id="scales" name="scales" >
    <label for="scales">Another idea</label>
    </div>
    </li>
    <li>
    </li>
    </ul>

    </div>

    <div class="swiper-slide">two</div>

    </div>
    <!-- If we need pagination -->
    <div class="swiper-pagination"></div>

    <!-- If we need navigation buttons -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>

    <!-- If we need scrollbar -->
    <!--  <div class="swiper-scrollbar"></div>-->
    </div>
    </div>
    </div>

    `;
  }

  firstUpdated(){
    var app = this;
    const slide = this.shadowRoot.querySelector('.swiper-container');
    const prev = this.shadowRoot.querySelector('.swiper-button-prev');
    const next = this.shadowRoot.querySelector('.swiper-button-next');
    const pagination = this.shadowRoot.querySelector('.swiper-pagination');
    const scrollbar = this.shadowRoot.querySelector('.swiper-scrollbar');

    const mySwiper = new Swiper(slide, {
      navigation: {
        nextEl: next,
        prevEl: prev,
        //  hideOnClick : true
      },

      // Optional parameters
      direction: 'horizontal',
      allowTouchMove : false,
      //  loop: true,

      // If we need pagination
      pagination: {
        el: pagination
      },
      effect: 'cube',
      grabCursor: true,
      cubeEffect: {
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
      },
      // Navigation arrows
      /*  navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },*/

    // And if we need scrollbar
    /*  scrollbar: {
    el: scrollbar,
  },*/
});
}

}

customElements.define('app-element', AppElement);
