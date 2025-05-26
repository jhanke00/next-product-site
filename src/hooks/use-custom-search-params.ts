import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useCustomSearchParams = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setSearchParams = (query?: Array<{ name: string; value: string }>, passedPathname = pathname) => {
    const params = new URLSearchParams(searchParams?.toString());

    query?.forEach(({ name, value }) => {
      params.set(name, value);
    });

    router.push(`${passedPathname}?${params.toString()}`);
  };

  return { setSearchParams, searchParams };
};
