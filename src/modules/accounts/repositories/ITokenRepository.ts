import { Tokens } from '@modules/accounts/infra/typeorm/entities/Tokens';

import { ITokenDTO } from '../dtos/ITokenDTO';

export interface ITokenRepository {
  create({ expires_date, refresh_token, user_id }: ITokenDTO): Promise<Tokens>;
  findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string,
  ): Promise<Tokens>;
  findAllByUser(id: string): Promise<Tokens[]>;
  deleteById(id: string): Promise<void>;
  massiveDeleteById(ids: string[]): Promise<void>;
  findByToken(token: string): Promise<Tokens>;
  getAll(): Promise<Tokens[]>;
}
