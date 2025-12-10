import { PictureOutlined } from '@ant-design/icons'
import ModelAvatar from '@renderer/components/Avatar/ModelAvatar'
import { useTimer } from '@renderer/hooks/useTimer'
import type { Assistant, FileMetadata } from '@renderer/types'
import { Input as AntdInput, Tooltip } from 'antd'
import type { InputRef } from 'rc-input/lib/interface'
import React, { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface InputBarProps {
  text: string
  assistant: Assistant
  referenceText: string
  placeholder: string
  loading: boolean
  files: FileMetadata[]
  onSelectImages: () => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputBar = ({
  ref,
  text,
  assistant,
  placeholder,
  loading,
  files,
  onSelectImages,
  handleKeyDown,
  handlePaste,
  handleChange
}: InputBarProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const inputRef = useRef<InputRef>(null)
  const { t } = useTranslation()
  const { setTimeoutTimer } = useTimer()
  const hasAttachment = useMemo(() => files.length > 0, [files.length])
  if (!loading) {
    setTimeoutTimer('focus', () => inputRef.current?.input?.focus(), 0)
  }
  return (
    <InputWrapper ref={ref}>
      {assistant.model && <ModelAvatar model={assistant.model} size={30} />}
      <Input
        value={text}
        placeholder={placeholder}
        variant="borderless"
        autoFocus
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onChange={handleChange}
        ref={inputRef}
        suffix={
          <Tooltip title={t('chat.input.upload.attachment')}>
            <IconButton onClick={onSelectImages} disabled={loading} $active={hasAttachment}>
              <PictureOutlined />
            </IconButton>
          </Tooltip>
        }
      />
    </InputWrapper>
  )
}
InputBar.displayName = 'InputBar'

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`

const Input = styled(AntdInput)`
  background: none;
  border: none;
  -webkit-app-region: none;
  font-size: 18px;
`

const IconButton = styled.button<{ $active?: boolean }>`
  border: none;
  background: ${({ $active }) => ($active ? 'var(--color-primary-100)' : 'transparent')};
  padding: 4px 8px;
  border-radius: 4px;
  color: ${({ $active }) => ($active ? 'var(--color-primary)' : 'inherit')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    cursor: not-allowed;
    color: var(--color-text-3);
  }

  &:hover {
    background: var(--color-primary-50);
    color: var(--color-primary);
  }
`

export default InputBar
