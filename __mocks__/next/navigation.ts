export const useRouter = () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() });
export const useSearchParams = () => ({ get: () => null, toString: () => '' });
export const usePathname = () => '/';
