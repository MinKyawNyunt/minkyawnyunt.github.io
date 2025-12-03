"use client"

import { OrbitControls, useHelper, useGLTF, useAnimations, useTexture, useProgress } from "@react-three/drei";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

function Robot({ targetPosition, onCollision }) {
  const robotRef = useRef();
  const gltf = useGLTF('/robot.glb');
  const { actions, names } = useAnimations(gltf.animations, robotRef);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [canMove, setCanMove] = useState(true);
  const [scale, setScale] = useState(4);
  const collisionCooldown = useRef(0);
  const velocity = useRef(new THREE.Vector3());
  const previousPosition = useRef(new THREE.Vector3(0, 1, 0));

  useEffect(() => {
    if (gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [gltf.scene]);

  useEffect(() => {
    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]].play();
    }
  }, [actions, names]);

  useEffect(() => {
    if (targetPosition) {
      setCurrentTarget(targetPosition);
    }
  }, [targetPosition]);

  useFrame((state, delta) => {
    // Handle collision cooldown
    if (collisionCooldown.current > 0) {
      collisionCooldown.current -= delta;
    }

    // Smooth scale animation back to normal
    // if (scale !== 4) {
    //   setScale(prev => THREE.MathUtils.lerp(prev, 4, 0.1));
    // }

    if (robotRef.current && currentTarget) {
      const currentPos = robotRef.current.position;
      const targetPos = new THREE.Vector3(currentTarget.x, currentPos.y, currentTarget.z);
      const distance = currentPos.distanceTo(targetPos);

      if (distance > 1) {
        // Calculate direction to target
        const direction = new THREE.Vector3()
          .subVectors(targetPos, currentPos)
          .normalize();

        // Calculate new position
        const moveSpeed = 0.1;
        const newX = currentPos.x + direction.x * moveSpeed;
        const newZ = currentPos.z + direction.z * moveSpeed;

        // Check collision with static objects before moving
        const robotBox = new THREE.Box3().setFromObject(robotRef.current);
        robotBox.translate(new THREE.Vector3(
          newX - currentPos.x,
          0,
          newZ - currentPos.z
        ));

        const scene = robotRef.current.parent;
        let hasCollision = false;

        // Check collision with static objects
        scene.traverse((child) => {
          if (child.userData.isStatic && child.visible) {
            const staticBox = new THREE.Box3().setFromObject(child);
            if (robotBox.intersectsBox(staticBox)) {
              hasCollision = true;
            }
          }
        });

        // Only move forward if no collision, otherwise reverse without rotating
        if (!hasCollision && canMove) {
          // Rotate robot to face target when moving forward
          const targetAngle = Math.atan2(direction.x, direction.z) + Math.PI / 2;
          robotRef.current.rotation.y = THREE.MathUtils.lerp(
            robotRef.current.rotation.y,
            targetAngle,
            0.1
          );
          currentPos.x = newX;
          currentPos.z = newZ;
        } else if (hasCollision && canMove) {
          // Reverse robot position without rotating
          setCanMove(false);
          const reverseDistance = 5;
          const reverseX = currentPos.x - direction.x * reverseDistance;
          const reverseZ = currentPos.z - direction.z * reverseDistance;

          // Set new target to reverse position
          setCurrentTarget({ x: reverseX, z: reverseZ });
          setTimeout(() => setCanMove(true), 1000);
        } else if (!canMove) {
          // Moving backward - don't rotate
          currentPos.x = newX;
          currentPos.z = newZ;
        }

        // Calculate velocity for collision physics
        velocity.current.subVectors(currentPos, previousPosition.current).divideScalar(delta);
        previousPosition.current.copy(currentPos);
      } else {
        setCurrentTarget(null);
        velocity.current.set(0, 0, 0);
      }
    } else if (robotRef.current) {
      // Reset velocity when not moving
      velocity.current.set(0, 0, 0);
      previousPosition.current.copy(robotRef.current.position);
    }
  });

  // Collision detection with boxes
  useFrame(() => {
    if (robotRef.current && collisionCooldown.current <= 0) {
      const robotBox = new THREE.Box3().setFromObject(robotRef.current);
      const scene = robotRef.current.parent;

      scene.traverse((child) => {
        if (child.userData.isBox && child.visible) {
          const box = new THREE.Box3().setFromObject(child);
          if (robotBox.intersectsBox(box)) {
            // Use robot's velocity direction for push (direction robot is moving)
            let pushDirection;
            const velocityMagnitude = Math.sqrt(
              velocity.current.x * velocity.current.x +
              velocity.current.z * velocity.current.z
            );

            if (velocityMagnitude > 0.1) {
              // Robot is moving - use velocity direction
              pushDirection = new THREE.Vector3(
                velocity.current.x,
                0,
                velocity.current.z
              ).normalize();
            } else {
              // Robot is stationary - use position difference as fallback
              const robotPos = robotRef.current.position;
              const boxPos = child.position;
              pushDirection = new THREE.Vector3()
                .subVectors(boxPos, robotPos)
                .normalize();
            }

            // Trigger collision effect
            // setScale(3.5);
            collisionCooldown.current = 0.1;
            if (onCollision) {
              onCollision(
                child.userData.boxId,
                { x: pushDirection.x, y: pushDirection.y, z: pushDirection.z },
                { x: velocity.current.x, y: velocity.current.y, z: velocity.current.z }
              );
            }
          }
        }
      });
    }
  });

  return <primitive ref={robotRef} object={gltf.scene} position={[10, 1, 0]} scale={scale} />;
}

