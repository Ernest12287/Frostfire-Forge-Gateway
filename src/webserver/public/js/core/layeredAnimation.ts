

import {
  extractFramesFromSpriteSheet,
  buildAnimationFrames,
  preloadSpriteSheetImage,
  validateSpriteSheetTemplate
} from './spritesheetParser.js';

const spriteSheetCache: SpriteSheetCache = {};

export async function initializeLayeredAnimation(
  mountSprite: Nullable<SpriteSheetTemplate>,
  bodySprite: Nullable<SpriteSheetTemplate>,
  headSprite: Nullable<SpriteSheetTemplate>,
  armorHelmetSprite: Nullable<SpriteSheetTemplate>,
  armorShoulderguardsSprite: Nullable<SpriteSheetTemplate>,
  armorNeckSprite: Nullable<SpriteSheetTemplate>,
  armorHandsSprite: Nullable<SpriteSheetTemplate>,
  armorChestSprite: Nullable<SpriteSheetTemplate>,
  armorFeetSprite: Nullable<SpriteSheetTemplate>,
  armorLegsSprite: Nullable<SpriteSheetTemplate>,
  armorWeaponSprite: Nullable<SpriteSheetTemplate>,
  initialAnimation: string = 'idle'
): Promise<LayeredAnimation> {

  if (mountSprite && !validateSpriteSheetTemplate(mountSprite)) {
    throw new Error('Invalid mount sprite sheet template');
  }
  if (bodySprite && !validateSpriteSheetTemplate(bodySprite)) {
    throw new Error('Invalid body sprite sheet template');
  }
  if (headSprite && !validateSpriteSheetTemplate(headSprite)) {
    throw new Error('Invalid head sprite sheet template');
  }
  if (armorHelmetSprite && !validateSpriteSheetTemplate(armorHelmetSprite)) {
    throw new Error('Invalid armor helmet sprite sheet template');
  }
  if (armorShoulderguardsSprite && !validateSpriteSheetTemplate(armorShoulderguardsSprite)) {
    throw new Error('Invalid armor shoulderguards sprite sheet template');
  }
  if (armorNeckSprite && !validateSpriteSheetTemplate(armorNeckSprite)) {
    throw new Error('Invalid armor neck sprite sheet template');
  }
  if (armorHandsSprite && !validateSpriteSheetTemplate(armorHandsSprite)) {
    throw new Error('Invalid armor hands sprite sheet template');
  }
  if (armorChestSprite && !validateSpriteSheetTemplate(armorChestSprite)) {
    throw new Error('Invalid armor chest sprite sheet template');
  }
  if (armorFeetSprite && !validateSpriteSheetTemplate(armorFeetSprite)) {
    throw new Error('Invalid armor feet sprite sheet template');
  }
  if (armorLegsSprite && !validateSpriteSheetTemplate(armorLegsSprite)) {
    throw new Error('Invalid armor legs sprite sheet template');
  }
  if (armorWeaponSprite && !validateSpriteSheetTemplate(armorWeaponSprite)) {
    throw new Error('Invalid armor weapon sprite sheet template');
  }

  const isMounted = mountSprite !== null;

  const mountLayer = mountSprite
    ? await createAnimationLayer('mount', mountSprite, initialAnimation, -1, false)
    : null;

  const bodyLayer = bodySprite
    ? await createAnimationLayer('body', bodySprite, initialAnimation, 0, isMounted)
    : null;

  const armorNeckLayer = armorNeckSprite
    ? await createAnimationLayer('armor_neck', armorNeckSprite, initialAnimation, 1, isMounted)
    : null;

  const armorHandsLayer = armorHandsSprite
    ? await createAnimationLayer('armor_hands', armorHandsSprite, initialAnimation, 2, isMounted)
    : null;

  const armorChestLayer = armorChestSprite
    ? await createAnimationLayer('armor_chest', armorChestSprite, initialAnimation, 3, isMounted)
    : null;

  const armorFeetLayer = armorFeetSprite
    ? await createAnimationLayer('armor_feet', armorFeetSprite, initialAnimation, 4, isMounted)
    : null;

  const armorLegsLayer = armorLegsSprite
    ? await createAnimationLayer('armor_legs', armorLegsSprite, initialAnimation, 5, isMounted)
    : null;

  const headLayer = headSprite
    ? await createAnimationLayer('head', headSprite, initialAnimation, 6, isMounted)
    : null;

  const armorHelmetLayer = armorHelmetSprite
    ? await createAnimationLayer('armor_helmet', armorHelmetSprite, initialAnimation, 7, isMounted)
    : null;

  const armorShoulderguardsLayer = armorShoulderguardsSprite
    ? await createAnimationLayer('armor_shoulderguards', armorShoulderguardsSprite, initialAnimation, 8, isMounted)
    : null;

  const armorWeaponLayer = armorWeaponSprite
    ? await createAnimationLayer('armor_weapon', armorWeaponSprite, initialAnimation, 9, isMounted)
    : null;

  return {
    layers: {
      mount: mountLayer as AnimationLayer,
      body: bodyLayer as AnimationLayer,
      head: headLayer as AnimationLayer,
      armor_helmet: armorHelmetLayer as AnimationLayer,
      armor_shoulderguards: armorShoulderguardsLayer as AnimationLayer,
      armor_neck: armorNeckLayer as AnimationLayer,
      armor_hands: armorHandsLayer as AnimationLayer,
      armor_chest: armorChestLayer as AnimationLayer,
      armor_feet: armorFeetLayer as AnimationLayer,
      armor_legs: armorLegsLayer as AnimationLayer,
      armor_weapon: armorWeaponLayer as AnimationLayer
    },
    currentAnimationName: initialAnimation,
    syncFrames: true
  };
}

