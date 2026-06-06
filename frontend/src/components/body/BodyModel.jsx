import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Grid, OrbitControls } from '@react-three/drei';
import { BODY_PART } from './bodyParts.js';

const SKIN = '#a8b8c8';
const SKIN_SOFT = '#8b9aab';
const HOVER_COLOR = '#c4d4e4';
const SELECTED_COLOR = '#6ee7b7';
const METALNESS = 0.12;
const ROUGHNESS = 0.62;

function BodyPart({
	bodyPart,
	position,
	rotation = [0, 0, 0],
	scale = [1, 1, 1],
	geometry,
	baseColor = SKIN,
	selectedBodyPart,
	onBodyPartSelect,
}) {
	const [hovered, setHovered] = useState(false);
	const isSelected = selectedBodyPart === bodyPart;

	let color = baseColor;
	if (isSelected) {
		color = SELECTED_COLOR;
	} else if (hovered) {
		color = HOVER_COLOR;
	}

	return (
		<mesh
			name={bodyPart}
			position={position}
			rotation={rotation}
			scale={scale}
			onPointerOver={(event) => {
				event.stopPropagation();
				setHovered(true);
				document.body.style.cursor = 'pointer';
			}}
			onPointerOut={(event) => {
				event.stopPropagation();
				setHovered(false);
				document.body.style.cursor = 'default';
			}}
			onClick={(event) => {
				event.stopPropagation();
				onBodyPartSelect?.(bodyPart);
			}}
		>
			{geometry}
			<meshStandardMaterial
				color={color}
				metalness={METALNESS}
				roughness={ROUGHNESS}
			/>
		</mesh>
	);
}

function SceneFloor() {
	return (
		<>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
				<circleGeometry args={[2.2, 48]} />
				<meshStandardMaterial color="#0c1222" roughness={0.9} />
			</mesh>
			<Grid
				position={[0, 0.01, 0]}
				args={[6, 6]}
				cellSize={0.2}
				cellThickness={0.4}
				cellColor="#334155"
				sectionSize={1}
				sectionThickness={0.6}
				sectionColor="#475569"
				fadeDistance={4}
				infiniteGrid
			/>
		</>
	);
}