function ModelLoader({ gltf_url, scale, position, rotation = [0, 0, 0], collisionSize, collisionOffset, castShadow = true, receiveShadow = true }) {
  const gltf = useGLTF(gltf_url);
  const modelRef = useRef();
  const { actions, names } = useAnimations(gltf.animations, modelRef);
  const [ref] = useBox(() => ({
    type: 'Static',
    position: position,
    args: collisionSize,
    material: {
      friction: 1,
      restitution: 0.3,
    },
  }));

  useEffect(() => {
    if (gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = castShadow;
          child.receiveShadow = receiveShadow;
        }
      });
    }
  }, [gltf.scene]);

  useEffect(() => {
    if (ref.current) {
      ref.current.userData.isStatic = true;
    }
  }, [ref]);

  useEffect(() => {
    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]].play();
    }
  }, [actions, names]);

  return (
    <group ref={ref}>
      <primitive ref={modelRef} object={gltf.scene} scale={scale} position={[0, 0, 0]} rotation={rotation} />
      {/* Debug collision box */}
      {/* <mesh position={collisionOffset}>
        <boxGeometry args={collisionSize} />
        <meshBasicMaterial wireframe color="red" />
      </mesh> */}
    </group>
  );
}

function Ground({ onGroundClick }) {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    // material: {
    //   friction: 0.5,
    //   restitution: 0.3,
    // },
    collisionFilterGroup: 1,
    collisionFilterMask: -1,
  }));

  const handleClick = (event) => {
    event.stopPropagation();
    if (onGroundClick) {
      onGroundClick(event.point);
    }
  };

  return (
    <>
      <mesh ref={ref} receiveShadow onClick={handleClick}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial transparent opacity={0.2} />
      </mesh>

      {/* <lineSegments position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(40, 40)]} />
        <lineBasicMaterial color="black" linewidth={1} />
      </lineSegments> */}
    </>
  );
}

