import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { buttonStyles } from '../ui/buttonStyles.js';

const PDF_FILENAME = 'injuryvision-weekly-report.pdf';

const FALLBACK_COLORS = {
	text: '#0f172a',
	mutedText: '#64748b',
	background: '#ffffff',
	pageBackground: '#f8fafc',
	border: '#e2e8f0',
	teal: '#14b8a6',
	blue: '#0ea5e9',
};

const LAYOUT_PROPERTIES = [
	'display',
	'flexDirection',
	'flexWrap',
	'flexFlow',
	'alignItems',
	'alignContent',
	'justifyContent',
	'justifyItems',
	'gridTemplateColumns',
	'gridTemplateRows',
	'gridColumn',
	'gridRow',
	'gridAutoFlow',
	'gap',
	'rowGap',
	'columnGap',
	'paddingTop',
	'paddingRight',
	'paddingBottom',
	'paddingLeft',
	'marginTop',
	'marginRight',
	'marginBottom',
	'marginLeft',
	'borderTopWidth',
	'borderRightWidth',
	'borderBottomWidth',
	'borderLeftWidth',
	'borderTopStyle',
	'borderRightStyle',
	'borderBottomStyle',
	'borderLeftStyle',
	'borderRadius',
	'borderTopLeftRadius',
	'borderTopRightRadius',
	'borderBottomLeftRadius',
	'borderBottomRightRadius',
	'fontSize',
	'fontWeight',
	'fontFamily',
	'fontStyle',
	'lineHeight',
	'letterSpacing',
	'textAlign',
	'textTransform',
	'verticalAlign',
	'whiteSpace',
	'wordBreak',
	'overflow',
	'overflowX',
	'overflowY',
	'width',
	'height',
	'minWidth',
	'minHeight',
	'maxWidth',
	'maxHeight',
	'flexGrow',
	'flexShrink',
	'flexBasis',
	'order',
	'position',
	'top',
	'right',
	'bottom',
	'left',
	'zIndex',
	'opacity',
	'boxSizing',
	'objectFit',
	'borderCollapse',
	'borderSpacing',
	'listStyleType',
];

const BORDER_COLOR_PROPERTIES = [
	'borderTopColor',
	'borderRightColor',
	'borderBottomColor',
	'borderLeftColor',
];

const SVG_TAGS = new Set([
	'svg',
	'path',
	'line',
	'circle',
	'rect',
	'text',
	'tspan',
	'g',
	'polyline',
]);

function includesOklch(value) {
	return typeof value === 'string' && value.includes('oklch(');
}

function isSafeCSSValue(value) {
	if (!value || value === 'none' || value === 'initial' || value === 'inherit') {
		return true;
	}
	if (typeof value !== 'string') {
		return true;
	}
	return (
		!includesOklch(value) &&
		!value.includes('color-mix(') &&
		!value.includes('lab(') &&
		!value.includes('lch(')
	);
}

function getClassName(element) {
	if (typeof element.className === 'string') {
		return element.className;
	}
	if (element.className?.baseVal) {
		return element.className.baseVal;
	}
	return '';
}

function getTextColorFallback(element) {
	const className = getClassName(element);
	if (/text-(slate-400|slate-500|slate-600)/.test(className)) {
		return FALLBACK_COLORS.mutedText;
	}
	if (/text-(teal|cyan)-/.test(className)) {
		return FALLBACK_COLORS.teal;
	}
	if (/text-white/.test(className)) {
		return FALLBACK_COLORS.background;
	}
	if (/text-red-/.test(className)) {
		return '#dc2626';
	}
	return FALLBACK_COLORS.text;
}

function getBackgroundColorFallback(element) {
	const className = getClassName(element);
	if (
		/bg-(slate-50|cyan-50)/.test(className) ||
		/(from|via|to)-(slate|cyan|white)/.test(className)
	) {
		return FALLBACK_COLORS.pageBackground;
	}
	if (/bg-(teal|cyan)-/.test(className)) {
		return FALLBACK_COLORS.teal;
	}
	if (/bg-red-/.test(className)) {
		return '#fef2f2';
	}
	return FALLBACK_COLORS.background;
}

function safeColor(value, fallback) {
	if (!value || value === 'transparent' || value === 'rgba(0, 0, 0, 0)') {
		return value || fallback;
	}
	return isSafeCSSValue(value) ? value : fallback;
}

