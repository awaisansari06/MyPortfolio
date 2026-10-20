# Portrait assets

## Current hero portrait

`public/portraits/hero-thoughtful.webp` is the alpha-preserving optimized version of the user-supplied `Thoughtful Portrait with Sunglasses.png` (1448 × 1086). It is used for both aligned hero layers. The supplied image is used without facial retouching or color grading. The earlier cutout remains in the three-photo collage.

## Files

- `public/portraits/awais-cutout.webp`: trimmed and compressed alpha-preserving cutout used in the hero collage (1086 × 1295).
- `public/portraits/editorial-profile.webp`: edited editorial close-up used in the hero photo layers (600 × 750).
- `public/portraits/about-editorial.webp`: enhanced folded-arms portrait used in the hero layers (900 × 1125).
The rejected laptop/workspace portrait is not included in the site or repository. Superseded unedited photo derivatives were removed.

The WebP cutouts preserve transparency. Only optimized display assets are included in the repository.
No background-colored rectangle is used as a substitute for transparency.

## Reference inputs

1. `IMG20260919120135.jpg`: primary identity, sunglasses, and checked-shirt reference.
2. `IMG20260919120208.jpg`: supporting facial likeness.
3. `Awais Portfolio Design System Showcase-1.png`: composition and lighting reference only.

## Generation prompt

> Use case: background-extraction / identity-preserve. Create ONE production-ready transparent PNG portrait cutout for the actual developer portfolio. Input 1 is the primary identity and clothing reference. Input 2 supports exact facial likeness. Input 3 is COMPOSITION AND LIGHTING REFERENCE ONLY: match the large sunglasses-on-head man in the top-right dark desktop hero. Output ONLY the isolated person on genuine transparent alpha, NO background, no website, no text, no collage, no frame, no shadows outside silhouette. Preserve the actual man's recognizable face, skin tone, dark wavy hair, facial hair, sunglasses on top of head, and dark charcoal checked button-down shirt from input 1. Recompose into a polished waist-up three-quarter editorial portrait: head tilted gently toward viewer's left, eyes looking slightly toward viewer's right, hair and glasses fully visible, natural realistic shoulders and shirt chest; face framed large like the reference. Warm soft natural photographic light with controlled shadows, detailed realistic skin, crisp fine hair edges. Match the reference pose and framing closely while faithfully keeping THIS man's identity. He is a real young adult. Extend shoulders naturally if necessary; both shoulders and upper torso must be present, no cropped hair or glasses. Bottom torso reaches bottom edge; leave small transparent margin around head and shoulders. Vertical 3:4 composition, high resolution. No beauty-filter facial changes, no cartoon, no green or purple light, no floor, no objects, no phone, no store background.


## About replacement — built-in Image Generation tool

Input: `IMG20260921152836.jpg`. Output: `public/portraits/about-editorial.webp`.

> Edit this exact supplied photograph for an editorial personal portfolio About portrait. Preserve the person's exact real face, hairstyle, facial hair, expression, folded-arms pose, body and dark shirt. Crop to a strong waist-up vertical 4:5 portrait with his complete head and folded arms visible. Improve the photographic lighting: softly illuminate the face, retain natural skin texture and realistic warm brown skin, balanced contrast and rich clothing detail. Replace the plain wall and floor with a subtly textured warm charcoal studio backdrop, softly lit behind the shoulders, natural photographic depth. Remove floor, tape and distracting surroundings. Refined cinematic editorial color, warm highlights, neutral shadows, lively and confident, not dull or excessively dark. Do not change facial identity, do not add laptop, desk, objects, text or graphics. Faithful photographic enhancement, not a new generic model.

## Supporting photograph — built-in Image Generation tool

Inputs: `IMG20260919120208.jpg` (primary), `IMG_20260921_233332.jpg` (supporting identity). Output: `public/portraits/editorial-profile.webp`.

> Use case: identity-preserve / editorial photographic enhancement. Produce ONE vertical 4:5 editorial close portrait for a small printed-photo layer in this real developer's portfolio. Primary input 1 is his identity, wavy hair, sunglasses on head, facial hair and charcoal checked shirt. Input 2 is supporting identity only. Faithfully preserve this man's recognizable real face and proportions. Recompose as an intimate three-quarter profile from chest up, looking toward the left side of the frame thoughtfully, glasses resting on hair, shirt as in input 1. Replace retail-store background, other people, clothing rails and phone with a simple softly blurred warm grey studio background. Sculpted natural window light, bright eye, realistic skin pores and warm skin tone, deep but detailed shadows, premium analogue portrait texture and refined warm black-and-white / very restrained sepia photographic treatment. Head and glasses completely in frame; face occupies most of frame and is sharp. This should be visibly professionally edited and composed from the supplied portrait, not the original store photo placed inside a border. No website, no text, no frames, no generated graphics, no neon, no background objects, no phone, no other people, no altered identity. Keep photographic realism.

## Latest About portrait — built-in Image Generation tool

Input: `IMG_20260921_190623.jpg`. Output: `public/portraits/about-personal.webp` (900 × 1125, optimized WebP). This replaces the About portrait; the folded-arms edit remains a small hero photo layer.

> Use case: identity-preserve / lighting-weather. Edit this exact attached portrait for a premium personal developer portfolio About section. Preserve the exact man's facial identity, face shape, hair, facial hair, slight smile, pose and charcoal collarless shirt. Keep the original chest-up framing, complete head, looking at camera. Improve light and photographic quality only: balanced soft directional window light, natural warm brown skin with realistic pores, clear eyes, detailed hair, restrained warm highlights, open shadows and rich neutral shirt detail. Replace the flat cream wall with a refined softly textured warm grey studio wall with gentle natural light falloff and photographic depth. Sophisticated natural editorial photography, inviting and personal, not gloomy. Vertical 4:5 composition. No change to facial proportions or expression, no new pose, no props, no laptop, no hands added, no glasses, no text, no frames, no website UI, no skin smoothing or generic model face.