function Lights() {
  const directionalLightRef = useRef();

  // useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1);

  // useEffect(() => {
  //   if (directionalLightRef.current && directionalLightRef.current.shadow && directionalLightRef.current.shadow.camera) {
  //     const helper = new THREE.CameraHelper(directionalLightRef.current.shadow.camera);
  //     const light = directionalLightRef.current;
  //     if (light.parent) {
  //       light.parent.add(helper);
  //     }

  //     return () => {
  //       if (light.parent) {
  //         light.parent.remove(helper);
  //       }
  //     };
  //   }
  // }, []);

  return (
    <>

      <ambientLight intensity={1} />
      <directionalLight
        ref={directionalLightRef}
        position={[50, 50, 30]}
        intensity={5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-camera-near={0.5}
        shadow-camera-far={200}
      />
    </>
  );
}

function BoxComponent({ boxId, position, onHit, pushDirection, velocity, texture_url, onClick }) {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position: position,
    args: [2, 2, 2], // Match the visual box size
    material: {
      friction: 1,
    },
    collisionFilterGroup: 2,
    collisionFilterMask: -1, // Initially collide with everything
  }));
  const [color, setColor] = useState("#D9CFC7");
  const [hovered, setHovered] = useState(false);
  const boxPosition = useRef(position);
  const texture = useTexture(texture_url);

  const handleClick = (event) => {
    event.stopPropagation();
    if (onClick) {
      onClick(boxId, boxPosition.current);
    }
  };

  const handlePointerOver = (event) => {
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (event) => {
    event.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'default';
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.userData.isBox = true;
      ref.current.userData.boxId = boxId;
    }
  }, [ref, boxId]);

  // Subscribe to position updates
  useEffect(() => {
    const unsubscribe = api.position.subscribe((pos) => {
      boxPosition.current = pos;
    });
    return unsubscribe;
  }, [api]);

  // Check if box is outside ground bounds and reset if fallen
  useFrame(() => {
    const [x, y, z] = boxPosition.current;
    const groundSize = 20; // Ground is 40x40, so +/- 20 from center

    // Reset box if it has fallen too far below ground
    if (y < -10) {
      api.position.set(position[0], position[1], position[2]);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
      api.collisionFilterMask.set(-1);
      return;
    }

    // If box is outside ground bounds, stop colliding with ground
    if (Math.abs(x) > groundSize || Math.abs(z) > groundSize) {
      // Box is outside ground - only collide with other boxes (group 2)
      api.collisionFilterMask.set(2);
    } else if (y < 5) {
      // Box is on ground and within bounds - collide with everything
      api.collisionFilterMask.set(-1);
    }
  });

  useEffect(() => {
    if (onHit) {
      // setColor("#FF6B6B");

      // Calculate realistic force based on robot's velocity
      const robotMass = 1;
      const boxMass = 1;

      let impulseX, impulseY, impulseZ;

      if (pushDirection && velocity) {
        const velocityMagnitude = Math.sqrt(
          velocity.x * velocity.x + velocity.z * velocity.z
        );

        // Momentum transfer: F = (m1 * v1) / m2
        const forceMagnitude = (robotMass * velocityMagnitude) / boxMass;
        const clampedForce = Math.max(Math.min(forceMagnitude, 5), 3); // Min 3, max 10

        // Apply horizontal push force (no upward component for realistic push)
        impulseX = pushDirection.x * clampedForce;
        impulseZ = pushDirection.z * clampedForce;
        impulseY = 0; // No vertical force - pure horizontal push
      } else {
        // Fallback with random direction if data is missing
        impulseX = (Math.random() - 0.5) * 6;
        impulseY = 0;
        impulseZ = (Math.random() - 0.5) * 6;
      }

      api.applyImpulse([impulseX, impulseY, impulseZ], [0, 0, 0]);

      setTimeout(() => {
        // setColor("#D9CFC7");
      }, 300);
    }
  }, [onHit, pushDirection, velocity, api]);

  return (
    <>
      <mesh
        ref={ref}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          map={texture}
          color={hovered ? "#FFFFFF" : color}
          roughness={hovered ? 0.2 : 0}
          emissive={hovered ? "#444444" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
          needsUpdate={true}
        />
      </mesh>
    </>
  );
}

