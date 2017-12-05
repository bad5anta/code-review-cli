module.exports = (vorpal, config) => {
  return {
    fetchList(force = false) {
      const stored = this.getList();

      if (stored.length > 0 && !force) {
        return Promise.resolve(stored);
      }

      return config.SERVICE.ajax.get('/stacks').then(({ data }) => {
        if (data) {
          vorpal.localStorage.setItem('stacks', JSON.stringify(data));
        }

        return data || [];
      });
    },

    getList() {
      const data = vorpal.localStorage.getItem('stacks');

      return data && JSON.parse(data) || [];
    }
  };
};