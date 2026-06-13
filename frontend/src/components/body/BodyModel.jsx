import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Grid, OrbitControls } from '@react-three/drei';
import { BODY_PART } from './bodyParts.js';
import BodyStatusLegend from './BodyStatusLegend.jsx';
import {
	buildLatestLogByBodyPart,
	getBodyPartDisplayColor,
} from './bodyPainColors.js';
import { buttonStyles, cn } from '../ui/buttonStyles.js';

const METALNESS = 0.06;
const ROUGHNESS = 0.5;
const CLEARCOAT = 0.08;
const CLEARCOAT_ROUGHNESS = 0.45;

const DEFAULT_CAMERA = {
	position: [0, 0.95, 3.35],
	target: [0, 0.88, 0],
};

const BACK_CAMERA = {
	position: [0, 0.95, -3.35],
	target: [0, 0.88, 0],
};

/**
 * Smoothly animates the camera position/target toward the active preset
 * instead of snapping instantly when the Front/Back view toggle changes.
 */
function CameraPresetApplier({ preset, controlsRef }) {
	const { camera } = useThree();
	const targetPosition = useRef(new THREE.Vector3(...DEFAULT_CAMERA.position));
	const targetLookAt = useRef(new THREE.Vector3(...DEFAULT_CAMERA.target));
	const initialized = useRef(false);

	useEffect(() => {
		const config = preset === 'back' ? BACK_CAMERA : DEFAULT_CAMERA;
		targetPosition.current.set(...config.position);
		targetLookAt.current.set(...config.target);

		if (!initialized.current) {
			camera.position.set(...config.position);
			camera.lookAt(...config.target);
			if (controlsRef.current) {
				controlsRef.current.target.set(...config.target);
				controlsRef.current.update();
			}
			initialized.current = true;
		}
	}, [preset, camera, controlsRef]);

	useFrame(() => {
		camera.position.lerp(targetPosition.current, 0.08);

		if (controlsRef.current) {
			controlsRef.current.target.lerp(targetLookAt.current, 0.08);
			controlsRef.current.update();
		}
	});

	return null;
}

/* ------------------------------------------------------------------ */
/* Shared geometry primitives                                          */
/*                                                                      */
/* Built once at module scope (not inside the component) so they are   */
/* not re-created on every render. Higher segment counts + tapered     */
/* cylinders / lathes give the figure a smoother, more anatomical      */
/* silhouette than the original flat boxes and uniform capsules.       */
/* ------------------------------------------------------------------ */

function lathe(points, segments = 32) {
	return new THREE.LatheGeometry(
		points.map(([x, y]) => new THREE.Vector2(x, y)),
		segments
	);
}

const headGeometry = new THREE.SphereGeometry(0.145, 32, 32);
const shoulderGeometry = new THREE.SphereGeometry(0.085, 24, 24);
const kneeGeometry = new THREE.SphereGeometry(0.085, 24, 24);
const heelGeometry = new THREE.SphereGeometry(0.06, 20, 20);

const neckGeometry = new THREE.CylinderGeometry(0.075, 0.085, 0.12, 28, 1);

// Hips -> waist, slightly flared at the base, narrowing toward the chest.
const abdomenGeometry = lathe([
	[0.0, -0.02],
	[0.205, 0.0],
	[0.21, 0.06],
	[0.195, 0.16],
	[0.19, 0.24],
	[0.205, 0.34],
]);

// Waist -> chest -> shoulder base, with a gentle chest bulge.
const chestGeometry = lathe([
	[0.205, 0.0],
	[0.22, 0.06],
	[0.24, 0.14],
	[0.23, 0.22],
	[0.195, 0.3],
	[0.15, 0.36],
]);

// Hip -> knee, wider at the hip.
const thighGeometry = new THREE.CylinderGeometry(0.105, 0.085, 0.38, 24, 1);
// Knee -> ankle, tapering toward the ankle.
const calfGeometry = new THREE.CylinderGeometry(0.085, 0.06, 0.4, 24, 1);