async function createAnimationLayer(
  type: 'mount' | 'body' | 'head' | 'armor_helmet' | 'armor_shoulderguards' | 'armor_neck' | 'armor_hands' | 'armor_chest' | 'armor_feet' | 'armor_legs' | 'armor_weapon',
  spriteSheet: SpriteSheetTemplate,
  animationName: string,
  zIndex: number,
  isMounted: boolean = false
): Promise<AnimationLayer> {

  const normalizedName = spriteSheet.name.toLowerCase();

  if (!spriteSheetCache[normalizedName]) {

    const imageSource = (spriteSheet as any).imageData || spriteSheet.imageSource;
    const image = await preloadSpriteSheetImage(imageSource);

    const extractedFramesMap = await extractFramesFromSpriteSheet(image, spriteSheet);

    const extractedFrames: { [frameIndex: number]: HTMLImageElement } = {};
    if (extractedFramesMap instanceof Map) {
      extractedFramesMap.forEach((value, key) => {
        extractedFrames[key] = value;
      });
    } else {
      Object.assign(extractedFrames, extractedFramesMap);
    }

    const clonedTemplate = JSON.parse(JSON.stringify(spriteSheet));

    spriteSheetCache[normalizedName] = {
      imageElement: image,
      template: clonedTemplate,
      extractedFrames
    };
  }

  const cached = spriteSheetCache[normalizedName];

  let actualAnimationName = animationName;
  const isArmorLayer = type.startsWith('armor_');
  if (isMounted && (type === 'body' || type === 'head' || isArmorLayer)) {
    if (animationName.startsWith('idle_')) {

      actualAnimationName = animationName.replace('idle_', 'mount_idle_');
    } else if (animationName.startsWith('walk_')) {

      actualAnimationName = animationName.replace('walk_', 'mount_walk_');
    }
  }

  const frames = await buildAnimationFrames(
    spriteSheet,
    actualAnimationName,
    new Map<number, HTMLImageElement>(Object.entries(cached.extractedFrames).map(([k, v]) => [Number(k), v]))
  );

  return {
    type,
    spriteSheet,
    frames,
    currentFrame: 0,
    lastFrameTime: performance.now(),
    zIndex,
    visible: true
  };
}

