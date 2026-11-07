import type { FrontendModuleDefinition } from '@r3/common';
import { BookmarksPage } from '../pages/BookmarksPage';
import { Extension as BookmarksIcon } from '@mui/icons-material';

// Augment the shared Permission type with this module's permission keys.
declare module '@r3/common/permissions-augmentable' {
  interface CustomPermissionMap {
    'bookmarks.view': true;
  }
}

export const bookmarksFrontendModule: FrontendModuleDefinition = {
  id: 'bookmarks',
  routes: [
    {
      path: '/bookmarks',
      component: BookmarksPage,
      requiredPermissions: ['bookmarks.view'],
    },
  ],
  menuItems: [
    {
      text: 'bookmarks.menu.title',
      path: '/bookmarks',
      // NOSONAR(typescript:S6770): the module placeholder in this aliased import contains
      // underscores and doesn't match the PascalCase naming convention; scaffold-module.cjs
      // substitutes it with a real PascalCase name (e.g. `WidgetsIcon`) when this blueprint
      // is copied into a generated module, which satisfies the convention.
      icon: <BookmarksIcon />,
      requiredPermissions: ['bookmarks.view'],
    },
  ],
};

export default bookmarksFrontendModule;
