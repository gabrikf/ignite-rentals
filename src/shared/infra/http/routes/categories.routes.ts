import { Router } from 'express';
import multer from 'multer';

import { CreateCategoryController } from '@modules/cars/useCases/createCategory/CreateCategoryController';
import { ImportCategoriesController } from '@modules/cars/useCases/importCategory/ImportCategoryController';
import { ListCategoryController } from '@modules/cars/useCases/listCategories/ListCategoryController';

import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAuthenticated } from '../middlewares/ensureAuthentitedec';

export const categoriesRouter = Router();

const upload = multer({
  dest: './tmp',
});

const createCategoryController = new CreateCategoryController();
const listeCategoryController = new ListCategoryController();
const importCategoryController = new ImportCategoriesController();

categoriesRouter.post(
  '/',
  ensureAuthenticated,
  createCategoryController.handle,
);

categoriesRouter.get('/', listeCategoryController.handle);
categoriesRouter.post(
  '/import',
  upload.single('file'),
  ensureAuthenticated,
  ensureAdmin,
  importCategoryController.handle,
);
