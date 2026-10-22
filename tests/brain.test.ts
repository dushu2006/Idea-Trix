import { describe, expect, it } from 'vitest';

import { DESTINATIONS, JOURNEY_ORDER } from '../src/data/journey';
import {
  buildSilhouette,
  generateBrain,
  pointInPoly,
  SCENE_H,
  SCENE_W,
} from '../src/lib/brain';
import { cameraFor, framePoint, lerpViewBox } from '../src/lib/camera';

describe('generateBrain', () => {
  it('is deterministic for a fixed seed and detail level', () => {
    const a = generateBrain('full');
    const b = generateBrain('full');
    expect(a).toEqual(b);
    expect(generateBrain('low')).toEqual(generateBrain('low'));
  });

  it('keeps every destination node inside the brain silhouette', () => {
    const poly = buildSilhouette();
    for (const def of DESTINATIONS) {
      expect(pointInPoly(def.node, poly), `${def.id} inside silhouette`).toBe(true);
    }
  });

  it('builds a route through all nine destinations in journey order', () => {
    const brain = generateBrain('full');
    expect(brain.routeSegments).toHaveLength(JOURNEY_ORDER.length - 1);
    brain.routeSegments.forEach((seg, i) => {
      expect(seg.fromId).toBe(JOURNEY_ORDER[i]);
      expect(seg.toId).toBe(JOURNEY_ORDER[i + 1]);
      expect(seg.d.startsWith('M')).toBe(true);
    });
    expect(brain.routeFull.length).toBeGreaterThan(100);
  });

  it('generates layered neuron counts within budget', () => {
    const full = generateBrain('full');
    expect(full.background.length).toBeGreaterThanOrEqual(200);
    expect(full.background.length).toBeLessThanOrEqual(240);
    expect(full.supporting).toHaveLength(36);
    expect(full.particles).toHaveLength(22);

    const low = generateBrain('low');
    expect(low.background.length).toBeLessThanOrEqual(90);
    expect(low.supporting).toHaveLength(18);
    expect(low.particles).toHaveLength(8);
  });

  it('keeps node radii inside the spec bands', () => {
    const brain = generateBrain('full');
    for (const n of brain.background) {
      expect(n.r).toBeGreaterThanOrEqual(1.5);
      expect(n.r).toBeLessThanOrEqual(3);
    }
    for (const n of brain.supporting) {
      expect(n.r).toBeGreaterThanOrEqual(3);
      expect(n.r).toBeLessThanOrEqual(4.2);
    }
  });

  it('produces a sane bounding box inside the scene', () => {
    const { bbox } = generateBrain('full');
    expect(bbox.x).toBeGreaterThan(0);
    expect(bbox.y).toBeGreaterThan(0);
    expect(bbox.x + bbox.w).toBeLessThan(SCENE_W);
    expect(bbox.y + bbox.h).toBeLessThan(SCENE_H);
    expect(bbox.w).toBeGreaterThan(500);
    expect(bbox.h).toBeGreaterThan(400);
  });
});

describe('camera', () => {
  const bbox = generateBrain('full').bbox;

  it('frames a point at the requested viewport fraction', () => {
    const v = framePoint({ x: 500, y: 375 }, 470, 16 / 9, 0.34, 0.5);
    // Node renders at 34% from the left, 50% from the top.
    expect((500 - v.x) / v.w).toBeCloseTo(0.34, 5);
    expect((375 - v.y) / v.h).toBeCloseTo(0.5, 5);
  });

  it('shows the whole brain in the hero overview', () => {
    const v = cameraFor('hero', bbox, { w: 1440, h: 900, isMobile: false });
    expect(v.x).toBeLessThanOrEqual(bbox.x);
    expect(v.y).toBeLessThanOrEqual(bbox.y);
    expect(v.x + v.w).toBeGreaterThanOrEqual(bbox.x + bbox.w);
    expect(v.y + v.h).toBeGreaterThanOrEqual(bbox.y + bbox.h);
  });

  it('keeps the active node away from its desktop panel side', () => {
    // About panel sits right → node framed left of centre.
    const about = cameraFor('about', bbox, { w: 1440, h: 900, isMobile: false });
    const aboutNode = DESTINATIONS[1].node;
    expect((aboutNode.x - about.x) / about.w).toBeLessThan(0.5);
    // Details panel sits left → node framed right of centre.
    const details = cameraFor('details', bbox, { w: 1440, h: 900, isMobile: false });
    const detailsNode = DESTINATIONS[2].node;
    expect((detailsNode.x - details.x) / details.w).toBeGreaterThan(0.5);
  });

  it('frames mobile nodes in the upper area', () => {
    const v = cameraFor('schedule', bbox, { w: 390, h: 844, isMobile: true });
    const node = DESTINATIONS[4].node;
    expect((node.x - v.x) / v.w).toBeCloseTo(0.5, 5);
    expect((node.y - v.y) / v.h).toBeCloseTo(0.3, 5);
  });

  it('returns to an overview at the footer', () => {
    const v = cameraFor('footer', bbox, { w: 1440, h: 900, isMobile: false });
    expect(v.x + v.w).toBeGreaterThanOrEqual(bbox.x + bbox.w);
    expect(v.w).toBeGreaterThan(900);
  });

  it('keeps every destination node inside its frame at all target viewports', () => {
    const viewports = [
      { w: 320, h: 640, isMobile: true },
      { w: 360, h: 800, isMobile: true },
      { w: 390, h: 844, isMobile: true },
      { w: 430, h: 932, isMobile: true },
      { w: 768, h: 1024, isMobile: false },
      { w: 1024, h: 768, isMobile: false },
      { w: 1440, h: 900, isMobile: false },
    ];
    for (const vp of viewports) {
      for (const def of DESTINATIONS) {
        const v = cameraFor(def.id, bbox, vp);
        const fx = (def.node.x - v.x) / v.w;
        const fy = (def.node.y - v.y) / v.h;
        expect(fx, `${def.id} x @ ${vp.w}×${vp.h}`).toBeGreaterThan(0.05);
        expect(fx, `${def.id} x @ ${vp.w}×${vp.h}`).toBeLessThan(0.95);
        expect(fy, `${def.id} y @ ${vp.w}×${vp.h}`).toBeGreaterThan(0.05);
        expect(fy, `${def.id} y @ ${vp.w}×${vp.h}`).toBeLessThan(0.95);
      }
    }
  });

  it('lerps monotonically toward its target', () => {
    const from = { x: 0, y: 0, w: 1000, h: 600 };
    const to = { x: 100, y: 50, w: 470, h: 300 };
    const mid = lerpViewBox(from, to, 0.5);
    expect(mid.x).toBe(50);
    expect(mid.w).toBe(735);
    const closer = lerpViewBox(mid, to, 0.5);
    expect(Math.abs(closer.x - to.x)).toBeLessThan(Math.abs(mid.x - to.x));
  });
});
