import { Canvas } from '@react-three/fiber';
import { Grid, OrbitControls } from '@react-three/drei';

const SKIN = '#a8b8c8';
const SKIN_SOFT = '#8b9aab';
const METALNESS = 0.12;
const ROUGHNESS = 0.62;

function handlePartHover(name) {
	window.console.log(`[BodyMap] ${name}`);
}

function BodyPart({
	name,
	position,
	rotation = [0, 0, 0],
	scale = [1, 1, 1],
	geometry,
	color = SKIN,
}) {
	return (
		<mesh
			name={name}
			position={position}
			rotation={rotation}
			scale={scale}
			onPointerOver={(event) => {
				event.stopPropagation();
				document.body.style.cursor = 'pointer';
				handlePartHover(name);
			}}
			onPointerOut={() => {
				document.body.style.cursor = 'default';
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

function HumanoidBody() {
	const armHang = 0.12;

	return (
		<group>
			{/* Feet */}
			<BodyPart
				name="LeftFoot"
				position={[-0.14, 0.05, 0.07]}
				geometry={<boxGeometry args={[0.12, 0.06, 0.26]} />}
				color={SKIN_SOFT}
			/>
			<BodyPart
				name="RightFoot"
				position={[0.14, 0.05, 0.07]}
				geometry={<boxGeometry args={[0.12, 0.06, 0.26]} />}
				color={SKIN_SOFT}
			/>

			{/* Lower legs (shins) */}
			<BodyPart
				name="LeftLowerLeg"
				position={[-0.14, 0.36, 0.02]}
				geometry={<capsuleGeometry args={[0.095, 0.34, 10, 14]} />}
			/>
			<BodyPart
				name="RightLowerLeg"
				position={[0.14, 0.36, 0.02]}
				geometry={<capsuleGeometry args={[0.095, 0.34, 10, 14]} />}
			/>

			{/* Upper legs (thighs) from hips */}
			<BodyPart
				name="LeftLeg"
				position={[-0.14, 0.68, 0]}
				geometry={<capsuleGeometry args={[0.11, 0.3, 10, 14]} />}
			/>
			<BodyPart
				name="RightLeg"
				position={[0.14, 0.68, 0]}
				geometry={<capsuleGeometry args={[0.11, 0.3, 10, 14]} />}
			/>

			{/* Pelvis / hips */}
			<BodyPart
				name="Pelvis"
				position={[0, 0.9, 0]}
				geometry={<capsuleGeometry args={[0.2, 0.14, 10, 14]} />}
				scale={[1.15, 1, 0.85]}
			/>

			{/* Torso — wider at chest */}
			<BodyPart
				name="Torso"
				position={[0, 1.18, 0]}
				geometry={<boxGeometry args={[0.44, 0.38, 0.22]} />}
			/>

			{/* Shoulders */}
			<BodyPart
				name="LeftShoulder"
				position={[-0.3, 1.32, 0]}
				geometry={<sphereGeometry args={[0.09, 14, 14]} />}
			/>
			<BodyPart
				name="RightShoulder"
				position={[0.3, 1.32, 0]}
				geometry={<sphereGeometry args={[0.09, 14, 14]} />}
			/>

			{/* Upper arms */}
			<BodyPart
				name="LeftArm"
				position={[-0.38, 1.12, 0.02]}
				rotation={[0.1, 0, armHang]}
				geometry={<capsuleGeometry args={[0.075, 0.28, 8, 12]} />}
			/>
			<BodyPart
				name="RightArm"
				position={[0.38, 1.12, 0.02]}
				rotation={[0.1, 0, -armHang]}
				geometry={<capsuleGeometry args={[0.075, 0.28, 8, 12]} />}
			/>

			{/* Lower arms (forearms) */}
			<BodyPart
				name="LeftForearm"
				position={[-0.48, 0.82, 0.04]}
				rotation={[0.05, 0, armHang + 0.08]}
				geometry={<capsuleGeometry args={[0.065, 0.26, 8, 12]} />}
			/>
			<BodyPart
				name="RightForearm"
				position={[0.48, 0.82, 0.04]}
				rotation={[0.05, 0, -armHang - 0.08]}
				geometry={<capsuleGeometry args={[0.065, 0.26, 8, 12]} />}
			/>

			{/* Hands */}
			<BodyPart
				name="LeftHand"
				position={[-0.54, 0.58, 0.05]}
				rotation={[0, 0, armHang + 0.1]}
				geometry={<sphereGeometry args={[0.07, 12, 12]} />}
				color={SKIN_SOFT}
			/>
			<BodyPart
				name="RightHand"
				position={[0.54, 0.58, 0.05]}
				rotation={[0, 0, -armHang - 0.1]}
				geometry={<sphereGeometry args={[0.07, 12, 12]} />}
				color={SKIN_SOFT}
			/>

			{/* Neck */}
			<BodyPart
				name="Neck"
				position={[0, 1.42, 0.02]}
				geometry={<capsuleGeometry args={[0.07, 0.1, 8, 12]} />}
			/>

			{/* Head */}
			<BodyPart
				name="Head"
				position={[0, 1.6, 0.03]}
				geometry={<sphereGeometry args={[0.2, 24, 24]} />}
			/>
		</group>
	);
}

export default function BodyModel() {
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
				<HumanoidBody />

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
