const ENV = process.env.NODE_ENV || 'development'

const testData
const devData


const data = {
  test: testData,
  development: devData
};

module.expports = data[ENV];
