const express = require('express');
const next = require('next');
const path = require('path');
const compression = require('compression');

require('dotenv').config({
  path: path.join(__dirname, '/../.env')
});

const PORT = Number(process.env.FRONTEND_PORT) || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost';
const ENV = process.env.NODE_ENV || 'development';

const dev = ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(compression());

    server.use('/service-worker.js', (req, res) => {
      app.serveStatic(
        req,
        res,
        path.join(__dirname, '.next', '/service-worker.js')
      );
    });

    server.get('/hello/:message', (req, res) => {
      const actualPage = '/hello';
      const queryParams = Object.assign({}, req.params, {
        message: req.params.message
      });

      app.render(req, res, actualPage, queryParams);
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, err => {
      if (err) {
        throw err;
      }

      console.clear();

      console.log(
        `Frontend template running on ${FRONTEND_URL}:${PORT} in ${ENV}`
      );
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
