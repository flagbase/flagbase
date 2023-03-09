import React from 'react'

const OldNavigation: React.FC = () => {
    return (
        <div style={{ backgroundColor: 'black', color: 'yellow', height: '100%', width: '100%', padding: '5px' }}>
            Old Navigation
            <ul>
                <li><a href="">Some item</a></li>
                <li><a href="">Some other item</a></li>
                <li><a href="">Yet another item</a></li>
                <li><a href="">Another item</a></li>
                <li><a href="">Last item</a></li>
            </ul>
        </div>
    )
}

export default OldNavigation;