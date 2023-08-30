import type { ElementType } from 'react'

import React, { useCallback, useState } from 'react'
import { useSlate } from 'slate-react'

import type { ButtonProps } from './types.js'

import Tooltip from '../../../../elements/Tooltip/index.js'
import '../buttons.scss'
import isElementActive from './isActive.js'
import toggleElement from './toggle.js'

export const baseClass = 'rich-text__button'

const ElementButton: React.FC<ButtonProps> = (props) => {
  const { children, className, el = 'button', format, onClick, tooltip, type = 'type' } = props

  const editor = useSlate()
  const [showTooltip, setShowTooltip] = useState(false)

  const defaultOnClick = useCallback(
    (event) => {
      event.preventDefault()
      setShowTooltip(false)
      toggleElement(editor, format, type)
    },
    [editor, format, type],
  )

  const Tag: ElementType = el

  return (
    <Tag
      {...(el === 'button' && { type: 'button' })}
      className={[
        baseClass,
        className,
        isElementActive(editor, format, type) && `${baseClass}__button--active`,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick || defaultOnClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {tooltip && <Tooltip show={showTooltip}>{tooltip}</Tooltip>}
      {children}
    </Tag>
  )
}

export default ElementButton