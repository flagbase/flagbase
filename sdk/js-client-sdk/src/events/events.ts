import { EventType } from "./event-type";

type ListenerFn = (eventMessage: string, eventContext?: any) => void;

type EventsMap = {
  [eventName: string]: {
    [listenerFnStr: string]: ListenerFn;
  };
};

export interface EventProducer {
  emit: (
    eventName: EventType,
    eventMessage: string,
    eventContext?: object | string
  ) => void;
}

export interface EventConsumer {
  on: (eventName: EventType, listenerFn: ListenerFn) => void;
  off: (eventName: EventType, listenerFn?: ListenerFn) => void;
  clear: () => void;
}

export interface IEvents extends EventProducer, EventConsumer {}

export default function Events(): IEvents {
  let events: EventsMap = {};

  const emit: EventProducer["emit"] = (
    eventName,
    eventMessage,
    eventContext
  ) => {
    if (!events.hasOwnProperty(eventName)) {
      return;
    }
    Object.values(events[eventName]).forEach((listenerFn) =>
      listenerFn(eventMessage, eventContext)
    );
  };

  const on: EventConsumer["on"] = (eventName, listenerFn) => {
    if (!events.hasOwnProperty(eventName)) {
      events[eventName] = {};
    }
    if (typeof listenerFn === "function") {
      events[eventName] = {
        ...events[eventName],
        [listenerFn.toString()]: listenerFn,
      };
    }
  };

  const off: EventConsumer["off"] = (eventName, listenerFn) => {
    if (
      typeof listenerFn === "function" &&
      !events.hasOwnProperty(eventName) &&
      !events[eventName].hasOwnProperty(listenerFn.toString())
    ) {
      return;
    }

    if (
      typeof listenerFn === "function" &&
      events.hasOwnProperty(eventName) &&
      events[eventName].hasOwnProperty(listenerFn.toString())
    ) {
      delete events[eventName][listenerFn.toString()];
    } else if (
      typeof listenerFn !== "function" &&
      events.hasOwnProperty(eventName)
    ) {
      delete events[eventName];
    }
  };

  const clear: EventConsumer["clear"] = (): void => {
    events = {};
  };

  return {
    emit,
    on,
    off,
    clear,
  };
}
