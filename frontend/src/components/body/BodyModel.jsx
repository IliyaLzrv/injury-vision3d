import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Grid, OrbitControls } from '@react-three/drei';
import { BODY_PART } from './bodyParts.js';
import BodyStatusLegend from './BodyStatusLegend.jsx';
import {
	buildLatestLogByBodyPart,
	getBodyPartDisplayColor,
} from './bodyPainColors.js';
import { buttonStyles, cn } from '../ui/buttonStyles.js';

const METALNESS = 0.12;
const ROUGHNESS = 0.62;

const DEFAULT_CAMERA = {
	position: [0, 0.95, 3.35],
	target: [0, 0.88, 0],
};

const BACK_CAMERA = {
	position: [0, 0.95, -3.35],
	target: [0, 0.88, 0],
};

function CameraPresetApplier({ preset, controlsRef }) {
	const { camera } = useThree();

	useEffect(() => {
		const config = preset === 'back' ? BACK_CAMERA : DEFAULT_CAMERA;

		camera.position.set(...config.position);
		camera.lookAt(...config.target);

		if (controlsRef.current) {
			controlsRef.current.target.set(...config.target);
			controlsRef.current.update();
		}
	}, [preset, camera, controlsRef]);

	return null;
}

function BodyPart({
	bodyPart,
	position,
	rotation = [0, 0, 0],
	scale = [1, 1, 1],
	geometry,
	latestLogByBodyPart,
	selectedBodyPart,
	onBodyPartSelect,
}) {
	const [hovered, setHovered] = useState(false);

	const color = getBodyPartDisplayColor({
		bodyPart,
		latestLogByBodyPart,
		selectedBodyPart,
		hovered,
	});

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
				<meshStandardMaterial color="#e2e8f0" roughness={0.95} />
			</mesh>
			<Grid
				position={[0, 0.01, 0]}
				args={[6, 6]}
				cellSize={0.2}
				cellThickness={0.35}
				cellColor="#cbd5e1"
				sectionSize={1}
				sectionThickness={0.5}
				sectionColor="#94a3b8"
				fadeDistance={4}
				infiniteGrid
			/>
		</>
	);
}

function HumanoidBody({
	onBodyPartSelect,
	selectedBodyPart,
	latestLogByBodyPart,
}) {
	const armHang = 0.12;
	const partProps = {
		onBodyPartSelect,
		selectedBodyPart,
		latestLogByBodyPart,
	};

	return (
		<group>
			<BodyPart
				bodyPart={BODY_PART.LEFT_ANKLE}
				position={[-0.14, 0.05, 0.07]}
				geometry={<boxGeometry args={[0.12, 0.06, 0.26]} />}
				{...partProps}
			/>
			<BodyPart
				bodyPart={BODY_PART.RIGHT_ANKLE}
				position={[0.14, 0.05, 0.07]}
				geometry={<boxGeometry args={[0.12, 0.06, 0.26]} />}
				{...partProps}
			/>

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

			<BodyPart
				bodyPart={BODY_PART.ABDOMEN}
				position={[0, 0.9, 0]}
				geometry={<capsuleGeometry args={[0.2, 0.14, 10, 14]} />}
				scale={[1.15, 1, 0.85]}
				{...partProps}
			/>

			<BodyPart
				bodyPart={BODY_PART.CHEST}
				position={[0, 1.18, 0]}
				geometry={<boxGeometry args={[0.44, 0.38, 0.22]} />}
				{...partProps}
			/>

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

			<BodyPart
				bodyPart={BODY_PART.LEFT_HAND}
				position={[-0.54, 0.58, 0.05]}
				rotation={[0, 0, armHang + 0.1]}
				geometry={<sphereGeometry args={[0.07, 12, 12]} />}
				{...partProps}
			/>
			<BodyPart
				bodyPart={BODY_PART.RIGHT_HAND}
				position={[0.54, 0.58, 0.05]}
				rotation={[0, 0, -armHang - 0.1]}
				geometry={<sphereGeometry args={[0.07, 12, 12]} />}
				{...partProps}
			/>

			<BodyPart
				bodyPart={BODY_PART.HEAD}
				position={[0, 1.6, 0.03]}
				geometry={<sphereGeometry args={[0.2, 24, 24]} />}
				{...partProps}
			/>
		</group>
	);
}

function viewButtonClass(active) {
	return cn(
		buttonStyles.secondary,
		'px-3 py-1.5 text-xs',
		active && 'border-sky-300 bg-sky-50 text-sky-700'
	);
}

export default function BodyModel({
	onBodyPartSelect,
	selectedBodyPart = null,
	injuryLogs = [],
}) {
	const controlsRef = useRef(null);
	const [viewPreset, setViewPreset] = useState('front');

	const latestLogByBodyPart = useMemo(
		() => buildLatestLogByBodyPart(injuryLogs),
		[injuryLogs]
	);

	function handleResetView() {
		setViewPreset('front');
		controlsRef.current?.reset();
	}

	return (
		<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
			<div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
				<div className="flex flex-wrap gap-2">
					<button
						type="button"
						className={viewButtonClass(viewPreset === 'front')}
						onClick={() => setViewPreset('front')}
					>
						Front View
					</button>
					<button
						type="button"
						className={viewButtonClass(viewPreset === 'back')}
						onClick={() => setViewPreset('back')}
					>
						Back View
					</button>
					<button
						type="button"
						className={cn(buttonStyles.ghost, 'px-3 py-1.5 text-xs')}
						onClick={handleResetView}
					>
						Reset
					</button>
				</div>
				<p className="text-xs text-slate-400">Drag to rotate · Scroll to zoom</p>
			</div>

			<div className="h-[min(480px,58vh)] w-full bg-gradient-to-b from-slate-50 to-slate-100">
				<Canvas
					camera={{ position: DEFAULT_CAMERA.position, fov: 38 }}
					gl={{ antialias: true }}
					shadows
				>
					<color attach="background" args={['#f8fafc']} />
					<ambientLight intensity={0.65} />
					<hemisphereLight
						color="#ffffff"
						groundColor="#e2e8f0"
						intensity={0.45}
					/>
					<directionalLight
						position={[3, 5, 4]}
						intensity={1.05}
						castShadow
						shadow-mapSize={[512, 512]}
					/>
					<directionalLight position={[-4, 3, -2]} intensity={0.35} />

					<CameraPresetApplier preset={viewPreset} controlsRef={controlsRef} />
					<SceneFloor />
					<HumanoidBody
						onBodyPartSelect={onBodyPartSelect}
						selectedBodyPart={selectedBodyPart}
						latestLogByBodyPart={latestLogByBodyPart}
					/>

					<OrbitControls
						ref={controlsRef}
						enablePan={false}
						minDistance={2}
						maxDistance={5}
						maxPolarAngle={Math.PI / 1.95}
						target={DEFAULT_CAMERA.target}
					/>
				</Canvas>
			</div>

			<div className="space-y-3 border-t border-slate-200 px-4 py-4">
				<p className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
					Click any highlighted zone to select it
				</p>
				<BodyStatusLegend />
			</div>
		</div>
	);
}
