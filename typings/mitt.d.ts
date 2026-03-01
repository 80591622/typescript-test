// declare.d.ts
declare module 'mitt' {
  type EventType = string | symbol;
  type Handler<T = unknown> = (event: T) => void;
  type WildcardHandler<T = unknown> = (type: EventType, event: T) => void;

  interface Emitter<T = Record<EventType, unknown>> {
    on<TEvent = unknown>(type: EventType, handler: (event: TEvent) => void): void;
    on(type: '*', handler: (type: EventType, event: unknown) => void): void;
    off<TEvent = unknown>(type: EventType, handler: (event: TEvent) => void): void;
    off(type: '*', handler: (type: EventType, event: unknown) => void): void;
    emit<TEvent = unknown>(type: EventType, event: TEvent): void;
    all: Map<EventType, Function[]>;
  }

  function mitt<T = Record<EventType, unknown>>(): Emitter<T>;

  export default mitt;
}
declare module '*.jpg' {
  const str: string;
  export default str;
}
