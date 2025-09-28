// src/image-services/directus-service.js

import { baseService } from 'astro/assets';

const defaultDirectives = {
    widths: [320, 640, 1024, 1280, 1536, 1920, 2560], // عرض‌های پیش‌فرض
    formats: ['avif', 'webp', 'jpeg', 'jpg', 'png', 'svg', 'gif'], // فرمت‌های پیش‌فرض
    densities: [1, 1.5, 2], // چگالی‌های پیش‌فرض
};

export default {
    // این تابع URL رو به درستی برای Directus می‌سازه.
    getURL(options) {
        const { src, width, height, format, quality } = options;
        const url = new URL(src);

        if (!url.pathname.startsWith('/assets/')) {
            const assetId = src.split('/').pop();
            url.pathname = `/assets/${assetId}`;
        }

        if (width) url.searchParams.set('width', width.toString());
        if (height) url.searchParams.set('height', height.toString());
        if (format) url.searchParams.set('format', format);
        if (quality) url.searchParams.set('quality', quality.toString());

        return url;
    },

    // این تابع مسئول تولید srcset هست.
    getSrcset(options) {
        const { src, widths, densities, format } = options;
        const sources = [];

        // ایجاد srcset بر اساس عرض‌ها
        if (widths) {
            for (const width of widths) {
                const url = this.getURL({ src, width, format });
                sources.push(`${url} ${width}w`);
            }
        }

        // ایجاد srcset بر اساس چگالی‌ها
        if (densities) {
            for (const density of densities) {
                const url = this.getURL({ src, format });
                sources.push(`${url} ${density}x`);
            }
        }

        return sources.join(', ');
    },

    // این تابع اطلاعات لازم برای رندرینگ رو فراهم می‌کنه.
    async transform(options) {
        const { src, width, height, format } = options;
        const url = this.getURL({ src, width, height, format });

        return {
            src: url.toString(),
            attributes: {
                width,
                height,
            },
        };
    },

    // متدهای کمکی برای سازگاری کامل با Astro 5.
    validateOptions: baseService.validateOptions,
    getRawURL: baseService.getRawURL,
    getHTMLWidthAndHeight: baseService.getHTMLWidthAndHeight,
    getHTMLAttributes: baseService.getHTMLAttributes,
    parseURL: baseService.parseURL,
    parsePath: baseService.parsePath,
    parseSrcset: baseService.parseSrcset,
    getDirectives: (imageServiceConfig, imageOptions) => {
        // این قسمت به Astro میگه که از چه عرض‌ها و فرمت‌هایی استفاده کنه.
        return {
            widths: imageOptions.widths || defaultDirectives.widths,
            formats: imageOptions.formats || defaultDirectives.formats,
        };
    },
};