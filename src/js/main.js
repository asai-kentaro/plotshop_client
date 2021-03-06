import React from 'react'
import {render} from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import reducer from './reducers'
import App from './containers/App'

const $ = require('jquery');

const api_settings = () => {
  $.ajaxSetup({
     beforeSend: function(xhr, settings) {
         function getCookie(name) {
             let cookieValue = null;
             if (document.cookie && document.cookie != '') {
                 let cookies = document.cookie.split(';');
                 for (let i = 0; i < cookies.length; i++) {
                     let cookie = $.trim(cookies[i]);
                     // Does this cookie string begin with the name we want?
                     if (cookie.substring(0, name.length + 1) == (name + '=')) {
                         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                         break;
                     }
                 }
             }
             return cookieValue;
         }
         if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
             // Only send the token to relative URLs i.e. locally.
             xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
         }
     }
   });
}
api_settings();

let store = createStore(reducer);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
