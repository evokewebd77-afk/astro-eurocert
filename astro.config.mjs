import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  build: {
    format: 'directory',
  },
  trailingSlash: 'ignore',
  // 301 redirects (work in `astro dev` / `astro preview`; Apache production
  // uses public/.htaccess, Netlify uses public/_redirects — keep all 3 in sync)
  redirects: {
    '/2017/02/sa-8000-certification': '/post/sa-8000-certification/',
    '/2023/08/slcp-certification-slcp-eurocert-asia': '/post/slcp-certification/',
    '/2019/12/c-tpat-compliance-vs-c-tpat-validation': '/post/ctpat-compliance-vs-validation/',
    '/2019/12/c-tpat-the-new-minimum-security-criteria-from-cbp-for-manufacturers-and-exports': '/post/ctpat-minimum-security-criteria/',
    '/smeta-audit': '/social-audits/sedex/',
    '/sedex-certification': '/social-audits/sedex/',
    '/social/sa-8000': '/social-audits/sa-8000/',
    '/sa-8000-certificate': '/social-audits/sa-8000/',
    '/how-to-get-sa-8000-certificate': '/social-audits/sa-8000/',
    '/iso-9001-certificate': '/management-system/iso-9001/',
    '/iso-14001-certificate': '/management-system/iso-14001/',
    '/iso-45001-certificate': '/management-system/iso-45001/',
    '/iso-27001-certificate': '/management-system/iso-27001/',
    '/iso-50001-certificate': '/management-system/iso-50001/',
    '/iso-3834-certification': '/management-system/iso-3834/',
    '/iso-22000-certification': '/food-certification/iso-22000/',
    '/haccp-2': '/food-certification/haccp/',
    '/ifs': '/food-certification/ifs/',
    '/food/ifs': '/food-certification/ifs/',
    '/atex-certification': '/atex/',
    '/ped-certificate': '/ped/',
    '/pressure-equipment': '/ped/',
    '/ce-certificate-construction-products': '/construction-products/',
    '/all-about-ce-mark-certification': '/ce-certification/',
    '/code-of-conduct-audits': '/social-audits/code-of-conduct/',
    '/slcp': '/social-audits/slcp/',
    '/rmiresponsible-minerals-initiative': '/social-audits/rmi/',
    '/rmi-responsible-minerals-initiative': '/social-audits/rmi/',
    '/rmi/responsible-minerals-initiative': '/social-audits/rmi/',
    '/ctpat': '/social-audits/ctpat/',
    '/privacypolicy': '/privacy-policy/',
    '/ce-marking/atex': '/atex/',
    '/ce-marking/cement': '/cement/',
    '/ce-marking/lifts': '/lifts/',
    '/ce-marking/lvd-emc': '/lvd-emc/',
    '/ce-marking/ped': '/ped/',
    '/ce-marking/pi-mark': '/pi-mark/',
    '/ce-marking/railway': '/railway/',
    '/ce-marking/reach': '/reach/',
    '/ce-marking/rohs': '/rohs/',
    '/ghp': '/food-certification/ghp/',
    '/iso-22000': '/management-system/iso-22000/',
    '/iso-27001': '/management-system/iso-27001/',
    '/iso-28000': '/management-system/iso-28000/',
    '/iso-37001': '/management-system/iso-37001/',
    '/non-gmo-animal-feed': '/food-certification/non-gmo-animal-feed/',
    '/management-system/iso-26000': '/social-audits/iso-26000/',
    '/management-system/iso-22000': '/food-certification/iso-22000/',
  },
});
