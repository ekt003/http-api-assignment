// function to respond with a json object
// takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondXML = (request, response, status, content) => {
  response.writeHead(status, { 'Content-Type': 'text/xml' });
  response.write(content);
  response.end();
};

const respond = (request, response, location, params) => {
  const acceptedTypes = request.headers.accept.split(',');

  let id = 'success';
  let code = 200;
  let message = 'This is a successful response.';

  // processing the results for every page
  // done here because for whatever reason it breaks in server.js
  // and I am very tired and don't want to try to understand why
  switch (location) {
    case '/success':
      code = 200;
      break;
    case '/badRequest':
      if (params.valid === 'true') {
        message = 'Has all necessary parameters';
        code = 200;
      } else {
        message = 'Missing valid query parameter set to true';
        id = 'Bad request';
        code = 400;
      }
      break;
    case '/unauthorized':
      if (params.loggedIn === 'yes') {
        message = 'You have successfully viewed this content';
      } else {
        code = 401;
        message = 'Missing login parameter';
        id = 'Missing params';
      }
      break;
    case '/forbidden':
      id = 'forbidden';
      message = 'You do not have access to this content';
      code = 403;
      break;
    case '/internal':
      id = 'internal';
      message = 'Internal Server Error. Something went wrong.';
      code = 500;
      break;
    case '/notImplemented':
      id = 'notImplemented';
      message = 'A get request for this page has not been implemented yet.';
      code = 501;
      break;
    default:
      id = 'notFound';
      message = 'The page you are looking for was not found';
      code = 404;
      break;
  }

  // deals with which type of response is requested, XML or JSON
  if (acceptedTypes[0] === 'text/xml') {
	// create a valid XML string with name and age tags.
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${message}</message>`;
    responseXML = `${responseXML} <id>${id}</id>`;
    responseXML = `${responseXML} </response>`;

	// return response passing out string and content type
    return respondXML(request, response, code, responseXML);
  }
  const respondJson = {};
  respondJson.message = message;
  respondJson.id = id;
  return respondJSON(request, response, code, respondJson);
};

// public exports
module.exports = {
  respond,
};