// Shoulder -> elbow.
const upperArmGeometry = new THREE.CylinderGeometry(0.075, 0.06, 0.28, 20, 1);
// Elbow -> wrist.
const forearmGeometry = new THREE.CylinderGeometry(0.06, 0.05, 0.26, 20, 1);

const palmGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.045);
const fingersGeometry = new THREE.BoxGeometry(0.085, 0.06, 0.04);
const thumbGeometry = new THREE.CylinderGeometry(0.013, 0.016, 0.05, 12);

const footGeometry = new THREE.BoxGeometry(0.11, 0.07, 0.16);
const toeGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.1);

function handParts(mirror) {
	return [
		{ geometry: palmGeometry, position: [0, 0, 0] },
		{ geometry: fingersGeometry, position: [0, -0.078, 0] },
		{
			geometry: thumbGeometry,
			position: [mirror * 0.058, -0.015, 0.015],
			rotation: [0, 0, mirror * 0.9],
		},
	];
}

function footParts() {
	return [
		{ geometry: heelGeometry, position: [0, 0, -0.02] },
		{ geometry: footGeometry, position: [0, -0.005, 0.06] },
		{
			geometry: toeGeometry,
			position: [0, -0.018, 0.16],
			scale: [0.95, 0.8, 1],
		},
	];
}

function chestParts() {
	return [
		{ geometry: chestGeometry, position: [0, 0, 0], scale: [1, 1, 0.92] },
		{ geometry: neckGeometry, position: [0, 0.42, 0] },
	];
}

/**
 * A single colored mesh belonging to a body part group. The material
 * color is animated (lerped) toward the target pain/selection color so
 * hover and status changes transition smoothly instead of snapping.
 */
function ColoredMesh({
	geometry,
	position = [0, 0, 0],
	rotation = [0, 0, 0],
	scale = [1, 1, 1],
	color,
}) {
	const materialRef = useRef(null);
	const targetColor = useMemo(() => new THREE.Color(color), [color]);

	useFrame(() => {
		if (materialRef.current) {
			materialRef.current.color.lerp(targetColor, 0.12);
		}
	});

	return (
		<mesh
			position={position}
			rotation={rotation}
			scale={scale}
			geometry={geometry}
			castShadow
			receiveShadow
		>
			<meshPhysicalMaterial
				ref={materialRef}
				color={color}
				metalness={METALNESS}
				roughness={ROUGHNESS}
				clearcoat={CLEARCOAT}
				clearcoatRoughness={CLEARCOAT_ROUGHNESS}
			/>
		</mesh>
	);
}

