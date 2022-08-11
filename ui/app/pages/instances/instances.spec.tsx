import React from 'react'
import { render, waitFor, screen, fireEvent } from '@testing-library/react'

import Instances from './instances'
import { AddNewInstanceModal } from './instances.modal'

test('Instance List should render', () => {
    const page = render(<Instances />)
    expect(page).toMatchSnapshot()
})

test('Add new instance modal should render', async () => {
    const setVisible = jest.fn()
    const modal = render(<AddNewInstanceModal visible={true} setVisible={setVisible} />)
    await waitFor(() => screen.getByRole('heading'))

    expect(screen.getByRole('heading')).toHaveTextContent('Add a new instance')
    expect(
        screen.getByRole('button', {
            name: 'Submit',
        })
    ).toHaveTextContent('Submit')
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
})

test('should submit filled out form', async () => {
    const setVisible = jest.fn()
    render(<AddNewInstanceModal visible={true} setVisible={setVisible} />)
    fireEvent.change(screen.getByLabelText('Instance Name'), { target: { value: 'Local' } })
    expect(screen.getByLabelText('Instance Name')).toHaveValue('Local')
})
