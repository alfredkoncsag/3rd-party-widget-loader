//
// Entry point for App
//
//
// RequireJS configuration
// -----------------------
//
// We have to put config here, or else it might not be loaded before other
// modules, resulting in wrong dependency paths
//

require.config({
  deps: [],
  paths: {
    "jquery": "../../node_modules/jquery/dist/jquery.min",
    "what-input": "../../node_modules/what-input/dist/what-input.min",
    "foundation": "../../node_modules/foundation-sites/dist/js/foundation.min",
    "axios": "../../node_modules/axios/dist/axios.min",
    "jquery.validate": "../../node_modules/jquery-validation/dist/jquery.validate.min"
    },
  shim: {
    foundation: {
      deps: ['jquery'],
      exports: 'Foundation'
    }
  },

  // The r.js compiler will pick this up and enclose everything under this namespace.
  namespace: 'WidgetGlobal',
});

(function (exports) {

  define(
    ['widget'],

    function (Widget) {

      // We create this hollow App object that proxies Widget to make a clean
      // cut - in `widget.js` we have RequireJS all setup and no longer need to
      // think of enclosure and configuration of the such.

      var App = function (params) { return Widget.apply(this, arguments); };
      App.prototype = Widget.prototype;
      return App;

    }
  );

}(this));

