import { InferDataFromTag, QueryKey, Updater, useQuery, useQueryClient } from '@tanstack/react-query';

interface Params<TInitialData = unknown, TQueryKey extends QueryKey = QueryKey> {
  queryKey: TQueryKey;
  initialData?: TInitialData;
}

export const useQueryState = <
  TInitialData extends Updater<
    NoInfer<InferDataFromTag<unknown, TQueryKey>> | undefined,
    NoInfer<InferDataFromTag<unknown, TQueryKey>> | undefined
  > = any,
  TQueryKey extends QueryKey = QueryKey,
>(
  params: Params<TInitialData, TQueryKey>
) => {
  const { queryKey, initialData } = params;

  const queryClient = useQueryClient();

  const { data: currentData } = useQuery<TInitialData>({
    queryKey,
    initialData,
    enabled: false,
    queryFn: async () => {
      return initialData as TInitialData;
    },
  });

  const setState = (data: TInitialData) => {
    queryClient.setQueryData(queryKey, data);
  };

  return { data: currentData, setState };
};
