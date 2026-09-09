export type BreadcrumbProps = {
  className?: string;
  children: React.ReactNode;
};

export type BreadcrumbItemProps = {
  path?: string;
} & Pick<BreadcrumbProps, 'children'>