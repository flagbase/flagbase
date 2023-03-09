import React from 'react'

import OldNavigation from './old-navigation'
import NewNavigation from './new-navigation'

type Props = {
    showNewNavigation: boolean
}

const NavigationEntry: React.FC<Props> = ({ showNewNavigation }) => {

    return (showNewNavigation ? <NewNavigation /> : <OldNavigation />)
}

export default NavigationEntry;