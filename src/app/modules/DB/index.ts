import colors from 'colors';
import { User } from '../user/user.model';
import { logger } from '../../../shared/logger';
import { USER_ROLES } from '../../../enums/user';
import config from '../../../config';

const superUser = {
  name: 'Pasqual Alen',
  role: USER_ROLES.SUPER_ADMIN,
  email: config.super_admin.email,
  password: config.super_admin.password,
  verified: true,
};

const seedSuperAdmin = async () => {
  const isExistSuperAdmin = await User.findOne({
    role: USER_ROLES.SUPER_ADMIN,
  });

  if (!isExistSuperAdmin) {
    await User.create(superUser);
    logger.info(colors.green('✔ Super admin created successfully!'));
  }
};

export default seedSuperAdmin;
