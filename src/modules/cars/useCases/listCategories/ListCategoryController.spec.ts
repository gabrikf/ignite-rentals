import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm/index';

let connection: Connection;
describe('ListCategories', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash('admin', 8);
    await connection.query(
      `INSERT INTO users(id, name, email, password, "isAdmin", created_at, driver_license)
            values('${id}', 'admin','admin@adm.ui' ,'${password}', true, 'now()','XXXXXXXXXX')`,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it('should be able to list all categories', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@adm.ui',
      password: 'admin',
    });
    const { token } = responseToken.body;

    await request(app)
      .post('/categories')
      .send({
        name: 'SUV2',
        description: 'SUV, carro robusto',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    const response = await request(app).get('/categories').set({
      Authorization: token,
    });
    expect.assertions(4);
    expect(response.body.length).toBe(1);
    expect(response.status).toBe(200);
    expect(response.body[0].name).toEqual('SUV2');
    expect(response.body[0]).toHaveProperty('id');
  });
});
