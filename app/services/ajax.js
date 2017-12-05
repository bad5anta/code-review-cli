const fetch = require('node-fetch');
const querystring = require('querystring');
const colors = require('colors');


module.exports = (vorpal, config) => {
  return {
    _buildUrl(path) {
      return `${config.HOST}${config.NAMESPACE}${path}`;
    },

    get(path, params) {
      let query = '';

      if (params) {
        query = `?${querystring.stringify(params)}`;
      }

      return fetch(`${this._buildUrl(path)}${query}`).then(this._response.bind(this));
    },

    post(path, data, headers = { 'Content-Type': 'application/json' }) {
      return fetch(this._buildUrl(path), {
        method: 'POST',
        body: JSON.stringify(data),
        headers: headers
      }).then(this._response.bind(this));
    },

    _response(res) {
      if (res.ok) {
        return res.json();
      } else {
        vorpal.log(colors.red(`[serverError] ${res.status} ${res.statusText}`));
      }
    }
  };
};