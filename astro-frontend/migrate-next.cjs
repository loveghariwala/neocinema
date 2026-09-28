const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src/components');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    if (content.includes('next/image')) {
        content = content.replace(/import Image from "next\/image";?/g, 'const Image = ({src, alt, className, fill, priority, sizes, ...props}: any) => <img src={src} alt={alt} className={`${className || ""} ${fill ? "w-full h-full object-cover" : ""}`} {...props} loading={priority ? "eager" : "lazy"} />;');
        changed = true;
    }

    if (content.includes('next/link')) {
        content = content.replace(/import Link from "next\/link";?/g, 'const Link = ({href, className, children, ...props}: any) => <a href={href} className={className} {...props}>{children}</a>;');
        changed = true;
    }

    if (content.includes('next/navigation')) {
        content = content.replace(/import .* from "next\/navigation";?/g, 'const useRouter = () => ({ push: (url: string) => window.location.href = url, replace: (url: string) => window.location.replace(url), back: () => window.history.back() }); const useSearchParams = () => new URLSearchParams(typeof window !== "undefined" ? window.location.search : ""); const usePathname = () => typeof window !== "undefined" ? window.location.pathname : ""; const notFound = () => { if(typeof window !== "undefined") window.location.href="/404" };');
        changed = true;
    }

    if (content.includes('next/dynamic')) {
        content = content.replace(/import nextDynamic from "next\/dynamic";?/g, 'const nextDynamic = (importFunc: any, options: any) => { const React = require("react"); const LazyComponent = React.lazy(importFunc); return (props: any) => <React.Suspense fallback={options?.loading ? options.loading() : null}><LazyComponent {...props} /></React.Suspense>; };');
        changed = true;
    }

    if (content.includes('use client')) {
        content = content.replace(/"use client";?\r?\n?/g, '');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Migrated', file);
    }
});
