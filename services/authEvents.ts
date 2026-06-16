/**
 * 앱 전역 인증 이벤트 버스.
 * api.ts 의 401 인터셉터가 여기에 'logout' 을 emit 하면
 * AuthContext 가 구독해 signOut 로직을 실행한다.
 */
type Listener = () => void | Promise<void>;

class AuthEventEmitter {
  private listeners: Map<string, Listener[]> = new Map();

  on(event: string, listener: Listener): void {
    const existing = this.listeners.get(event) ?? [];
    this.listeners.set(event, [...existing, listener]);
  }

  off(event: string, listener: Listener): void {
    const existing = this.listeners.get(event) ?? [];
    this.listeners.set(event, existing.filter((l) => l !== listener));
  }

  emit(event: string): void {
    (this.listeners.get(event) ?? []).forEach((l) => l());
  }
}

export const authEvents = new AuthEventEmitter();
