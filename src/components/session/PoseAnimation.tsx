import React, { useEffect, useRef } from 'react';
import { Animated, AccessibilityInfo } from 'react-native';
import Svg, { Circle, Rect, Path, Ellipse, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import type { AgeTier } from '../../types';

// Palette
const HEAD   = '#F9A825';
const BODY   = '#42A5F5';
const LIMB   = '#1E88E5';
const ACCENT = '#66BB6A';
const SKIN   = '#FFD54F';
const GLOW   = 'rgba(129,199,212,0.18)';

interface PoseAnimationProps {
  poseId: string;
  tier: AgeTier;
  size?: number;
}

// ─── Shared background glow ───────────────────────────────────────────────────
function BgGlow() {
  return (
    <>
      <Circle cx={100} cy={140} r={95} fill={GLOW} />
      <Circle cx={100} cy={140} r={68} fill="rgba(66,165,245,0.07)" />
    </>
  );
}

// ─── Pose silhouettes ─────────────────────────────────────────────────────────

function CatCow() {
  return (
    <G>
      <BgGlow />
      {/* Ground shadow */}
      <Ellipse cx={100} cy={225} rx={70} ry={10} fill="rgba(0,0,0,0.18)" />
      {/* Body on all fours, arched cat back */}
      <Path d="M55 170 Q100 108 145 170" stroke={BODY} strokeWidth={26} strokeLinecap="round" fill="none" />
      {/* Head */}
      <Circle cx={46} cy={168} r={22} fill={HEAD} />
      <Ellipse cx={40} cy={175} rx={8} ry={5} fill={SKIN} /> {/* snout */}
      {/* Front legs */}
      <Rect x={54} y={178} width={14} height={42} rx={7} fill={LIMB} />
      <Ellipse cx={61} cy={222} rx={12} ry={7} fill={ACCENT} />
      {/* Back legs */}
      <Rect x={130} y={178} width={14} height={42} rx={7} fill={LIMB} />
      <Ellipse cx={137} cy={222} rx={12} ry={7} fill={ACCENT} />
      {/* Tail curling up */}
      <Path d="M144 168 Q172 140 165 110" stroke={LIMB} strokeWidth={8} strokeLinecap="round" fill="none" />
      {/* Ear */}
      <Path d="M38 148 L28 132 L50 142 Z" fill={HEAD} />
      {/* Eye */}
      <Circle cx={52} cy={162} r={4} fill="#1A1A2E" />
    </G>
  );
}

function ChildsPose() {
  return (
    <G>
      <BgGlow />
      <Ellipse cx={100} cy={228} rx={75} ry={9} fill="rgba(0,0,0,0.18)" />
      {/* Rounded hips / folded knees */}
      <Ellipse cx={138} cy={195} rx={28} ry={22} fill={BODY} />
      {/* Torso curved forward */}
      <Path d="M128 185 Q100 168 68 175" stroke={BODY} strokeWidth={26} strokeLinecap="round" fill="none" />
      {/* Arms stretched forward */}
      <Path d="M80 172 L32 185" stroke={LIMB} strokeWidth={12} strokeLinecap="round" fill="none" />
      <Path d="M82 180 L34 193" stroke={LIMB} strokeWidth={10} strokeLinecap="round" fill="none" />
      {/* Hands */}
      <Ellipse cx={30} cy={188} rx={10} ry={7} fill={ACCENT} />
      <Ellipse cx={31} cy={196} rx={9} ry={6} fill={ACCENT} />
      {/* Head resting */}
      <Circle cx={58} cy={185} r={20} fill={HEAD} />
      {/* Shins on floor */}
      <Rect x={118} y={204} width={44} height={13} rx={6} fill={LIMB} />
      <Ellipse cx={152} cy={218} rx={16} ry={8} fill={ACCENT} />
    </G>
  );
}

function DownwardDog() {
  return (
    <G>
      <BgGlow />
      <Ellipse cx={100} cy={232} rx={70} ry={9} fill="rgba(0,0,0,0.18)" />
      {/* Hip apex highlight */}
      <Circle cx={100} cy={95} r={18} fill="rgba(102,187,106,0.25)" />
      {/* Left arm */}
      <Path d="M44 225 L100 95" stroke={BODY} strokeWidth={20} strokeLinecap="round" fill="none" />
      {/* Right leg */}
      <Path d="M100 95 L156 225" stroke={BODY} strokeWidth={20} strokeLinecap="round" fill="none" />
      {/* Head hanging between arms */}
      <Circle cx={58} cy={200} r={20} fill={HEAD} />
      {/* Hands */}
      <Ellipse cx={42} cy={228} rx={14} ry={8} fill={ACCENT} />
      <Ellipse cx={74} cy={228} rx={14} ry={8} fill={ACCENT} />
      {/* Feet */}
      <Ellipse cx={144} cy={228} rx={14} ry={8} fill={ACCENT} />
      <Ellipse cx={168} cy={228} rx={12} ry={8} fill={ACCENT} />
      {/* Hip dot */}
      <Circle cx={100} cy={95} r={10} fill={ACCENT} />
    </G>
  );
}

function MountainPose() {
  return (
    <G>
      <BgGlow />
      <Ellipse cx={100} cy={242} rx={38} ry={8} fill="rgba(0,0,0,0.18)" />
      {/* Head */}
      <Circle cx={100} cy={52} r={24} fill={HEAD} />
      {/* Neck */}
      <Rect x={91} y={74} width={18} height={18} rx={7} fill={SKIN} />
      {/* Torso */}
      <Path d="M72 90 Q100 86 128 90 L124 164 Q100 168 76 164 Z" fill={BODY} />
      {/* Left arm */}
      <Rect x={54} y={92} width={16} height={68} rx={8} fill={LIMB} />
      <Ellipse cx={62} cy={164} rx={10} ry={8} fill={ACCENT} />
      {/* Right arm */}
      <Rect x={130} y={92} width={16} height={68} rx={8} fill={LIMB} />
      <Ellipse cx={138} cy={164} rx={10} ry={8} fill={ACCENT} />
      {/* Left leg */}
      <Rect x={78} y={162} width={18} height={76} rx={9} fill={LIMB} />
      <Ellipse cx={87} cy={241} rx={16} ry={9} fill={ACCENT} />
      {/* Right leg */}
      <Rect x={104} y={162} width={18} height={76} rx={9} fill={LIMB} />
      <Ellipse cx={113} cy={241} rx={16} ry={9} fill={ACCENT} />
    </G>
  );
}

function TreePose() {
  return (
    <G>
      <BgGlow />
      <Ellipse cx={96} cy={242} rx={28} ry={8} fill="rgba(0,0,0,0.18)" />
      {/* Head */}
      <Circle cx={100} cy={48} r={24} fill={HEAD} />
      {/* Neck */}
      <Rect x={91} y={70} width={18} height={16} rx={7} fill={SKIN} />
      {/* Torso */}
      <Path d="M74 84 Q100 80 126 84 L122 158 Q100 162 78 158 Z" fill={BODY} />
      {/* Standing leg */}
      <Rect x={86} y={156} width={18} height={82} rx={9} fill={LIMB} />
      <Ellipse cx={95} cy={241} rx={16} ry={8} fill={ACCENT} />
      {/* Bent leg */}
      <Path d="M86 175 Q58 192 55 218" stroke={LIMB} strokeWidth={15} strokeLinecap="round" fill="none" />
      <Ellipse cx={56} cy={221} rx={12} ry={8} fill={ACCENT} />
      {/* Arms in circle overhead */}
      <Path d="M76 92 Q34 52 100 32 Q166 52 124 92" stroke={LIMB} strokeWidth={13} strokeLinecap="round" fill="none" />
      {/* Prayer hands */}
      <Ellipse cx={100} cy={32} rx={10} ry={8} fill={ACCENT} />
    </G>
  );
}

function WarriorI() {
  return (
    <G>
      <BgGlow />
      <Ellipse cx={100} cy={248} rx={55} ry={8} fill="rgba(0,0,0,0.18)" />
      {/* Head */}
      <Circle cx={102} cy={52} r={22} fill={HEAD} />
      <Rect x={93} y={72} width={18} height={16} rx={7} fill={SKIN} />
      {/* Torso upright */}
      <Path d="M78 86 Q102 82 126 86 L120 156 Q100 160 80 156 Z" fill={BODY} />
      {/* Left arm raised */}
      <Path d="M80 94 L60 34" stroke={LIMB} strokeWidth={14} strokeLinecap="round" fill="none" />
      <Ellipse cx={58} cy={30} rx={10} ry={8} fill={ACCENT} />
      {/* Right arm raised */}
      <Path d="M124 94 L144 34" stroke={LIMB} strokeWidth={14} strokeLinecap="round" fill="none" />
      <Ellipse cx={145} cy={30} rx={10} ry={8} fill={ACCENT} />
      {/* Front leg bent */}
      <Path d="M84 154 L64 205" stroke={LIMB} strokeWidth={17} strokeLinecap="round" fill="none" />
      <Path d="M64 205 L68 248" stroke={LIMB} strokeWidth={17} strokeLinecap="round" fill="none" />
      <Ellipse cx={68} cy={250} rx={16} ry={8} fill={ACCENT} />
      {/* Back leg extended */}
      <Path d="M118 154 L148 238" stroke={LIMB} strokeWidth={17} strokeLinecap="round" fill="none" />
      <Ellipse cx={148} cy={241} rx={16} ry={8} fill={ACCENT} />
    </G>
  );
}

function WarriorII() {
  return (
    <G>
      <BgGlow />
      <Ellipse cx={95} cy={248} rx={72} ry={8} fill="rgba(0,0,0,0.18)" />
      {/* Head */}
      <Circle cx={100} cy={62} r={21} fill={HEAD} />
      <Rect x={91} y={81} width={18} height={15} rx={7} fill={SKIN} />
      {/* Torso */}
      <Path d="M78 94 Q100 90 122 94 L118 158 Q100 162 82 158 Z" fill={BODY} />
      {/* Left arm extended */}
      <Path d="M80 108 L20 108" stroke={LIMB} strokeWidth={14} strokeLinecap="round" fill="none" />
      <Ellipse cx={17} cy={108} rx={10} ry={8} fill={ACCENT} />
      {/* Right arm extended */}
      <Path d="M120 108 L180 108" stroke={LIMB} strokeWidth={14} strokeLinecap="round" fill="none" />
      <Ellipse cx={183} cy={108} rx={10} ry={8} fill={ACCENT} />
      {/* Front leg bent */}
      <Path d="M86 156 L58 200" stroke={LIMB} strokeWidth={17} strokeLinecap="round" fill="none" />
      <Path d="M58 200 L44 245" stroke={LIMB} strokeWidth={17} strokeLinecap="round" fill="none" />
      <Ellipse cx={44} cy={248} rx={16} ry={8} fill={ACCENT} />
      {/* Back leg straight */}
      <Path d="M114 156 L148 245" stroke={LIMB} strokeWidth={17} strokeLinecap="round" fill="none" />
      <Ellipse cx={148} cy={248} rx={16} ry={8} fill={ACCENT} />
    </G>
  );
}

function BridgePose() {
  return (
    <G>
      <BgGlow />
      <Ellipse cx={95} cy={248} rx={80} ry={8} fill="rgba(0,0,0,0.18)" />
      {/* Head on floor */}
      <Ellipse cx={32} cy={232} rx={22} ry={16} fill={HEAD} />
      {/* Shoulders & upper back flat */}
      <Rect x={48} y={224} width={40} height={17} rx={8} fill={BODY} />
      {/* Arched torso */}
      <Path d="M82 232 Q102 162 132 185" stroke={BODY} strokeWidth={24} strokeLinecap="round" fill="none" />
      {/* Hip highlight */}
      <Circle cx={118} cy={172} r={12} fill="rgba(102,187,106,0.4)" />
      {/* Shins down */}
      <Path d="M132 186 L130 245" stroke={LIMB} strokeWidth={17} strokeLinecap="round" fill="none" />
      <Path d="M148 182 L150 245" stroke={LIMB} strokeWidth={17} strokeLinecap="round" fill="none" />
      {/* Feet */}
      <Ellipse cx={130} cy={248} rx={15} ry={8} fill={ACCENT} />
      <Ellipse cx={151} cy={248} rx={15} ry={8} fill={ACCENT} />
      {/* Arms flat on floor */}
      <Rect x={50} y={238} width={62} height={11} rx={5} fill={LIMB} />
      <Ellipse cx={112} cy={244} rx={10} ry={7} fill={ACCENT} />
    </G>
  );
}

function CobraPose() {
  return (
    <G>
      <BgGlow />
      <Ellipse cx={105} cy={248} rx={78} ry={8} fill="rgba(0,0,0,0.18)" />
      {/* Legs flat */}
      <Rect x={85} y={230} width={90} height={16} rx={8} fill={LIMB} />
      <Ellipse cx={176} cy={238} rx={12} ry={8} fill={ACCENT} />
      {/* Hips */}
      <Ellipse cx={90} cy={228} rx={20} ry={13} fill={BODY} />
      {/* Torso rising */}
      <Path d="M88 224 Q76 194 68 162" stroke={BODY} strokeWidth={24} strokeLinecap="round" fill="none" />
      {/* Upper chest open */}
      <Ellipse cx={72} cy={175} rx={18} ry={14} fill={BODY} />
      {/* Head up */}
      <Circle cx={64} cy={148} r={22} fill={HEAD} />
      <Rect x={55} y={169} width={18} height={14} rx={7} fill={SKIN} />
      {/* Arms pressing floor */}
      <Path d="M80 215 L58 244" stroke={LIMB} strokeWidth={13} strokeLinecap="round" fill="none" />
      <Path d="M96 218 L84 245" stroke={LIMB} strokeWidth={13} strokeLinecap="round" fill="none" />
      <Ellipse cx={56} cy={247} rx={11} ry={7} fill={ACCENT} />
      <Ellipse cx={82} cy={248} rx={11} ry={7} fill={ACCENT} />
    </G>
  );
}

function SeatedForwardFold() {
  return (
    <G>
      <BgGlow />
      <Ellipse cx={100} cy={228} rx={80} ry={9} fill="rgba(0,0,0,0.18)" />
      {/* Legs extended */}
      <Rect x={36} y={210} width={134} height={16} rx={8} fill={LIMB} />
      <Ellipse cx={170} cy={218} rx={16} ry={9} fill={ACCENT} />
      {/* Hips */}
      <Ellipse cx={44} cy={208} rx={18} ry={13} fill={BODY} />
      {/* Torso folding forward */}
      <Path d="M44 204 Q88 176 148 184" stroke={BODY} strokeWidth={24} strokeLinecap="round" fill="none" />
      {/* Head forward */}
      <Circle cx={156} cy={182} r={20} fill={HEAD} />
      {/* Arms reaching */}
      <Path d="M52 200 Q110 194 164 210" stroke={LIMB} strokeWidth={11} strokeLinecap="round" fill="none" />
      <Path d="M54 210 Q112 205 166 219" stroke={LIMB} strokeWidth={9} strokeLinecap="round" fill="none" />
      <Ellipse cx={165} cy={213} rx={10} ry={7} fill={ACCENT} />
    </G>
  );
}

function SunSalutation() {
  return (
    <G>
      <BgGlow />
      {/* Sun glow behind */}
      <Circle cx={100} cy={50} r={38} fill="rgba(249,168,37,0.15)" />
      <Circle cx={100} cy={50} r={24} fill="rgba(249,168,37,0.22)" />
      <Ellipse cx={100} cy={248} rx={36} ry={8} fill="rgba(0,0,0,0.18)" />
      {/* Head */}
      <Circle cx={100} cy={56} r={22} fill={HEAD} />
      <Rect x={91} y={76} width={18} height={15} rx={7} fill={SKIN} />
      {/* Torso slight backbend */}
      <Path d="M80 89 Q115 95 112 162" stroke={BODY} strokeWidth={24} strokeLinecap="round" fill="none" />
      {/* Left arm swept up wide */}
      <Path d="M82 96 Q44 58 36 24" stroke={LIMB} strokeWidth={14} strokeLinecap="round" fill="none" />
      <Ellipse cx={34} cy={21} rx={10} ry={8} fill={ACCENT} />
      {/* Right arm swept up wide */}
      <Path d="M108 96 Q148 58 164 24" stroke={LIMB} strokeWidth={14} strokeLinecap="round" fill="none" />
      <Ellipse cx={165} cy={21} rx={10} ry={8} fill={ACCENT} />
      {/* Legs */}
      <Path d="M106 160 L94 245" stroke={LIMB} strokeWidth={17} strokeLinecap="round" fill="none" />
      <Path d="M112 160 L122 245" stroke={LIMB} strokeWidth={17} strokeLinecap="round" fill="none" />
      <Ellipse cx={92} cy={248} rx={14} ry={8} fill={ACCENT} />
      <Ellipse cx={122} cy={248} rx={14} ry={8} fill={ACCENT} />
    </G>
  );
}

function LegsUpTheWall() {
  return (
    <G>
      <BgGlow />
      <Ellipse cx={100} cy={232} rx={78} ry={9} fill="rgba(0,0,0,0.18)" />
      {/* Body horizontal */}
      <Rect x={22} y={206} width={122} height={20} rx={10} fill={BODY} />
      {/* Head */}
      <Circle cx={18} cy={216} r={20} fill={HEAD} />
      {/* Hips */}
      <Ellipse cx={145} cy={216} rx={18} ry={12} fill={BODY} />
      {/* Left leg vertical */}
      <Rect x={134} y={100} width={16} height={118} rx={8} fill={LIMB} />
      <Ellipse cx={142} cy={97} rx={12} ry={16} fill={ACCENT} />
      {/* Right leg vertical */}
      <Rect x={152} y={100} width={16} height={118} rx={8} fill={LIMB} />
      <Ellipse cx={160} cy={97} rx={12} ry={16} fill={ACCENT} />
      {/* Wall line */}
      <Rect x={168} y={90} width={5} height={135} rx={2} fill="rgba(255,255,255,0.15)" />
      {/* Arms relaxed at sides */}
      <Rect x={46} y={220} width={58} height={11} rx={5} fill={LIMB} />
      <Ellipse cx={104} cy={226} rx={10} ry={7} fill={ACCENT} />
    </G>
  );
}

function DefaultLotus() {
  return (
    <G>
      <BgGlow />
      <Ellipse cx={100} cy={228} rx={60} ry={10} fill="rgba(0,0,0,0.18)" />
      {/* Head */}
      <Circle cx={100} cy={58} r={26} fill={HEAD} />
      <Rect x={91} y={82} width={18} height={16} rx={7} fill={SKIN} />
      {/* Torso */}
      <Ellipse cx={100} cy={136} rx={32} ry={42} fill={BODY} />
      {/* Left leg */}
      <Path d="M80 164 Q52 178 42 206" stroke={LIMB} strokeWidth={17} strokeLinecap="round" fill="none" />
      <Path d="M42 206 Q68 218 92 212" stroke={LIMB} strokeWidth={15} strokeLinecap="round" fill="none" />
      <Ellipse cx={64} cy={216} rx={14} ry={9} fill={ACCENT} />
      {/* Right leg */}
      <Path d="M120 164 Q148 178 158 206" stroke={LIMB} strokeWidth={17} strokeLinecap="round" fill="none" />
      <Path d="M158 206 Q132 218 108 212" stroke={LIMB} strokeWidth={15} strokeLinecap="round" fill="none" />
      <Ellipse cx={136} cy={216} rx={14} ry={9} fill={ACCENT} />
      {/* Arms resting on knees */}
      <Path d="M72 130 Q56 168 44 202" stroke={LIMB} strokeWidth={12} strokeLinecap="round" fill="none" />
      <Path d="M128 130 Q144 168 156 202" stroke={LIMB} strokeWidth={12} strokeLinecap="round" fill="none" />
      <Ellipse cx={44} cy={205} rx={10} ry={8} fill={ACCENT} />
      <Ellipse cx={156} cy={205} rx={10} ry={8} fill={ACCENT} />
    </G>
  );
}

// ─── Pose map ─────────────────────────────────────────────────────────────────
const POSE_SILHOUETTES: Record<string, React.ComponentType> = {
  'cat-cow':              CatCow,
  'childs-pose':          ChildsPose,
  'downward-facing-dog':  DownwardDog,
  'mountain-pose':        MountainPose,
  'tree-pose':            TreePose,
  'warrior-i':            WarriorI,
  'warrior-ii':           WarriorII,
  'bridge-pose':          BridgePose,
  'cobra-pose':           CobraPose,
  'seated-forward-fold':  SeatedForwardFold,
  'sun-salutation':       SunSalutation,
  'legs-up-the-wall':     LegsUpTheWall,
};

// ─── Main component ────────────────────────────────────────────────────────────
export function PoseAnimation({ poseId, tier: _tier, size = 280 }: PoseAnimationProps) {
  const breathScale = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (!mounted || reduceMotion) return;

      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(breathScale, { toValue: 1.05, duration: 2200, useNativeDriver: false }),
          Animated.timing(breathScale, { toValue: 1.0,  duration: 2200, useNativeDriver: false }),
        ]),
      );
      animationRef.current.start();
    });

    return () => {
      mounted = false;
      animationRef.current?.stop();
      breathScale.setValue(1);
    };
  }, [breathScale]);

  const SilhouetteComponent = POSE_SILHOUETTES[poseId] ?? DefaultLotus;

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        transform: [{ scale: breathScale }],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg
        width={size}
        height={size}
        viewBox="0 0 200 280"
        accessibilityLabel={`${poseId.replace(/-/g, ' ')} pose illustration`}
      >
        <SilhouetteComponent />
      </Svg>
    </Animated.View>
  );
}
