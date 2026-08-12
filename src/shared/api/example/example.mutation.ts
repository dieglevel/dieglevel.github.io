import { exampleKeys } from './example.keys'
import {
  useMutationPatch,
  useMutationPost,
} from '@/shared/lib/api/mutation/useMutation'

// useMutation<Entity>
export const useMutationExample = () => {
  const mExample_CreateProduct = useMutationPost<
    void,
    FormData,
    '/admin/products/custom',
    {
      product: string
    }
  >({
    endPoint: '/admin/products/custom',
    queryKey: exampleKeys.lists(),
  })

  const mExample_UpdateMainInformationProduct = useMutationPatch<
    void,
    FormData,
    '/admin/products/custom/:id',
    {
      id: string
    }
  >({
    endPoint: '/admin/products/custom/:id',
    queryKey: [exampleKeys.lists(), exampleKeys.details()],
  })

  const mExample_UpdateConfigProduct = useMutationPatch<
    void,
    FormData,
    '/admin/products/custom/configs/:id',
    {
      id: string
    }
  >({
    endPoint: '/admin/products/custom/configs/:id',
    queryKey: [exampleKeys.lists(), exampleKeys.details()],
  })

  return {
    mExample_CreateProduct,
    mExample_UpdateMainInformationProduct,
    mExample_UpdateConfigProduct,
  }
}
