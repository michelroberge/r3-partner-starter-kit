import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@mui/material';
import { CrudPage, useFeatureFlags, type DataTableColumn } from '@r3/frontend/react';
import { Navigate } from 'react-router-dom';

// NOSONAR(typescript:S101): the entity placeholder in this interface name contains
// underscores and doesn't match the PascalCase naming convention; scaffold-module.cjs
// substitutes it with a real PascalCase name (e.g. `Widget`) when this blueprint is
// copied into a generated module, which satisfies the convention.
interface Bookmark {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

// NOSONAR(typescript:S6440): the entity-plural placeholder in this function name is a
// scaffold token that doesn't start with an uppercase letter, so the hook calls below
// don't look like they're inside a component; scaffold-module.cjs substitutes it with a
// real PascalCase name (e.g. `WidgetsPage`) when this blueprint is copied into a
// generated module, which satisfies the naming convention.
export function BookmarksPage() {
  const { t } = useTranslation();
  const { isEnabled, loading: flagsLoading } = useFeatureFlags();

  if (flagsLoading) return <CircularProgress />;
  if (!isEnabled('bookmarks.enabled')) return <Navigate to="/dashboard" />;

  const columns: DataTableColumn<Bookmark>[] = [
    { key: 'name', label: t('bookmarks.fields.name') },
    {
      key: 'url',
      label: t('bookmarks.fields.url'),
      render: (row) => (
        <a href={row.url} target="_blank" rel="noopener noreferrer">
          {row.url}
        </a>
      ),
    },
    {
      key: 'createdAt',
      label: t('bookmarks.fields.createdAt'),
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      key: 'updatedAt',
      label: t('bookmarks.fields.updatedAt'),
      render: (row) => new Date(row.updatedAt).toLocaleString(),
    },
  ];

  return (
    <CrudPage<Bookmark>
      title={t('bookmarks.title')}
      endpoint="/bookmarks"
      columns={columns}
      fields={[
        { name: 'name', label: t('bookmarks.fields.name'), required: true },
        { name: 'url', label: t('bookmarks.fields.url'), required: true },
      ]}
      emptyMessage={t('bookmarks.empty')}
      deleteConfirmMessage={(item) => t('bookmarks.confirmDelete', { name: item.name })}
    />
  );
}

export default BookmarksPage;
