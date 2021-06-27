export interface DeferredPromise<ResolveType, RejectType> {
  promise: Promise<ResolveType | undefined>;
  resolve: (value?: ResolveType) => void;
  reject: (reason: RejectType) => void;
}
