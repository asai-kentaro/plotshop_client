import request from 'superagent';
import config from "../config";


var Test = {
  test: (cb) => {
    const URL = "/api/test/";

    request
      .get(URL)
      //.set('x-access-token', api.state.token)
      .end((err, res) => {
        if(res.ok) {

          console.log(res.body);
        } else {
          console.log("[API Error] test")
        }
      });
  },
};

export default Test;
