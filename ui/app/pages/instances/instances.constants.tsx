import * as Yup from 'yup'

export const constants = {
    title: 'Instances',
    headline: 'Connect to an instance',
    error: 'Could not load this instance',
    loading: 'Loading...',
}

export const instanceColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'URL',
        dataIndex: 'connectionString',
        key: 'connectionString',
    },
]

export const InstanceSchema = Yup.object().shape({
    key: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('This field is required'),
    connectionString: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('This field is required'),
    accessKey: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('This field is required'),
    accessSecret: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('This field is required'),
})
