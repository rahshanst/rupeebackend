const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');
const cors = require('cors');
const { connectDB } = require("./db/connect");
const jsyaml = require('js-yaml');
const swaggerTools = require('swagger-tools');
const { env } = require('process');


const app = express();
app.use(cookieParser());
app.use(cors());
const serverPort = process.env.PORT || 9000;
let domainUrl = "*";

connectDB();

const swaggerSpec = jsyaml.load(fs.readFileSync(path.join(__dirname, 'api/swagger.yaml'), 'utf8'));
const swaggerOptions = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './api/controllers'),
  useStubs: process.env.APP_ENV === 'development',
};

app.use(bodyParser.text({ type: 'text/*' }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(expressSanitizer());

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.static('public'));
// Default route
app.get("/", (req, res) => {
  return res.status(200).json({
    msg: "Welcome to cheggout rupee api dev 3",
  });
});

app.use(express.static(path.join(__dirname, 'public')));

// Swagger middleware initialization
swaggerTools.initializeMiddleware(swaggerSpec, (middleware) => {
  app.use(middleware.swaggerMetadata());
  app.use(middleware.swaggerValidator());
  app.use(middleware.swaggerRouter(swaggerOptions));
  // Serve the Swagger documents and Swagger UI
  app.use('/rupee_store', middleware.swaggerUi());
});

const swaggerSpecForAdmin = jsyaml.load(fs.readFileSync(path.join(__dirname, 'adminAPI/swagger.yaml'), 'utf8'));
const swaggerOptionsForAdmin = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './adminAPI/controllers'),
  useStubs: process.env.APP_ENV === 'dev',
};
// Swagger middleware initialization
swaggerTools.initializeMiddleware(swaggerSpecForAdmin, (middleware) => {
  app.use(middleware.swaggerMetadata());
  app.use(middleware.swaggerValidator());
  app.use(middleware.swaggerRouter(swaggerOptionsForAdmin));
  // Serve the Swagger documents and Swagger UI
  app.use('/admin_api', middleware.swaggerUi());
});


const server = http.createServer(app).listen(serverPort, () => {
  const checkDate = new Date();
  console.log(`Your server is listening on port %d (http://localhost:%d) date time ${checkDate}`, serverPort, serverPort);
  console.log('Swagger-ui is available for flight on http://localhost:%d/rupee_store/docs/', serverPort);
  console.log('Swagger-ui is available for flight on http://localhost:%d/admin_api/docs/', serverPort);
});

server.keepAliveTimeout = 310 * 10000;
server.headersTimeout = 320 * 10000;
server.timeout = 320 * 10000;

module.exports = app;
