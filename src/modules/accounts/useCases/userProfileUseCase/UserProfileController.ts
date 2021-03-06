import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UserProfileUseCase } from './UserProfileUseCase';

export class UserProfileController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userProfileUseCase = container.resolve(UserProfileUseCase);
    const { id } = request.params;
    const user = await userProfileUseCase.execute(id);
    return response.status(200).json(user);
  }
}
