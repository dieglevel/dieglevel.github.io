// orval.config.ts
import { defineConfig } from 'orval'

const API_URL =
  process.env.ORVAL_API_URL || 'http://localhost:8386/swagger/json'

export default defineConfig({
  api: {
    input: API_URL,
    output: {
      workspace: 'src/shared/api-generated',
      mode: 'tags-split',
      target: './index.ts',
      client: 'react-query', // 🔥 Tự động tạo hooks react-query
      schemas: './schemas',
      clean: true,
      override: {
        mutator: {
          path: '../lib/api/axios.ts',
          name: 'customAxios',
        },
      },
    },
  },
})
