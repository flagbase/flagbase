import styled from '@emotion/styled'
import { Layout } from 'antd'

const { Content } = Layout

export const PageContainer = styled(Content)`
    padding: 2em;
    margin: 0 auto;

    @media (min-width: 768px) {
        max-width: 80vw;
    }

    @media (min-width: 1200px) {
        max-width: 60vw;
    }
`
