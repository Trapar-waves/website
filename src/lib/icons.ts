import { createElement, icons } from 'lucide';

// Base icon map for the 5 template categories (lowercase → PascalCase lucide key)
const CATEGORY_ICON_MAP: Record<string, string> = {
  atom: 'Atom',
  box: 'Box',
  leaf: 'Leaf',
  terminal: 'Terminal',
  brain: 'Brain',
};

/**
 * Render lucide icons into placeholder elements.
 * @param selector - CSS selector for placeholder elements (each must have a `data-icon` attribute)
 * @param extraMap - additional icon name mappings merged on top of the base category map
 * @param onRender - optional callback per rendered SVG for custom class additions
 */
export function renderIcons(
  selector: string,
  extraMap?: Record<string, string>,
  onRender?: (iconName: string, svg: SVGSVGElement) => void,
): void {
  const nameMap = extraMap ? { ...CATEGORY_ICON_MAP, ...extraMap } : CATEGORY_ICON_MAP;

  document.querySelectorAll(selector).forEach((el) => {
    const iconName = (el as HTMLElement).dataset.icon;
    if (iconName && nameMap[iconName]) {
      const iconData = icons[nameMap[iconName] as keyof typeof icons];
      if (iconData) {
        const svg = createElement(iconData);
        svg.classList.add('w-4', 'h-4');
        onRender?.(iconName, svg);
        el.appendChild(svg);
      }
    }
  });
}
