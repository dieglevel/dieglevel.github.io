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
    queryKey: ['createProduct'],
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
    queryKey: ['updateMainInformationProduct'],
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
    queryKey: ['updateConfigProduct'],
  })

  return {
    mExample_CreateProduct,
    mExample_UpdateMainInformationProduct,
    mExample_UpdateConfigProduct,
  }
}
