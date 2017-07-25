
define(['axios', 'jquery', 'what-input', 'foundation', 'jquery.validate'], function (axios, $, whatinput, foundation, validate) {

  var Widget = function (params) {

    var element = $('ts-widget[type=shop-items]');

    if (element.length !== 1) {
      alert('Check the console for possible error messages');
      throw new ClientException('Widget Container is not defined! Please add the following code on your page: <ts-widget type="shop-items"</ts-widget>');
    }

    createDomElement(element);
    startLoader('Shop widget loading...');
    getOffersAndLoadElement(axios, params, element);
    setTimeout(initializeWidgetBehaviors, 1000);
    stopLoader();
  };

  return Widget;

});


var createDomElement = function (element) {

  var asside = element.append('<aside id="ts-widget" class="ts ts-widget"></aside>');

  $('#ts-widget').append('<div class="ts-messagewrapper"><div class="ts-callout"><button id="retrybtn" class="ts-button ts-button--hollow">Retry</button><p>Aww crap, something went wrong (error 500)</p></div></div>');
  $('#ts-widget').append('<div style="padding: 20%;" class="ts-container" ></div>');
  $('#ts-widget').append('<div class="ts-disabledinfooverlay"><div class="ts-ball"></div><p></p></div>');

}

var getWidget = function () {

  return document.getElementById('ts-widget');

}

var ClientException = function (message) {

  this.message = message;

}

var startLoader = function (msg) {

  $('#ts-widget').addClass('ts-widget--disabled');
  $('#ts-widget .ts-disabledinfooverlay').children('p').html(msg);

}

var stopLoader = function (elemnet) {

  $('#ts-widget').removeClass('ts-widget--disabled');

}

var getOffersAndLoadElement = function (axios, params, element) {

  AUTH_TOKEN = 'Barier a38seller';

  axios.defaults.baseURL = 'http://ts-core.dev/api/v1';
  axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

  if (!params.app_uuid || !params.event_uuid) {

    showError('Something is wrong: app_uuid and event_uuid is required.');
    retry();

  } else {

    axios.get('/test?app_uuid=' + params.app_uuid + '&event_uuid=' + params.event_uuid)
      .then(function (response) {

        $.when(stopLoader).done(function () {
          var content = response.data;
          $('#ts-widget .ts-container').replaceWith(content).foundation();
        });

      })
      .catch(function (error) {

        showError(error.message);
        retry();

      });

  }


}

var showError = function (message) {

  var msgwrap = document.querySelector('.ts-messagewrapper');
  $('.ts-messagewrapper div  p').text(message);
  msgwrap.classList.add('ts-is-visible');
}

var hideError = function () {

  var msgwrap = document.querySelector('.ts-messagewrapper');
  msgwrap.classList.remove('ts-is-visible');

}

var retry = function () {

  var retrybutton = document.getElementById('retrybtn');

  if (retrybutton) {

    retrybutton.addEventListener('click', function () {

      var msgwrap = document.querySelector('.ts-messagewrapper');
      msgwrap.classList.remove('ts-is-visible');
      location.reload();
    });
  }

}

var sizehelper = function (widget) {

  var widgetInfo = widget.getBoundingClientRect();

  var height = widgetInfo.height;
  var width = widgetInfo.width;
  if (width <= 420) {
    widget.classList.add('ts--narrow');
  } else {
    widget.classList.remove('ts--narrow');
  }
  return true;
}

var initializeWidgetBehaviors = function () {

  var widget = document.getElementById('ts-widget');
  sizehelper(widget);

  window.addEventListener('resize', function () {
    sizehelper(widget);
  }, true);


  var retrybutton = document.getElementById('retrybtn');
  retrybutton.addEventListener('click', function () {
    var msgwrap = document.querySelector('.ts-messagewrapper');
    msgwrap.classList.remove('ts-is-visible');
  });

  var disableFormFields = function () {
    submitbutton.setAttribute('disabled', 'true');
    var inputs = document.querySelectorAll('.ts-ticket__quantityfield');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].setAttribute('disabled', 'true');
    }
  }

  var enableFormFields = function () {
    submitbutton.removeAttribute('disabled');
    var inputs = document.querySelectorAll('.ts-ticket__quantityfield');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].removeAttribute('disabled');
    }
  }

  var openCheckoutForm = function () {
    // Note: These cross-document interactions are only possible if the documents have the same origin. 
    // The postMessage method provides the means of interacting cross-domain.
    var checkoutwin = thecheckoutframe.contentWindow;
    var checkoutdoc = thecheckoutframe.contentDocument ? thecheckoutframe.contentDocument : thecheckoutframe.contentWindow.document;
    checkoutdoc.body.classList.add('is-in-iframe');
    thecheckoutframe.classList.add('ts-checkoutframe--is-visible');
    // ha aktiv a felugro iframe scroll miatt meg kel fogni a befogadó oldalt
    document.body.classList.add('ts-checkoutframe-is-active');
  }

  var closeCheckoutForm = function () {
    var checkoutwin = thecheckoutframe.contentWindow;
    var checkoutdoc = thecheckoutframe.contentDocument ? thecheckoutframe.contentDocument : thecheckoutframe.contentWindow.document;
    checkoutdoc.body.classList.remove('is-in-iframe');
    thecheckoutframe.classList.remove('ts-checkoutframe--is-visible');
    document.body.classList.remove('ts-checkoutframe-is-active');
  }



  var submitbutton = document.querySelector('.ts-button[type="submit"]');
  
  $("#ticketform").validate({
    debug: false,
    errorClass: "ts-is-invalid-input",
    errorPlacement: function (error, element) {
      $('.ts-messagewrapper div  p').html(error);
      showError();
    },
    success: function (error) {
      hideError();
      error.remove();
    }
  });

  submitbutton.addEventListener('click', function (ev) {

    ev.preventDefault();
    var ticketsum = 0;

    $('#ticketform input[type=number]').each(function () {
  
      if (!isNaN(this.value) && this.value.length != 0 &&  parseFloat(this.value) <= this.max ) {
        ticketsum += parseFloat(this.value);
      }

    });

    if (ticketsum > 0) {

      hideError();
      disableFormFields();
      startLoader('Payment process is in progress.');
      // formSubmit();

    } else {

      showError('Please add some ticket');

    }
    // widget.classList.add('ts-widget--disabled');
    // //document.getElementById('ticketform').submit();
    // openCheckoutForm();
  });
}