function clearElementClasses(cloneEl) {
	cloneEl.removeAttribute('class');
	if (cloneEl instanceof SVGElement && cloneEl.className?.baseVal !== undefined) {
		cloneEl.setAttribute('class', '');
	}
}

function walkElementPairs(originalRoot, cloneRoot, callback) {
	callback(originalRoot, cloneRoot);
	const childCount = Math.min(
		originalRoot.children.length,
		cloneRoot.children.length
	);
	for (let index = 0; index < childCount; index += 1) {
		walkElementPairs(
			originalRoot.children[index],
			cloneRoot.children[index],
			callback
		);
	}
}

function copySafeLayoutStyles(originalEl, cloneEl, computed) {
	for (const property of LAYOUT_PROPERTIES) {
		const value = computed[property];
		if (!value || value === 'auto' || value === 'normal') {
			continue;
		}
		if (!isSafeCSSValue(value)) {
			continue;
		}
		cloneEl.style[property] = value;
	}
}

function applySafeColorStyles(originalEl, cloneEl, computed) {
	cloneEl.style.color = safeColor(
		computed.color,
		getTextColorFallback(originalEl)
	);

	cloneEl.style.backgroundImage = 'none';

	const backgroundColor = computed.backgroundColor;
	if (
		backgroundColor &&
		backgroundColor !== 'rgba(0, 0, 0, 0)' &&
		backgroundColor !== 'transparent'
	) {
		cloneEl.style.backgroundColor = safeColor(
			backgroundColor,
			getBackgroundColorFallback(originalEl)
		);
	} else if (
		includesOklch(computed.backgroundImage) ||
		(computed.backgroundImage && computed.backgroundImage !== 'none')
	) {
		cloneEl.style.backgroundColor = getBackgroundColorFallback(originalEl);
	}

	for (const property of BORDER_COLOR_PROPERTIES) {
		const value = computed[property];
		if (!value || value === 'rgba(0, 0, 0, 0)' || value === 'transparent') {
			continue;
		}
		cloneEl.style[property] = safeColor(value, FALLBACK_COLORS.border);
	}

	if (computed.outlineStyle && computed.outlineStyle !== 'none') {
		cloneEl.style.outlineColor = safeColor(
			computed.outlineColor,
			FALLBACK_COLORS.blue
		);
	}

	if (includesOklch(computed.boxShadow)) {
		cloneEl.style.boxShadow = 'none';
	} else if (computed.boxShadow && computed.boxShadow !== 'none') {
		cloneEl.style.boxShadow = isSafeCSSValue(computed.boxShadow)
			? computed.boxShadow
			: 'none';
	}

	if (computed.textDecorationLine && computed.textDecorationLine !== 'none') {
		cloneEl.style.textDecorationColor = safeColor(
			computed.textDecorationColor,
			FALLBACK_COLORS.text
		);
	}
}

function sanitizeSvgElement(originalEl, cloneEl, computed) {
	const tag = cloneEl.tagName?.toLowerCase();
	if (!SVG_TAGS.has(tag)) {
		return;
	}

	if (tag === 'text' || tag === 'tspan') {
		cloneEl.setAttribute('fill', FALLBACK_COLORS.mutedText);
		cloneEl.style.fill = FALLBACK_COLORS.mutedText;
		cloneEl.style.color = FALLBACK_COLORS.mutedText;
		return;
	}

	const fill = computed.fill || cloneEl.getAttribute('fill') || '';
	const stroke = computed.stroke || cloneEl.getAttribute('stroke') || '';

	if (tag === 'line' || tag === 'path' || tag === 'polyline') {
		if (!stroke || stroke === 'currentColor' || !isSafeCSSValue(stroke)) {
			cloneEl.setAttribute('stroke', FALLBACK_COLORS.blue);
			cloneEl.style.stroke = FALLBACK_COLORS.blue;
		} else if (stroke !== 'none') {
			cloneEl.setAttribute('stroke', stroke);
			cloneEl.style.stroke = stroke;
		}

		if (fill && fill !== 'none') {
			const safeFill = safeColor(fill, FALLBACK_COLORS.teal);
			cloneEl.setAttribute('fill', safeFill);
			cloneEl.style.fill = safeFill;
		}
	}

	if (tag === 'circle' || tag === 'rect') {
		if (fill && fill !== 'none') {
			const safeFill = safeColor(fill, FALLBACK_COLORS.teal);
			cloneEl.setAttribute('fill', safeFill);
			cloneEl.style.fill = safeFill;
		}
		if (stroke && stroke !== 'none') {
			const safeStroke = safeColor(stroke, FALLBACK_COLORS.blue);
			cloneEl.setAttribute('stroke', safeStroke);
			cloneEl.style.stroke = safeStroke;
		}
	}

	if (tag === 'svg') {
		cloneEl.style.backgroundColor = FALLBACK_COLORS.background;
	}
}