export function updateLayeredAnimation(
  layeredAnim: LayeredAnimation,
  deltaTime: number
): void {
  const now = performance.now();
  const layers = Object.values(layeredAnim.layers).filter(l => l !== null) as AnimationLayer[];

  if (layers.length === 0) return;

  layers.forEach(layer => {
    if (layer.frames.length === 0) return;

    const currentFrame = layer.frames[layer.currentFrame];

    if (!currentFrame) return;

    if (now - layer.lastFrameTime >= currentFrame.delay) {
      layer.currentFrame = (layer.currentFrame + 1) % layer.frames.length;
      layer.lastFrameTime += currentFrame.delay;
    }
  });
}

export async function changeLayeredAnimation(
  layeredAnim: LayeredAnimation,
  newAnimationName: string
): Promise<void> {
  if (layeredAnim.currentAnimationName === newAnimationName) return;

  layeredAnim.currentAnimationName = newAnimationName;

  const isMounted = layeredAnim.layers.mount !== null;

  const layerUpdates = Object.values(layeredAnim.layers)
    .filter(l => l !== null)
    .map(async (layer) => {
      if (layer && layer.spriteSheet) {

        const normalizedName = layer.spriteSheet.name.toLowerCase();
        const cached = spriteSheetCache[normalizedName];

        if (!cached) {
          return;
        }

        let actualAnimationName = newAnimationName;

        const isArmorLayer = layer.type.startsWith('armor_');

        if (isMounted && (layer.type === 'body' || layer.type === 'head' || isArmorLayer)) {
          if (newAnimationName.startsWith('idle_')) {

            actualAnimationName = newAnimationName.replace('idle_', 'mount_idle_');
          } else if (newAnimationName.startsWith('walk_')) {

            actualAnimationName = newAnimationName.replace('walk_', 'mount_walk_');
          }
        }

        else if (layer.type === 'mount') {

          actualAnimationName = newAnimationName;
        }

        let animationExists = false;

        if (cached.template.animations[actualAnimationName]) {
          animationExists = true;
        } else if (actualAnimationName.includes('_')) {

          const lastUnderscoreIndex = actualAnimationName.lastIndexOf('_');
          const baseName = actualAnimationName.substring(0, lastUnderscoreIndex);
          const direction = actualAnimationName.substring(lastUnderscoreIndex + 1);
          if (cached.template.animations[baseName]?.directions?.[direction]) {
            animationExists = true;
          }
        }

        if (!animationExists) {
          return;
        }

        layer.frames = await buildAnimationFrames(
          cached.template,
          actualAnimationName,
          new Map<number, HTMLImageElement>(Object.entries(cached.extractedFrames).map(([k, v]) => [Number(k), v]))
        );
        layer.currentFrame = 0;
        layer.lastFrameTime = performance.now();
      }
    });

  await Promise.all(layerUpdates);
}

export function getVisibleLayersSorted(layeredAnim: LayeredAnimation): AnimationLayer[] {
  const layers = Object.values(layeredAnim.layers)
    .filter(l => l !== null && l.visible) as AnimationLayer[];

  const animName = layeredAnim.currentAnimationName;
  const direction = animName.split('_').pop() || '';
  const isUpDirection = direction === 'up' || direction === 'upleft' || direction === 'upright';
  const isLeftDirection = direction === 'left' || direction === 'upleft';

  return layers.map(layer => {

    if (isUpDirection) {
      if (layer.type === 'armor_shoulderguards') {

        return { ...layer, zIndex: 5.3 };
      }
      if (layer.type === 'armor_weapon') {

        return { ...layer, zIndex: -2 };
      }
    }

    if (isLeftDirection) {
      if (layer.type === 'armor_weapon') {

        return { ...layer, zIndex: -2 };
      }
    }
    return layer;
  }).sort((a, b) => a.zIndex - b.zIndex);
}

