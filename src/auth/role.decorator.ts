import { SetMetadata } from '@nestjs/common';
import { Rol, RolEnumType } from 'src/roles/entities/role.entity';
// import { UserRole } from 'src/users/entities/user.entity';

export type AllowedRoles = keyof typeof RolEnumType | "any";

export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);