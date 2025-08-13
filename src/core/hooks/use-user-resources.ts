import type { MstResource } from '@/modules/resource/resource.model'
import { fetchUserResources } from '@/modules/resource/resource.service'
import { useQuery } from '@tanstack/react-query'

export function useUserResourcesQuery(userId: number) {
  return useQuery({
    queryKey: ['resources', userId],
    queryFn: (): Promise<MstResource[]> => fetchUserResources(userId),
    enabled: !!userId,
  })
}
