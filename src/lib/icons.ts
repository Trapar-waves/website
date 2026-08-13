import Atom from 'lucide/dist/esm/icons/atom';
import Box from 'lucide/dist/esm/icons/box';
import Leaf from 'lucide/dist/esm/icons/leaf';
import Terminal from 'lucide/dist/esm/icons/terminal';
import Brain from 'lucide/dist/esm/icons/brain';
import Star from 'lucide/dist/esm/icons/star';
import Download from 'lucide/dist/esm/icons/download';
import Clock from 'lucide/dist/esm/icons/clock';

type IconNode = [string, Record<string, string>, [string, Record<string, string>, string][]][];

const CATEGORY_ICON_MAP: Record<string, IconNode> = {
  atom: Atom,
  box: Box,
  leaf: Leaf,
  terminal: Terminal,
  brain: Brain,
};

const STAT_ICON_MAP: Record<string, IconNode> = {
  star: Star,
  download: Download,
  clock: Clock,
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
  const allIcons: Record<string, IconNode> = { ...CATEGORY_ICON_MAP };
  if (extraMap) {
    for (const [key, iconName] of Object.entries(extraMap)) {
      if (iconName in STAT_ICON_MAP) {
        allIcons[key] = STAT_ICON_MAP[iconName];
      }
    }
  }

  document.querySelectorAll(selector).forEach((el) => {
    const iconName = (el as HTMLElement).dataset.icon;
    if (iconName && allIcons[iconName]) {
      const iconNode = allIcons[iconName];
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '16');
      svg.setAttribute('height', '16');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      svg.classList.add('w-4', 'h-4');

      // iconNode is array of [tag, attrs, children?]
      for (const node of iconNode) {
        const [tag, attrs, children] = node;
        const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (const [k, v] of Object.entries(attrs)) {
          el.setAttribute(k, v);
        }
        if (children) {
          for (const child of children) {
            const childEl = document.createElementNS('http://www.w3.org/2000/svg', child[0]);
            for (const [k, v] of Object.entries(child[1])) {
              childEl.setAttribute(k, v);
            }
            el.appendChild(childEl);
          }
        }
        svg.appendChild(el);
      }

      onRender?.(iconName, svg);
      (el as HTMLElement).appendChild(svg);
    }
  });
}
