import React from 'react'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'

import type { Props } from './types.js'

import payloadFavicon from '../../../assets/images/favicon.svg'
import payloadOgImage from '../../../assets/images/og-image.png'
import useMountEffect from '../../../hooks/useMountEffect.js'
import { useConfig } from '../Config/index.js'

const rtlLanguages = ['ar', 'fa', 'ha', 'ku', 'ur', 'ps', 'dv', 'ks', 'khw', 'he', 'yi']

const Meta: React.FC<Props> = ({
  description,
  keywords = 'CMS, Admin, Dashboard',
  // lang = 'en',
  meta = [],
  title,
}) => {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language
  const currentDirection = rtlLanguages.includes(currentLanguage) ? 'RTL' : 'LTR'

  const config = useConfig()
  const titleSuffix = config.admin.meta?.titleSuffix ?? '- Payload'
  const favicon = config.admin.meta.favicon ?? payloadFavicon
  const ogImage = config.admin.meta.ogImage ?? payloadOgImage

  useMountEffect(() => {
    const faviconElement = document.querySelector<HTMLLinkElement>('link[data-placeholder-favicon]')
    if (faviconElement) {
      faviconElement.remove()
    }
  })
  const HelmetToUse = Helmet as any

  return (
    <HelmetToUse
      htmlAttributes={{
        dir: currentDirection,
        lang: currentLanguage,
      }}
      link={[
        {
          href: favicon,
          rel: 'icon',
          type: 'image/svg+xml',
        },
      ]}
      meta={[
        {
          content: description,
          name: 'description',
        },
        {
          content: keywords,
          name: 'keywords',
        },
        {
          content: `${title} ${titleSuffix}`,
          property: 'og:title',
        },
        {
          content: ogImage,
          property: 'og:image',
        },
        {
          content: description,
          property: 'og:description',
        },
        {
          content: 'website',
          property: 'og:type',
        },
        {
          content: 'summary',
          name: 'twitter:card',
        },
        {
          content: title,
          name: 'twitter:title',
        },
        {
          content: description,
          name: 'twitter:description',
        },
      ].concat(meta)}
      title={`${title} ${titleSuffix}`}
    />
  )
}

export default Meta