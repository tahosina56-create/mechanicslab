# Premium Pink Redesign Plan

## Goal
Transform every MechMind Lab screen into a cohesive premium pink engineering workspace while preserving all current calculations, navigation, challenge feedback, sample content, and coming-soon states.

## Visual direction
- Replace the current navy/cyan palette with a refined dark berry and near-black foundation, luminous rose-pink accents, soft blush text highlights, and restrained warm status colors.
- Keep the technical identity through the blueprint grid, animated gears, formula styling, and mono labels, but make the presentation feel more polished and editorial rather than neon-heavy.
- Use layered surfaces, fine rose borders, subtle pink light effects, and crisp high-contrast typography. Avoid an all-pink wash by balancing pink with neutral graphite and cool off-white.

## Updates
1. **Global design system**
   - Rework semantic color, border, surface, glow, and background tokens in the global stylesheet.
   - Refine panels, focus states, motion, and the blueprint backdrop so every existing page inherits the new theme consistently.
   - Preserve accessible contrast and reduced-motion behavior.

2. **Shared navigation and page framing**
   - Restyle the logo, sticky navigation, active states, mobile menu, page headings, badges, and footer.
   - Improve visual hierarchy and spacing across desktop and mobile without changing destinations or menu behavior.

3. **Dashboard**
   - Redesign the opening engineering workspace, animated gear artwork, tutor prompt, suggestion chips, module tiles, activity list, and featured challenge.
   - Keep all current links, prompt submission behavior, content, and status labels intact.

4. **Calculator and challenge**
   - Restyle calculator fields, unit labels, mode selector, formula chips, actions, result panels, and validation states.
   - Apply the same premium treatment to the challenge answer flow and worked solution while preserving all engineering logic and accepted-answer thresholds.

5. **Tutor, machine design, and CAD previews**
   - Update the shared coming-soon presentation so all three pages match the redesigned system, with no change to their current scope or links.

6. **Quality checks**
   - Keep each page’s existing search and metadata behavior valid.
   - Run the existing calculation and routing tests.
   - Check the live site at desktop and mobile widths for navigation, forms, results, challenge feedback, contrast, and layout overlap.

## Technical details
- Theme values remain centralized as semantic Tailwind v4 tokens; page code will not use one-off hardcoded colors.
- Existing calculation functions, state logic, routes, and content stay unchanged unless a small markup adjustment is required for presentation or accessibility.
- Shared controls will use the project’s existing design-system buttons where practical, preserving native form submission behavior.