function BodyPart({
	bodyPart,
	parts,
	position,
	rotation = [0, 0, 0],
	scale = [1, 1, 1],
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
		<group
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
			{parts.map((part, index) => (
				<ColoredMesh key={index} {...part} color={color} />
			))}
		</group>
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
			<ContactShadows
				position={[0, 0.005, 0]}
				opacity={0.45}
				scale={4.5}
				blur={2.4}
				far={1.4}
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
				position={[-0.14, 0.06, 0.07]}
				parts={footParts()}
				{...partProps}
			/>
			<BodyPart
				bodyPart={BODY_PART.RIGHT_ANKLE}
				position={[0.14, 0.06, 0.07]}
				parts={footParts()}
				{...partProps}
			/>

			<BodyPart
				bodyPart={BODY_PART.LEFT_LEG}
				position={[-0.14, 0.3, 0.02]}
				parts={[{ geometry: calfGeometry }]}
				{...partProps}
			/>
			<BodyPart
				bodyPart={BODY_PART.RIGHT_LEG}
				position={[0.14, 0.3, 0.02]}
				parts={[{ geometry: calfGeometry }]}
				{...partProps}
			/>

			<BodyPart
				bodyPart={BODY_PART.LEFT_KNEE}
				position={[-0.14, 0.49, 0.03]}
				parts={[{ geometry: kneeGeometry }]}
				{...partProps}
			/>
			<BodyPart
				bodyPart={BODY_PART.RIGHT_KNEE}
				position={[0.14, 0.49, 0.03]}
				parts={[{ geometry: kneeGeometry }]}
				{...partProps}
			/>

			<BodyPart
				bodyPart={BODY_PART.LEFT_LEG}
				position={[-0.14, 0.65, 0]}
				parts={[{ geometry: thighGeometry }]}
				{...partProps}
			/>
			<BodyPart
				bodyPart={BODY_PART.RIGHT_LEG}
				position={[0.14, 0.65, 0]}
				parts={[{ geometry: thighGeometry }]}
				{...partProps}
			/>

			<BodyPart
				bodyPart={BODY_PART.ABDOMEN}
				position={[0, 0.72, 0]}
				scale={[1.05, 1, 0.85]}
				parts={[{ geometry: abdomenGeometry }]}
				{...partProps}
			/>

			<BodyPart
				bodyPart={BODY_PART.CHEST}
				position={[0, 0.98, 0]}
				parts={chestParts()}
				{...partProps}
			/>

			<BodyPart
				bodyPart={BODY_PART.LEFT_SHOULDER}
				position={[-0.27, 1.28, 0]}
				parts={[{ geometry: shoulderGeometry }]}
				{...partProps}
			/>
			<BodyPart
				bodyPart={BODY_PART.RIGHT_SHOULDER}
				position={[0.27, 1.28, 0]}
				parts={[{ geometry: shoulderGeometry }]}
				{...partProps}
			/>

			<BodyPart
				bodyPart={BODY_PART.LEFT_ARM}
				position={[-0.38, 1.12, 0.02]}
				rotation={[0.1, 0, armHang]}
				parts={[{ geometry: upperArmGeometry }]}
				{...partProps}
			/>
			<BodyPart
				bodyPart={BODY_PART.RIGHT_ARM}
				position={[0.38, 1.12, 0.02]}
				rotation={[0.1, 0, -armHang]}
				parts={[{ geometry: upperArmGeometry }]}
				{...partProps}
			/>

			<BodyPart
				bodyPart={BODY_PART.LEFT_ARM}
				position={[-0.48, 0.82, 0.04]}
				rotation={[0.05, 0, armHang + 0.08]}
				parts={[{ geometry: forearmGeometry }]}
				{...partProps}
			/>
			<BodyPart
				bodyPart={BODY_PART.RIGHT_ARM}
				position={[0.48, 0.82, 0.04]}
				rotation={[0.05, 0, -armHang - 0.08]}
				parts={[{ geometry: forearmGeometry }]}
				{...partProps}
			/>

			<BodyPart
				bodyPart={BODY_PART.LEFT_HAND}
				position={[-0.54, 0.58, 0.05]}
				rotation={[0, 0, armHang + 0.1]}
				parts={handParts(1)}
				{...partProps}
			/>
			<BodyPart
				bodyPart={BODY_PART.RIGHT_HAND}
				position={[0.54, 0.58, 0.05]}
				rotation={[0, 0, -armHang - 0.1]}
				parts={handParts(-1)}
				{...partProps}
			/>

			<BodyPart
				bodyPart={BODY_PART.HEAD}
				position={[0, 1.605, 0.02]}
				parts={[{ geometry: headGeometry }]}
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
					<ambientLight intensity={0.55} />
					<hemisphereLight
						color="#ffffff"
						groundColor="#e2e8f0"
						intensity={0.4}
					/>
					<directionalLight
						position={[3, 5, 4]}
						intensity={1.1}
						castShadow
						shadow-mapSize={[1024, 1024]}
					/>
					<directionalLight position={[-4, 3, -2]} intensity={0.4} />
					<directionalLight position={[0, 2, -4]} intensity={0.25} />
					<pointLight position={[0, 1.6, 2.5]} intensity={0.3} />

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
