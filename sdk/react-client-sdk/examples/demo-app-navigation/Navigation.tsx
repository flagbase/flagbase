import React from 'react';
import { useFeatureFlag } from '../../src'

const Navigation = () => {
    const navbarVariation = useFeatureFlag("new-app-navigation", "control");
    return navbarVariation === "treatment" ? <>Treatment</> : <>Control</>
};

export default Navigation;