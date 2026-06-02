import { useState, useRef } from 'react';
import { useProfileStore } from '../../store/useProfileStore';

const LOCKOUT_MS = 30_000;
const MAX_ATTEMPTS = 3;

interface ParentGateHook {
  verifyPin: (entered: string) => boolean;
  onWrongPin: () => void;
  isLocked: () => boolean;
  remainingLockSeconds: () => number;
  failCount: number;
}

export function useParentGate(): ParentGateHook {
  const profile = useProfileStore((s) => s.profile);
  const [failCount, setFailCount] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const failCountRef = useRef(0);
  const lockedUntilRef = useRef<number | null>(null);

  function verifyPin(entered: string): boolean {
    return entered === profile?.parentPin;
  }

  function onWrongPin(): void {
    const next = failCountRef.current + 1;
    failCountRef.current = next;
    setFailCount(next);
    if (next >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCKOUT_MS;
      lockedUntilRef.current = until;
      setLockedUntil(until);
    }
  }

  function isLocked(): boolean {
    if (lockedUntilRef.current === null) return false;
    return Date.now() < lockedUntilRef.current;
  }

  function remainingLockSeconds(): number {
    if (lockedUntilRef.current === null) return 0;
    const rem = lockedUntilRef.current - Date.now();
    return rem > 0 ? Math.ceil(rem / 1000) : 0;
  }

  return { verifyPin, onWrongPin, isLocked, remainingLockSeconds, failCount };
}
