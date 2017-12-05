module.exports = (env = 'development') => {
  const ENV = {
    HOST: '',
    NAMESPACE: '/api/v1',
    AUTH: '/sessions'
  };

  if (env === 'development') {
    ENV.HOST = 'https://code-review.herokuapp.com';
  }

  return ENV;
};