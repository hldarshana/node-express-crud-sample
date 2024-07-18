var xml = require('xml2js');

const config = {};

config.xmlOptions = {
  charkey: 'value',
  trim: false,
  explicitRoot: false,
  explicitArray: false,
  normalizeTags: false,
  mergeAttrs: true,
};

config.builder = new xml.Builder({
  renderOpts: { 'pretty': false }
});

config.bustHeaders = (request, response, next) => {
  request.app.isXml = false;

  if (request.headers['content-type'] === 'application/xml'
    || request.headers['accept'] === 'application/xml'
  ) {
    request.app.isXml = true;
  }

  next();
};

config.buildResponse = (request, response, data, preTag) => {

  if(!data){
    response.json(null);
    return;
  }

  if (request.app.isXml) {
    response.setHeader('Content-Type', 'application/xml');
  }

  response.format({
    'application/json': () => {
      response.json(data);
    },
    'application/xml': () => {
      response.send(config.builder.buildObject({ [preTag]: data }));
    },
    'default': () => {
      // log the request and respond with 406
      response.status(406).send('Not Acceptable');
    }
  });
};

config.buildResponseForList = (request, response, data, preTag) => {

  if (request.app.isXml) {
    response.setHeader('Content-Type', 'application/xml');
  }

  response.format({
    'application/json': () => {
      response.json(data);
    },
    'application/xml': () => {
      response.send(config.builder.buildObject({ [preTag]: {total: data.total, employees: {employee: data.records}} }));
    },
    'default': () => {
      // log the request and respond with 406
      response.status(406).send('Not Acceptable');
    }
  });
};

module.exports = config;