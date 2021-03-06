import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { TokenRepositoryInMemory } from '@modules/accounts/repositories/in-memory/TokenRepositoryInMemory';
import { UserRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UserRepositoryInMemory';
import { ITokenRepository } from '@modules/accounts/repositories/ITokenRepository';
import { AuthenticateUserUseCase } from '@modules/accounts/useCases/authenticateUser/AuthenticateUserUseCase';
import { CreateUserUseCase } from '@modules/accounts/useCases/createUser/CreateUserUseCase';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { AppError } from '@shared/errors/AppError';

let userRepositoryInMemory: UserRepositoryInMemory;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let tokensRepositoryInMemory: ITokenRepository;
let dateProvider: IDateProvider;

describe('Authenticate User', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    tokensRepositoryInMemory = new TokenRepositoryInMemory();
    dateProvider = new DayJsDateProvider();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      userRepositoryInMemory,
      tokensRepositoryInMemory,
      dateProvider,
    );
  });

  it('should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      driver_license: '00123',
      email: 'user@test.com',
      name: 'User Test',
      password: '1234',
    };
    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });
    expect(result).toHaveProperty('token');
  });

  it('should not authenticate an non-existing user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'user@test.com',
        password: '1234',
      }),
    ).rejects.toEqual(new AppError('Email or password incorrect'));
  });

  it('should not be able to authenticate with incorrect password', async () => {
    const user: ICreateUserDTO = {
      driver_license: '00123',
      email: 'user@test.com',
      name: 'User Test',
      password: '1234',
    };
    await createUserUseCase.execute(user);
    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: 'wrong_password',
      }),
    ).rejects.toEqual(new AppError('Email or password incorrect'));
  });
  it('should delete old user token when create a new refreshtoken', async () => {
    const user: ICreateUserDTO = {
      driver_license: '00123',
      email: 'user@test.com',
      name: 'User Test',
      password: '1234',
    };
    await createUserUseCase.execute(user);

    await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });
    await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const result = await tokensRepositoryInMemory.getAll();

    expect(result.length).toBe(1);
  });
});