function HumanoidBody({ onBodyPartSelect, selectedBodyPart }) {
	const armHang = 0.12;
	const partProps = { onBodyPartSelect, selectedBodyPart };

	return (
		<group>
			{/* Ankles / feet */}
			<BodyPart
				bodyPart={BODY_PART.LEFT_ANKLE}
				position={[-0.14, 0.05, 0.07]}
				geometry={<boxGeometry args={[0.12, 0.06, 0.26]} />}
				baseColor={SKIN_SOFT}
				{...partProps}
			/>
			<BodyPart
				bodyPart={BODY_PART.RIGHT_ANKLE}
				position={[0.14, 0.05, 0.07]}
				geometry={<boxGeometry args={[0.12, 0.06, 0.26]} />}
				baseColor={SKIN_SOFT}
				{...partProps}
			/>

			{/* Lower legs (shins) */}
			<BodyPart
				bodyPart={BODY_PART.LEFT_LEG}
				position={[-0.14, 0.36, 0.02]}
				geometry={<capsuleGeometry args={[0.095, 0.34, 10, 14]} />}
				{...partProps}
			/>
			<BodyPart
				bodyPart={BODY_PART.RIGHT_LEG}
				position={[0.14, 0.36, 0.02]}
				geometry={<capsuleGeometry args={[0.095, 0.34, 10, 14]} />}
				{...partProps}
			/>

			{/* Knees */}
			<BodyPart
				bodyPart={BODY_PART.LEFT_KNEE}
				position={[-0.14, 0.52, 0.03]}
				geometry={<sphereGeometry args={[0.1, 14, 14]} />}
				{...partProps}
			/>
			<BodyPart
				bodyPart={BODY_PART.RIGHT_KNEE}
				position={[0.14, 0.52, 0.03]}
				geometry={<sphereGeometry args={[0.1, 14, 14]} />}
				{...partProps}
			/>

			{/* Upper legs (thighs) */}
			<BodyPart
				bodyPart={BODY_PART.LEFT_LEG}
				position={[-0.14, 0.68, 0]}
				geometry={<capsuleGeometry args={[0.11, 0.3, 10, 14]} />}
				{...partProps}
			/>
			<BodyPart
				bodyPart={BODY_PART.RIGHT_LEG}
				position={[0.14, 0.68, 0]}
				geometry={<capsuleGeometry args={[0.11, 0.3, 10, 14]} />}
				{...partProps}
			/>

			{/* Abdomen / pelvis */}
			<BodyPart
				bodyPart={BODY_PART.ABDOMEN}
				position={[0, 0.9, 0]}
				geometry={<capsuleGeometry args={[0.2, 0.14, 10, 14]} />}
				scale={[1.15, 1, 0.85]}
				{...partProps}
			/>

			{/* Chest */}
			<BodyPart
				bodyPart={BODY_PART.CHEST}
				position={[0, 1.18, 0]}
				geometry={<boxGeometry args={[0.44, 0.38, 0.22]} />}
				{...partProps}
			/>

			{/* Shoulders */}
			<BodyPart
				bodyPart={BODY_PART.LEFT_SHOULDER}
				position={[-0.3, 1.32, 0]}
				geometry={<sphereGeometry args={[0.09, 14, 14]} />}
				{...partProps}
			/>
			<BodyPart
				bodyPart={BODY_PART.RIGHT_SHOULDER}
				position={[0.3, 1.32, 0]}
				geometry={<sphereGeometry args={[0.09, 14, 14]} />}
				{...partProps}
			/>

			{/* Upper arms */}
			<BodyPart
				bodyPart={BODY_PART.LEFT_ARM}
				position={[-0.38, 1.12, 0.02]}
				rotation={[0.1, 0, armHang]}
				geometry={<capsuleGeometry args={[0.075, 0.28, 8, 12]} />}
				{...partProps}
			/>
			<BodyPart
				bodyPart={BODY_PART.RIGHT_ARM}
				position={[0.38, 1.12, 0.02]}
				rotation={[0.1, 0, -armHang]}
				geometry={<capsuleGeometry args={[0.075, 0.28, 8, 12]} />}
				{...partProps}
			/>

			{/* Forearms */}
			<BodyPart
				bodyPart={BODY_PART.LEFT_ARM}
				position={[-0.48, 0.82, 0.04]}
				rotation={[0.05, 0, armHang + 0.08]}
				geometry={<capsuleGeometry args={[0.065, 0.26, 8, 12]} />}
				{...partProps}
			/>
			<BodyPart
				bodyPart={BODY_PART.RIGHT_ARM}
				position={[0.48, 0.82, 0.04]}
				rotation={[0.05, 0, -armHang - 0.08]}
				geometry={<capsuleGeometry args={[0.065, 0.26, 8, 12]} />}
				{...partProps}
			/>

			{/* Hands */}
			<BodyPart
				bodyPart={BODY_PART.LEFT_HAND}
				position={[-0.54, 0.58, 0.05]}
				rotation={[0, 0, armHang + 0.1]}
				geometry={<sphereGeometry args={[0.07, 12, 12]} />}
				baseColor={SKIN_SOFT}
				{...partProps}
			/>
			<BodyPart
				bodyPart={BODY_PART.RIGHT_HAND}
				position={[0.54, 0.58, 0.05]}
				rotation={[0, 0, -armHang - 0.1]}
				geometry={<sphereGeometry args={[0.07, 12, 12]} />}
				baseColor={SKIN_SOFT}
				{...partProps}
			/>

			{/* Head */}
			<BodyPart
				bodyPart={BODY_PART.HEAD}
				position={[0, 1.6, 0.03]}
				geometry={<sphereGeometry args={[0.2, 24, 24]} />}
				{...partProps}
			/>
		</group>
	);
}

export default function BodyModel({ onBodyPartSelect, selectedBodyPart = null }) {
	return (
		<div className="h-[min(560px,62vh)] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80">
			<Canvas
				camera={{ position: [0, 0.95, 3.35], fov: 38 }}
				gl={{ antialias: true }}
				shadows
			>
				<color attach="background" args={['#0f172a']} />
				<ambientLight intensity={0.45} />
				<hemisphereLight
					color="#e2e8f0"
					groundColor="#1e293b"
					intensity={0.35}
				/>
				<directionalLight
					position={[3, 5, 4]}
					intensity={1.15}
					castShadow
					shadow-mapSize={[512, 512]}
				/>
				<directionalLight position={[-4, 3, -2]} intensity={0.4} />

				<SceneFloor />
				<HumanoidBody
					onBodyPartSelect={onBodyPartSelect}
					selectedBodyPart={selectedBodyPart}
				/>

				<OrbitControls
					enablePan={false}
					minDistance={2}
					maxDistance={5}
					maxPolarAngle={Math.PI / 1.95}
					target={[0, 0.88, 0]}
				/>
			</Canvas>
		</div>
	);
}
