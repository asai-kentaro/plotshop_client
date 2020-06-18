const $ = require('jquery');

const Analysis = {
  cluster_kmeans: (data_2dim, clu_num, cb) => {
    const URL = "/api/analysis/kmeans";
    const data = {
      data: data_2dim,
      clu_num: clu_num,
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
      console.log("[API Error] analysis_kmeans")
    });
  },
  cluster_dbscan: (data_2dim, eps, cb) => {
    const URL = "/api/analysis/dbscan";
    const data = {
      data: data_2dim,
      eps: eps,
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
      console.log("[API Error] analysis_dbscan")
    });
  },
}

export default Analysis;