function LoadingScreen() {
  const { active, progress } = useProgress();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!active && progress === 100) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [active, progress]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-4 text-white text-2xl" style={{ fontFamily: 'Nevera-Regular, sans-serif' }}>
          Loading...
        </div>
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-white text-sm">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [targetPosition, setTargetPosition] = useState(null);
  const [boxHits, setBoxHits] = useState({});
  const [clickedBox, setClickedBox] = useState(true);
  const [displayedText, setDisplayedText] = useState('Hi Traveler! My name is MIN. The Creator of this website. PRESS ON GROUND to MOVE robot. SCROLL or DRUG to move camera. Hanve fun!');
  const [isTyping, setIsTyping] = useState(false);

  const handleGroundClick = (point) => {
    setTargetPosition({ x: point.x, z: point.z });
    setClickedBox(null);
    setDisplayedText('');
  };

  const handleCollision = (boxId, pushDirection, velocity) => {
    setBoxHits(prev => ({
      ...prev,
      [boxId]: {
        timestamp: Date.now(),
        direction: pushDirection,
        velocity: velocity
      }
    }));
  };

  const handleBoxClick = (text, position) => {
    setClickedBox(text);
    setDisplayedText('');
    setIsTyping(true);
    if (position) {
      setTargetPosition({ x: position[0], z: position[2] });
    }
  };

  useEffect(() => {
    if (clickedBox && isTyping) {
      if (displayedText.length < clickedBox.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(clickedBox.slice(0, displayedText.length + 1));
        }, 20); // Typing speed: 50ms per character
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
      }
    }
  }, [clickedBox, displayedText, isTyping]);
  
  return (
    <div id="canvas-container">
      <LoadingScreen />


      <Canvas
        camera={{ position: [20, 10, 0] }}
        style={{
          backgroundImage: 'url("/img/galaxy.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        shadows
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1
        }}
      >

        <Physics gravity={[0, -9.81, 0]}>
          <Lights />

          {/* <axesHelper args={[10]} /> */}

          <Robot targetPosition={targetPosition} onCollision={handleCollision} />

          {/* <ModelLoader
            gltf_url="/spaceship.glb"
            scale={1}
            position={[-14, 2, -14]}
            collisionSize={[8, 6, 11]}
            collisionOffset={[-1, 1, -1]}
          /> */}

          <ModelLoader
            gltf_url="/pc.glb"
            scale={1}
            position={[0, 0, 0]}
            collisionSize={[4, 3, 4]}
            collisionOffset={[0, 1.5, 0]}
            rotation={[0, Math.PI / 2, 0]}
          />

          <ModelLoader
            gltf_url="/fish.glb"
            scale={0.1}
            position={[0, 7, -2.5]}
            collisionSize={[0, 0, 0]}
            collisionOffset={[0, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            // castShadow={false}
            receiveShadow={false}
          />

          <Ground onGroundClick={handleGroundClick} />

          <BoxComponent
            boxId="box1"
            position={[-8, 10, -8]}
            onHit={boxHits['box1']?.timestamp}
            pushDirection={boxHits['box1']?.direction}
            velocity={boxHits['box1']?.velocity}
            key="box1"
            texture_url="/img/laravel.png"
            onClick={(boxId, pos) => handleBoxClick('Proficient in PHP, Laravel and Yii2 framework with over 8 years of professional experience, specializing in building nationwide ERP systems and fintech solutions.', pos)}
          />

          <BoxComponent
            boxId="box2"
            position={[8, 10, -8]}
            onHit={boxHits['box2']?.timestamp}
            pushDirection={boxHits['box2']?.direction}
            velocity={boxHits['box2']?.velocity}
            key="box2"
            texture_url="/img/mysql.png"
            onClick={(boxId, pos) => handleBoxClick('Have experience working with big data, handling millions of records using SQL, and is also skilled in NoSQL databases.', pos)}
          />

          <BoxComponent
            boxId="box3"
            position={[-8, 10, 8]}
            onHit={boxHits['box3']?.timestamp}
            pushDirection={boxHits['box3']?.direction}
            velocity={boxHits['box3']?.velocity}
            key="box3"
            texture_url="/img/nginx.png"
            onClick={(boxId, pos) => handleBoxClick('Have hands-on experience deploying and managing servers on both on-premise systems and cloud services such as AWS and Digital Ocean.', pos)}
          />

          <BoxComponent
            boxId="box4"
            position={[8, 10, 8]}
            onHit={boxHits['box4']?.timestamp}
            pushDirection={boxHits['box4']?.direction}
            velocity={boxHits['box4']?.velocity}
            key="box4"
            texture_url="/img/react.png"
            onClick={(boxId, pos) => handleBoxClick('Have skilled in frontend development using Javascript and related frameworks, including React React Native and Next.js.', pos)}
          />
        </Physics>





        <OrbitControls
          enableRotate={true}
          enablePan={false}
          minPolarAngle={Math.atan2(Math.sqrt(20 * 20 + 0 * 0), 10)}
          maxPolarAngle={Math.atan2(Math.sqrt(20 * 20 + 0 * 0), 10)}
        />
      </Canvas>

      {clickedBox && (
        <div
          className="absolute top-[10%] left-1/2 -translate-x-1/2 bg-white/[0.07] text-white shadow-[0_4px_30px_rgba(0,0,0,0.23)] backdrop-blur-[20px] border border-white/[0.14] z-[1000] p-2.5 text-center max-w-[90vw] md:max-w-[600px]"
          style={{ fontFamily: 'Organix, sans-serif' }}
        >
          {displayedText}
          {isTyping && <span className="animate-pulse">|</span>}
        </div>
      )}

      <a
        href="https://www.linkedin.com/in/min-kyaw-nyunt/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-white/[0.07] text-white shadow-[0_4px_30px_rgba(0,0,0,0.23)] backdrop-blur-[20px] border border-white/[0.14] px-6 py-3 rounded-lg hover:bg-white/[0.12] transition-all duration-300 z-[1000]"
        style={{ fontFamily: 'Organix, sans-serif' }}
      >
        Contact Me
      </a>
    </div>


  );
}
