import { useEffect, useCallback, useRef } from 'react';
import * as Speech from 'expo-speech';
import type { Pose, AgeTier } from '../types';

// Preferred female English voices — checked at runtime, first available wins
const FEMALE_VOICE_IDENTIFIERS = [
  'com.apple.ttsbundle.Samantha-compact',  // iOS Samantha (warm US female)
  'com.apple.ttsbundle.Karen-compact',     // iOS Karen (AU female)
  'com.apple.voice.compact.en-GB.Kate',   // iOS Kate (UK female)
  'en-gb-x-gba-network',                  // Android UK female
  'en-us-x-sfg-network',                  // Android US female (Sofia)
  'en-us-x-iom-network',                  // Android US female (Ingrid)
];

async function pickFemaleVoice(): Promise<string | undefined> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    for (const id of FEMALE_VOICE_IDENTIFIERS) {
      if (voices.find((v) => v.identifier === id)) return id;
    }
    // Fallback: any available English female voice
    const fallback = voices.find(
      (v) => v.language.startsWith('en') && v.quality !== 'Default' &&
             (v.name.toLowerCase().includes('female') ||
              ['samantha','karen','kate','victoria','fiona','moira','tessa',
               'allison','ava','susan','zoe','sofia','ingrid'].some(n => v.name.toLowerCase().includes(n)))
    );
    return fallback?.identifier;
  } catch {
    return undefined;
  }
}

export function usePoseNarration(audioEnabled: boolean) {
  const voiceRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    pickFemaleVoice().then((id) => { voiceRef.current = id; });
    return () => { Speech.stop(); };
  }, []);

  const speakCalm = useCallback((text: string, tier: AgeTier) => {
    Speech.stop();
    Speech.speak(text, {
      language: 'en-US',
      voice: voiceRef.current,
      pitch: tier === 'seedling' ? 1.15 : 1.0,
      rate:  tier === 'seedling' ? 0.78 : 0.82,
      onError: () => {},
    });
  }, []);

  const narratePose = useCallback((pose: Pose, tier: AgeTier) => {
    if (!audioEnabled) return;

    const name = tier === 'seedling'
      ? (pose.animalName ?? pose.englishName)
      : tier === 'explorer'
      ? pose.englishName
      : `${pose.englishName}. ${pose.sanskritName}`;

    const instruction = tier === 'seedling'
      ? ''
      : pose.howItHelps.split(' ').slice(0, 18).join(' ');

    speakCalm(instruction ? `${name}. ${instruction}` : name, tier);
  }, [audioEnabled, speakCalm]);

  const narrateTransition = useCallback((nextPoseName: string) => {
    if (!audioEnabled) return;
    speakCalm(`Now move into ${nextPoseName}`, 'explorer');
  }, [audioEnabled, speakCalm]);

  const stop = useCallback(() => { Speech.stop(); }, []);

  return { narratePose, narrateTransition, stop };
}
