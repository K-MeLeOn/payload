import type { PayloadRequest, SanitizedCollectionConfig } from 'payload/types'

import { type QueryDrafts, combineQueries } from 'payload/database'
import { buildVersionCollectionFields } from 'payload/versions'
import toSnakeCase from 'to-snake-case'

import { findMany } from './find/findMany'

export const queryDrafts: QueryDrafts = async function queryDrafts({
  collection,
  limit,
  locale,
  page = 1,
  pagination,
  req = {} as PayloadRequest,
  sort,
  where,
}) {
  const collectionConfig: SanitizedCollectionConfig = this.payload.collections[collection].config
  const tableName = `_${toSnakeCase(collection)}_v`
  const fields = buildVersionCollectionFields(collectionConfig)

  const combinedWhere = combineQueries({ latest: { equals: true } }, where)

  const result = await findMany({
    adapter: this,
    fields,
    limit,
    locale,
    page,
    pagination,
    req,
    sort,
    tableName,
    version: true,
    where: combinedWhere,
  })

  return {
    ...result,
    docs: result.docs.map((doc) => {
      // eslint-disable-next-line no-param-reassign
      doc = {
        id: doc.parent,
        ...doc.version,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }

      return doc
    }),
  }
}
