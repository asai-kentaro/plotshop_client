import config from "../config";
const $ = require('jquery');

const Data = {
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
