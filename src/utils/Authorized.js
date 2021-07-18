import RenderAuthorize from '@/components/Authorized';
import {getAuthority} from './authority';
/* eslint-disable eslint-comments/disable-enable-pair */

/* eslint-disable import/no-mutable-exports */
let Authorized = RenderAuthorize(getAuthority()); // Reload the rights component

const reloadAuthorized = () => {
  Authorized = RenderAuthorize(getAuthority());
};

if (typeof window !== 'undefined')
  window.reloadAuthorized = reloadAuthorized;
export {reloadAuthorized};
export default Authorized;