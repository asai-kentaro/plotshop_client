import config from "../config";
const $ = require('jquery');

var Data = {
  upload: (data) => {
    const URL = "/dataman/upload/";

    $.ajax({
      url: URL,
      data: data,
      type: 'POST',
      contentType: false,
      processData: false,
    })
    .done(function(res, textStatus, jqXHR){
        console.log(res);
    })
    .fail(function(jqXHR, textStatus, errorThrown){
        console.log("[error] data file upload")
    });
  },
  update_data: (data, cb) => {
    const URL = "/dataman/update/"

    $.ajax({
      url: URL,
      data: JSON.stringify(data),
      type: 'POST',
      contentType: false,
      processData: false,
    })
    .done(function(res, textStatus, jqXHR){
        cb();
    })
    .fail(function(jqXHR, textStatus, errorThrown){
        console.log("[error] data update")
    });
  },
  list: (id, cb) => {
    const URL = "/api/data/" + id + "/list";

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
      console.log("[API Error] list_data")
    });
  },
  load_csv: (data, cb) => {
    const URL = "/api/data/csv";

    $.ajax({
      url: URL,
      data: JSON.stringify(data),
      type: 'POST',
      contentType: false,
      processData: false,
    })
    .done(function(res, textStatus, jqXHR){
        cb(res);
    })
    .fail(function(jqXHR, textStatus, errorThrown){
        console.log("[error] data file upload")
    });
  },
  update_dataset: (data, cb) => {

  },
};

export default Data;
