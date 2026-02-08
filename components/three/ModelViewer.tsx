'use client'

import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, MeshDistortMaterial, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

interface MannequinProps {
  color: string
  accentColor: string
}

function Mannequin({ color, accentColor }: MannequinProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  const mainColor = useMemo(() => new THREE.Color(color), [color])
  const accent = useMemo(() => new THREE.Color(accentColor), [accentColor])
  const skinColor = useMemo(() => new THREE.Color('#e8c4a0'), [])
  const darkColor = useMemo(() => new THREE.Color('#1a1a2e'), [])

  return (
    <group ref={groupRef} position={[0, -0.8, 0]}>
      {/* Head */}
      <mesh position={[0, 2.35, 0]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} metalness={0.05} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 2.0, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.15, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} />
      </mesh>

      {/* Torso - Main body / shirt */}
      <mesh position={[0, 1.35, 0]}>
        <capsuleGeometry args={[0.35, 0.8, 8, 16]} />
        <meshStandardMaterial color={mainColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Collar detail */}
      <mesh position={[0, 1.82, 0.12]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.15, 0.03, 8, 16, Math.PI]} />
        <meshStandardMaterial color={accent} roughness={0.5} />
      </mesh>

      {/* Left Shoulder */}
      <mesh position={[-0.48, 1.7, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={mainColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Right Shoulder */}
      <mesh position={[0.48, 1.7, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color={mainColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Left Arm */}
      <mesh position={[-0.52, 1.3, 0]} rotation={[0, 0, 0.15]}>
        <capsuleGeometry args={[0.09, 0.55, 8, 16]} />
        <meshStandardMaterial color={mainColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Right Arm */}
      <mesh position={[0.52, 1.3, 0]} rotation={[0, 0, -0.15]}>
        <capsuleGeometry args={[0.09, 0.55, 8, 16]} />
        <meshStandardMaterial color={mainColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Left Hand */}
      <mesh position={[-0.56, 0.9, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} />
      </mesh>

      {/* Right Hand */}
      <mesh position={[0.56, 0.9, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} />
      </mesh>

      {/* Waist / Belt area */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.32, 0.3, 0.08, 16]} />
        <meshStandardMaterial color={accent} roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Left Leg */}
      <mesh position={[-0.17, 0.25, 0]}>
        <capsuleGeometry args={[0.13, 0.7, 8, 16]} />
        <meshStandardMaterial color={darkColor} roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Right Leg */}
      <mesh position={[0.17, 0.25, 0]}>
        <capsuleGeometry args={[0.13, 0.7, 8, 16]} />
        <meshStandardMaterial color={darkColor} roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Left Shoe */}
      <mesh position={[-0.17, -0.22, 0.06]}>
        <RoundedBox args={[0.18, 0.12, 0.32]} radius={0.04} smoothness={4}>
          <meshStandardMaterial color={darkColor} roughness={0.4} metalness={0.2} />
        </RoundedBox>
      </mesh>

      {/* Right Shoe */}
      <mesh position={[0.17, -0.22, 0.06]}>
        <RoundedBox args={[0.18, 0.12, 0.32]} radius={0.04} smoothness={4}>
          <meshStandardMaterial color={darkColor} roughness={0.4} metalness={0.2} />
        </RoundedBox>
      </mesh>
    </group>
  )
}

function FloatingParticles({ color }: { color: string }) {
  const particlesRef = useRef<THREE.Group>(null)
  const particleColor = useMemo(() => new THREE.Color(color), [color])

  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4 - 1,
      ] as [number, number, number],
      scale: Math.random() * 0.06 + 0.02,
      speed: Math.random() * 0.5 + 0.2,
      offset: Math.random() * Math.PI * 2,
      key: i,
    }))
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, i) => {
        const p = particles[i]
        child.position.y = p.position[1] + Math.sin(state.clock.elapsedTime * p.speed + p.offset) * 0.5
        child.position.x = p.position[0] + Math.cos(state.clock.elapsedTime * p.speed * 0.5 + p.offset) * 0.3
      })
    }
  })

  return (
    <group ref={particlesRef}>
      {particles.map((p) => (
        <mesh key={p.key} position={p.position}>
          <sphereGeometry args={[p.scale, 8, 8]} />
          <meshStandardMaterial
            color={particleColor}
            emissive={particleColor}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

function BackdropDisc({ color }: { color: string }) {
  const discColor = useMemo(() => new THREE.Color(color), [color])

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <mesh position={[0, 0.8, -2]} rotation={[0, 0, 0]}>
        <circleGeometry args={[2.2, 64]} />
        <MeshDistortMaterial
          color={discColor}
          speed={2}
          distort={0.15}
          radius={1}
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  )
}

export interface ModelViewerProps {
  clothingColor: string
  accentColor: string
  particleColor: string
  backdropColor: string
}

export default function ModelViewer({
  clothingColor,
  accentColor,
  particleColor,
  backdropColor,
}: ModelViewerProps) {
  const [bg, setBg] = useState('#e5ebd3')

  useEffect(() => {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--background')
      if (v) setBg(v.trim())
    } catch (e) {
      // ignore if not available
    }
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 1, 4.5], fov: 40 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={[bg]} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#c08b79" />
      <pointLight position={[0, 3, 2]} intensity={0.5} color={accentColor} />
      <spotLight
        position={[0, 5, 3]}
        angle={0.4}
        penumbra={0.8}
        intensity={0.6}
        castShadow
      />

      {/* Scene */}
      <BackdropDisc color={backdropColor} />
      <FloatingParticles color={particleColor} />

      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <Mannequin color={clothingColor} accentColor={accentColor} />
      </Float>

      {/* Environment */}
      <Environment preset="studio" />
    </Canvas>
  )
}
