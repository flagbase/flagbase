import React, { createContext, useContext, useState } from 'react'
import { Notification } from '../../components/notification/notification'

type NotificationType = {
    title: string
    content: string
    type: 'success' | 'error' | 'warning' | 'info'
    show?: boolean
    timeout?: number
}
interface NotificationContextProps {
    notifications: NotificationType[]
    // eslint-disable-next-line no-unused-vars
    addNotification: (notification: NotificationType) => void
    // eslint-disable-next-line no-unused-vars
    removeNotification: (index: number) => void
}

// Create a context for the notification state and actions
const NotificationContext = createContext<NotificationContextProps>({
    notifications: [],
    addNotification: () => {},
    removeNotification: () => {},
})

// Define a provider component that wraps the app and provides the notification context
export const NotificationProvider: React.FC = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationType[]>([])

    // Add a new notification to the array
    const addNotification = (notification: NotificationType) => {
        setNotifications([...notifications, notification])
    }

    // Remove a notification from the array by its index
    const removeNotification = (index: number) => {
        setNotifications([...notifications.slice(0, index), ...notifications.slice(index + 1)])
    }

    // Define the value of the context provider
    const contextValue: NotificationContextProps = {
        notifications,
        addNotification,
        removeNotification,
    }

    // Render the provider component with the context value and child components
    return (
        <NotificationContext.Provider value={contextValue}>
            {notifications.map(({ show = true, timeout = 3000, type, title, content }, index) => (
                <Notification show={show} key={index} type={type} title={title} content={content} />
            ))}
            {children}
        </NotificationContext.Provider>
    )
}

// Define a custom hook for accessing the notification context
export const useNotification = (): NotificationContextProps => useContext(NotificationContext)