function sanitizeForPdf(cloneRoot, originalRoot) {
	walkElementPairs(originalRoot, cloneRoot, (originalEl, cloneEl) => {
		clearElementClasses(cloneEl);

		const computed = window.getComputedStyle(originalEl);

		copySafeLayoutStyles(originalEl, cloneEl, computed);
		applySafeColorStyles(originalEl, cloneEl, computed);
		sanitizeSvgElement(originalEl, cloneEl, computed);
	});

	cloneRoot.style.width = '100%';
	cloneRoot.style.backgroundColor = FALLBACK_COLORS.pageBackground;
	cloneRoot.style.color = FALLBACK_COLORS.text;
}

function createExportContainer(width) {
	const container = document.createElement('div');
	container.setAttribute('data-pdf-export-container', 'true');
	container.style.position = 'fixed';
	container.style.left = '-9999px';
	container.style.top = '0';
	container.style.width = `${width}px`;
	container.style.background = FALLBACK_COLORS.pageBackground;
	container.style.color = FALLBACK_COLORS.text;
	container.style.zIndex = '-1';
	container.style.pointerEvents = 'none';
	container.style.overflow = 'visible';
	return container;
}

function waitForLayout() {
	return new Promise((resolve) => {
		requestAnimationFrame(() => {
			requestAnimationFrame(resolve);
		});
	});
}

function buildPdfFromCanvas(canvas) {
	const imgData = canvas.toDataURL('image/png');
	const pdf = new jsPDF('p', 'mm', 'a4');
	const pageWidth = pdf.internal.pageSize.getWidth();
	const pageHeight = pdf.internal.pageSize.getHeight();
	const imgWidth = pageWidth;
	const imgHeight = (canvas.height * imgWidth) / canvas.width;

	let heightLeft = imgHeight;
	let position = 0;

	pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
	heightLeft -= pageHeight;

	while (heightLeft > 0) {
		position = heightLeft - imgHeight;
		pdf.addPage();
		pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
		heightLeft -= pageHeight;
	}

	pdf.save(PDF_FILENAME);
}

export default function ExportReportButton({
	reportRef,
	disabled = false,
}) {
	const [exporting, setExporting] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	async function handleExport() {
		if (!reportRef?.current) {
			setErrorMessage('Report content is not ready for export.');
			return;
		}

		setExporting(true);
		setErrorMessage('');

		const originalReport = reportRef.current;
		const exportWidth = originalReport.offsetWidth || 1000;
		const container = createExportContainer(exportWidth);

		try {
			const clonedReport = originalReport.cloneNode(true);
			container.appendChild(clonedReport);
			document.body.appendChild(container);

			sanitizeForPdf(clonedReport, originalReport);
			await waitForLayout();

			const canvas = await html2canvas(clonedReport, {
				scale: 2,
				useCORS: true,
				logging: false,
				backgroundColor: FALLBACK_COLORS.pageBackground,
				width: exportWidth,
				windowWidth: exportWidth,
			});

			buildPdfFromCanvas(canvas);
		} catch (error) {
			setErrorMessage(
				error?.message || 'Failed to export PDF. Please try again.'
			);
		} finally {
			if (container.parentNode) {
				container.parentNode.removeChild(container);
			}
			setExporting(false);
		}
	}

	return (
		<div className="flex w-full shrink-0 flex-col items-stretch gap-2 sm:w-auto sm:items-end">
			<button
				type="button"
				onClick={handleExport}
				disabled={disabled || exporting}
				className={buttonStyles.primary}
			>
				{exporting ? 'Exporting…' : 'Export PDF'}
			</button>
			{errorMessage && (
				<p className="max-w-[220px] text-right text-xs text-red-600">
					{errorMessage}
				</p>
			)}
		</div>
	);
}
