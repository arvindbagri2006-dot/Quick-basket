import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins:[react()],
  server:{proxy:{'/api':{target:'http://127.0.0.1:5174',changeOrigin:true,configure(proxy){proxy.on('proxyReq',(proxyReq,req)=>{proxyReq.setHeader('x-forwarded-host',req.headers.host||'127.0.0.1:5173')})}}}}
});
