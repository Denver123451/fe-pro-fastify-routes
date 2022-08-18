import Fastify from 'fastify';

import { users } from './users';

const fastify = Fastify({
  logger: true,
});
fastify.register(import('@fastify/cors'));
fastify.register(import('@fastify/multipart'), {
  addToBody: true,
});
fastify.register(import('@fastify/cookie'));

fastify.post('/uppercase', (request, reply) => {
  const toUppCase = request.body.toUpperCase();
  if (toUppCase.includes('FUCK')) {
    return reply.status(403).send('unresolved');
  }
  return reply.send(toUppCase);
});

fastify.post('/lowercase', (request, reply) => {
  const toLowCase = request.body.toLowerCase();
  if (toLowCase.includes('fuck')) {
    return reply.status(403).send('unresolved');
  }
  return reply.send(toLowCase);
});

fastify.get('/user/:id', (request, reply) => {
  const { id } = request.params;

  if (users[id]) {
    return reply.send(users[id]);
  }
  reply.status(400).send('User not exist');
});

fastify.get('/users', (request, reply) => {
  // const queryFilter = request.query.filter;
  // const queryValue = request.query.value;
  //
  // const usersArray = Object.values(users).filter(user => {
  //   return user[queryFilter] == queryValue;
  // })
  // reply.send(usersArray);

  const { filter, value } = request.query;
  const usersArr = Object.values(users);
  if (!filter || !value) {
    return reply.send(usersArr);
  } else {
    const usersArray = usersArr.filter((user) => {
      return user[filter].toString() === value;
    });
    reply.send(usersArray);
  }
});

export default fastify;
