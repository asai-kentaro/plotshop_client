import config from "../config";
const $ = require('jquery');

const Test = {
  exec_local: (codes, filename, cb) => {
    const URL = "/api/exec/";
    const data = {
      codes: codes,
      filename: filename,
    }

    $.ajax({
      url: URL,
      data: JSON.stringify(data),
      type: 'POST',
      contentType: 'application/JSON',
      dataType: 'JSON',
    })
    .done(function(res, textStatus, jqXHR){
      cb(res);
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      console.log("[API Error] exec_local")
    });
  },
  exec_breakout: (type, codes, cb) => {
    const URL = "/api/execbreak/";
    const data = {
      codes: codes,
      type: type,
    }

    $.ajax({
      url: URL,
      data: JSON.stringify(data),
      type: 'POST',
      contentType: 'application/JSON',
      dataType: 'JSON',
    })
    .done(function(res, textStatus, jqXHR){
      cb(res);
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      console.log("[API Error] exec_break")
    });
  },
  load_code: (id, cb) => {
    const URL = "/api/code/" + id + "/load";

    $.ajax({
      url: URL,
      type: 'GET',
      contentType: 'application/JSON',
      dataType: 'JSON',
    })
    .done(function(res, textStatus, jqXHR){
      cb(res);
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      console.log("[API Error] load_code")
    });
  },
  load_meta: (id, cb) => {
    const URL = "/api/code/" + id + "/meta";

    $.ajax({
      url: URL,
      type: 'GET',
      contentType: 'application/JSON',
      dataType: 'JSON',
    })
    .done(function(res, textStatus, jqXHR){
      cb(res);
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      console.log("[API Error] get_meta")
    });
  },
  post_meta: (id, meta, cb) => {
    const URL = "/api/code/" + id + "/meta";

    $.ajax({
      url: URL,
      data: JSON.stringify(meta),
      type: 'POST',
      contentType: 'application/JSON',
      dataType: 'JSON',
    })
    .done(function(res, textStatus, jqXHR){
      cb(res);
    })
    .fail(function(jqXHR, textStatus, errorThrown){
      console.log("[API Error] post_meta")
    });
  },
};

export default Test;
