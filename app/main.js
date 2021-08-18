// @ts-nocheck

import Vue from 'nativescript-vue'
import App from './components/App'
import RipplePlugin from 'nativescript-material-ripple/vue';
import * as dialogs from "tns-core-modules/ui/dialogs";
require('@nota/nativescript-webview-ext/vue')

Vue.use(RipplePlugin);


var application = require("application");
const handleError = (event) => {

  event.preventDefault();

  alert('Error occured')

  error = event.error

  console.log(error.message);
  console.log(error.stackTrace);
  console.log(error.nativeException);
}

application.on(application.discardedErrorEvent, function (args) {
  handleError(args)

});


application.on(application.uncaughtErrorEvent, (args) => {
  handleError(args)

});


// Prints Vue logs when --env.production is *NOT* set while building
//Vue.config.silent = (TNS_ENV === 'production')

Vue.registerElement(
  'Fab',
  () => require('nativescript-floatingactionbutton').Fab
);

Vue.registerElement(
  'ImageZoom',
  () => require('nativescript-image-zoom').ImageZoom
);



new Vue({

  render: h => h('frame', [h(App)])
}).$start()
