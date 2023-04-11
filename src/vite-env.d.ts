/// <reference types="vite/client" />
declare module "*.module.css" {
  export default classes as { readonly [key: string]: string };
}

declare module "*.module.less" {
  export default classes as { readonly [key: string]: string };
}

declare module "*.less" {
  export default classes as { readonly [key: string]: string };
}
