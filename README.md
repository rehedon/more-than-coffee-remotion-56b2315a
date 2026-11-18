# More Than Coffee

以 Remotion 重建 Motion Face 的 12 秒咖啡动效。构图、文字、缓动和剪辑点可分别编辑。默认合成为 720 × 1280、30 fps、361 帧。
[查看参考片段](https://motionface.cc/?recording=56b2315a-852c-409f-9050-3de363328d94)

## 预览和渲染

需要 Node.js 20 或更新版本及 npm。

```bash
npm ci
npm start
```

在 Remotion Studio 选择 `MoreThanCoffee`。可单独执行类型检查和导出。

```bash
npm run typecheck
npm run render
```

若宿主机上的 Chromium 无法启动逐帧捕获，可安装 Poppler 和 FFmpeg 并运行 `npm run render:compat`。兼容命令会逐帧导出画面，再合成相同规格的 MP4。

成片位于 `out/MoreThanCoffee.mp4`。音轨已随项目提供，也可以运行 `npm run audio:build` 从合成脚本重建。

## 时间轴

| 帧 | 时间 | 画面 |
| --- | --- | --- |
| 0 | 0.00 s | 淡绿水印、纸杯和斜体标题，绿丝带沿曲线展开 |
| 68 | 2.27 s | 三杯冷饮匹配转场，虚线圆环描边 |
| 103 | 3.43 s | 门店卡片从下方滑入，丝带反向露出 |
| 173 | 5.77 s | 门店向上滑出，通勤卡片接入 |
| 205 | 6.83 s | 暖色闪白衔接咖啡馆卡片 |
| 243 | 8.10 s | 短闪后切到办公卡片 |
| 274 | 9.13 s | 纸杯回到中心，标题分段显现 |
| 305 | 10.17 s | 跳切到杯身特写，逐行落版 |

主要构图和文字位置在 `src/MoreThanCoffee.tsx`，杯身、丝带、花瓣和水印在 `src/Artwork.tsx`，场次帧点在 `src/timeline.ts`。背景用浅薄荷灰配冷灰暗角，丝带用深绿，轻斜体无衬线搭配较重的斜体衬线。照片素材由 ImageGen 重建，使用裁切、位移和缩放再现原片的卡片运动。音轨由本项目的合成脚本制作。

纸杯标记用于对应参考镜头，商标归 Starbucks Corporation 所有。[标记来源](https://en.wikipedia.org/wiki/File:Starbucks_Corporation_Logo_2011.svg)
Inter、Source Serif 4 与 Caveat 的字体许可随文件提供，见 `public/fonts/`。

<details>
<summary>ImageGen 资产提示词</summary>

**摄影卡片** `public/cards/`

Use case photorealistic-natural. Create one square EDGE-TO-EDGE 2 x 2 contact sheet of four completely separate realistic stills for four coffee commercial montage cards. Exactly equal size quadrant tiles with straight boundaries at the horizontal and vertical midpoint. Zero gaps, zero borders, zero rounded corners, no captions or design overlay. Keep the focal composition inside the center 67% of the width of each square quadrant, since each is cropped to a tall portrait. TOP LEFT: straight-on symmetrical exterior of a whimsical three-storey coffeehouse shaped like an oversized brown paper takeaway drink cup, flat black plastic lid forming roof, a small lit circular green and white Starbucks siren logo centered between the upper windows, rows of glowing amber-lit windows under dark overhangs, street seating and low trees at bottom, rainy blue-hour pavement with orange reflection. Dark photoreal cinematic urban still. TOP RIGHT: wide high-angle overhead view down blue-green underground commuter concourse with tile floor and metal rails, many shadowy pedestrians with realistic long exposure motion streaks, one still dark silhouetted backlit commuter centered in lower foreground, distant turquoise and amber afternoon glints, deeply moody cyan. BOTTOM LEFT: inviting compact warm terracotta café with closely spaced cream armchairs and walnut tables, a glowing tall oval wall light at right, wicker pendants, rounded architecture, sunlight entering from the left through café windows, empty seating, midtone amber and cinnamon. BOTTOM RIGHT: across a round warm wooden table toward the hands of a café patron typing on a laptop with its screen tilted at left of center and hands coming from the right. A clear cold coffee with ice and croissant on ceramic plate on near lower left, warm amber cafe millwork, wood slat ceiling, foreground hands and appetizing food, natural cinematic shot. All four quadrant images must be sharp, plausible photographs without visible text or watermarks.

**冷饮透明素材** `public/drinks.webp`

Use case product-mockup. Transparent asset for a coffee motion-design composition. Create a tight and realistic commercial front-view isolated cutout of THREE Starbucks-style clear cold drink cups in a triangular cluster, full cups and straws in frame, arranged on the same baseline with the two outer drinks slightly behind the center drink. Center a large dark-chocolate frozen mocha (tallest, about 1.15x both neighboring drinks), beige mountain of whipped cream drizzled with chocolate syrup, a tall thin green straw, dark chocolate liquid. Left a shorter caramel tan frozen coffee with whipped cream and caramel syrup, green straw. Right a shorter pale matcha green frozen drink topped with whipped cream and a green straw. Green/white circular siren badge centered on each cup, center logo clearly visible, side logos partly occluded by center cup. Cups nearly touch. No table, no grounding ellipse, no broad cast shadow, no typography or added objects. Have the top of the three green straws clearly isolated and the bottoms in a single row, photographed almost straight-on with a little from above. Photorealistic bright soft lighting from upper left and dimension; deliver genuinely transparent background.

</details>
