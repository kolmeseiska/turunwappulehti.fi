import { Text } from '@chakra-ui/react'
import React from 'react'

type Props = {
  rank: number
}

type TextStyle = {
  fontSize: string,
  color: string
}
const textStyles: Record<number, TextStyle> = {
  1: {
    fontSize: '2xl',
    color: '#fad643'
  },
  2: {
    fontSize: 'xl',
    color: '#6c757d'
  },
  3: {
    fontSize: 'lg',
    color: '#cd7f32'
  }
}

const Rank = ({ rank }: Props) => {
  const textProps = textStyles[rank as keyof typeof textStyles]
  return (
    <Text fontSize={textProps?.fontSize} color={textProps?.color}>
      #{rank}
    </Text>
  )
}

export default Rank